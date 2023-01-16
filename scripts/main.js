const MINIMUM_MEMORY_REQUIRED = 100; // Minimum memory that a process must have, otherwise it will be ignored
const MEMORY_CAPACITY = 2000;
var initialInstant = 1;              // First instant shown
const processes = [];                // Array that contains all the valid processes read from the file
const instants = [];                 // Contains all instants except for repeated ones
const lists = [];                    // contains a ul element for each instant

const lists_container = document.getElementById("lists_container"); // Empty div where each one of the elements of list is appended

class Process {
  constructor(name, arrivalInstant, memoryRequired, executionTime) {
    this.name = name;
    this.arrivalInstant = parseInt(arrivalInstant);
    this.memoryRequired = parseInt(memoryRequired);
    this.departureInstant = parseInt(executionTime) + this.arrivalInstant;
  }
  advanceInstant() {
    this.departureInstant--;
    this.arrivalInstant--;
  }
  delay() {
    this.departureInstant++;
    this.arrivalInstant++;
  }
  setstartAddress(startAddress) {
    this.startAddress = startAddress;
    this.endAddress = startAddress + this.memoryRequired - 1;
  }
  getSize() { // I only wrote this function so that a Process instance can be treated just like an EmptyPartition one when checking it's size
    return this.memoryRequired;
  }
}

class EmptyPartition {
  constructor(startAddress, endAddress) {
    this.startAddress = startAddress;
    this.endAddress = endAddress;
  }
  getSize() {
    return this.endAddress - this.startAddress + 1;
  }
}


// This function loads the processes on the file and create the lists to display
function processFile(file) {
  // First of all, the selected file is readed by a FileReader
  const reader = new FileReader();

  reader.readAsText(file);
  reader.addEventListener("load", () => {
    // Transform the string into the processes we will work with
    interpretResult(reader.result, processes);

    // The instant 0 shows the empty state of the memory before any process could arrive. In addition, it has some uses that will be seen later
    let instant = 0;

    instants.push({instant: instant, memory: [new EmptyPartition(0, MEMORY_CAPACITY - 1)]}) // Every instant will be an object with its identifier (instant)
                                                                                            // and an array with the partitions that the memory contains (memory)

    // The loop will create new instants as long as there's at least one process that hasn't finished yet
    while (processes.some((process) => process.departureInstant > 0)) {
      instant++;
      processes.map(process => process.advanceInstant()) // little reminder: advanceInstant decreases in one the arrivalInstant as well as the departureInstant
      newInstant(instant);                               //                  so processes arrive when its arrivalInstant is 0 and the same with leaving and departureInstant
    }

    // Remove duplicates
    for (let i = 0; i < instants.length - 1; i++)
      if (instants[i].memory.equals(instants[i+1].memory)) {
        instants.splice(i + 1, 1);
        i--;
      }

    // If the initial instant doesn't exist, it starts with the 0 one. Regardless of the processes read on the file, there will always be an instant 0
    if (!instants[initialInstant]) {
      initialInstant = 0;
      // As there won't be a previous instant, the "previous" button is disabled (function written at thirdScreenActions.js)
      disable(document.getElementById("previous"));
      // If besides of not existing the initial instant, there's just the first one, the next button is also disabled
      if (instants.length == 1)
        disable(document.getElementById("next"));
    }

    // Transforms the instants into showable litsts
    createLists();

    // Firstly, the display "none" is changed
    lists[initialInstant].style.display = "initial";

    // Then, the first list is shown
    setTimeout(() => {
      lists[initialInstant].classList.add("show");
      lists[initialInstant].style.transform = "skewY(-15deg)";
    }, 300);
  });
}

// Gets the processes from the string read from the file
function interpretResult(content, processes) {
  content = content.replace("\r", "");    // As far as i'm concerned, \n\r is used in windows as a new line, while \r is not used in other OS, \n is universal
  const lines = content.split("\n");      // lines: the content separated in lines
  const words = [];                       // words: every line is also separated in words. it is a two-dimensional array

  for (let line of lines) {
    words.push(line.split(" "));
  }

  for (let line of words) {             /* words is a two-dimesional array, this means every words[x][x] is a word.
                                           However, every words[x] is an array of words that represents a line.
                                           That's why the parameter is called line */
    // little reminder:
    // line[0] = name of the process
    // line[1] = arrivalInstant, must be positive a positive value
    // line[2] = memoryRequired, must not exceed memory capacity nor be lower than MINIMUM_MEMORY_REQUIRED
    // line[3] = executionTime, must be positive a positive value
    if (line[1] > 0 && line[2] <= MEMORY_CAPACITY && line[2] >= MINIMUM_MEMORY_REQUIRED && line[3] > 0)
      processes.push(new Process(line[0], line[1], line[2], line[3]));
  }
}

// Creates a new Instant
function newInstant(instant) {
  // The memory of the previous instant is used as a starting point
  let memory = [...instants[instant - 1].memory];

  eraseProcesses(memory);

  addProcesses(memory);

  instants.push({instant: instant, memory: memory})
}

// Erases a process from the memory
function eraseProcesses(memory) {
  // Starts by looking for the processes that have finished
  const finalizedProcesses = [];
  for (let process of processes)
    if (process.departureInstant == 0)
      finalizedProcesses.push(process);

  // Replaces each finalized process for an empty partition with placed at the same spot
  for (let process of finalizedProcesses)
    memory.splice(memory.indexOf(process), 1, new EmptyPartition(process.startAddress,process.endAddress));

  compactEmptyPartitions(memory);
}

// Compats the small empty partitions in a row into a big one
function compactEmptyPartitions(memory) {
  for (let i = 0; i < memory.length - 1; i++)
    // If after the current empty partition there's another, both are replaced for a big one
    if (memory[i] instanceof EmptyPartition && memory[i + 1] instanceof EmptyPartition) {
      memory.splice(i, 2, new EmptyPartition(memory[i].startAddress, memory[i + 1].endAddress));
      i--;
    }
}

// Adds a process to the memory
function addProcesses(memory) {
  // Starts by looking for the empty partitions, as well as the processes that should arrive in this instant
  const emptyPartitions = [];
  for (partition of memory)
    if (partition instanceof EmptyPartition)
      emptyPartitions.push(partition);

  const arrivalProcesses = [];
    for (let process of processes)
      if (process.arrivalInstant == 0)
        arrivalProcesses.push(process);

  // For each process that should arrive
  for (let process of arrivalProcesses) {
    // If there's an empty partition equal or greater than the memory that requires
    if (hasEmptySpace(emptyPartitions, process.memoryRequired)) {
      // Sets the process start address in the best empty partition depending on the mode selected (Best gap or worst gap)
      process.setstartAddress(bestEmptyPartition(emptyPartitions, process.memoryRequired));
      // Cuts the empty partition placed in the address to make room for the process
      cutEmptySpace(process.startAddress, process.memoryRequired, emptyPartitions);
    } else
      // If there's no room for the process in memory, the process will try again in the next instant
      process.delay();
  }

  // Erases the empty spaces in the initial memory to later push the new empty spaces
  for (let i = 0; i < memory.length; i++)
    if (memory[i] instanceof EmptyPartition) {
      memory.splice(i, 1);
      i--;
    }

  for (let i = 0; i < emptyPartitions.length; i++)
    memory.push(emptyPartitions[i]);

  // The processes that haven't been delayed are pushed into the memory
  for (let i = 0; i < arrivalProcesses.length; i++)
    if (arrivalProcesses[i].arrivalInstant == 0)
      memory.push(arrivalProcesses[i]);

  // Orders the partitions that have been pushed into the memory without any order
  memory.sort(comparePartitions);
}

// Checks if there's room for a process in memory
function hasEmptySpace(emptyPartitions, memoryRequired) {
  for (let partition of emptyPartitions)
    if (partition.getSize() >= memoryRequired)
      return true;
  return false;
}

// Finds the best empty partition depending on the mode selected
function bestEmptyPartition(emptyPartitions, memoryRequired) {
  let best;
  if (getMode()) { // little reminder: true: best gap; false: worst gap
    // As the objective is to find the smallest one, the biggest possible empty partition is used as a starting point to compare
    best = new EmptyPartition(0, MEMORY_CAPACITY - 1);
    for (let partition of emptyPartitions)
      // If the partition is big enough for the process to fit in it and it's smaller than the smallest found until now, it turns into the best
      if (partition.getSize() >= memoryRequired && partition.getSize() < best.getSize())
        best = partition;
  } else {
    // It works the same way as in the best gap case, but looking for the largest empty partition
    best = new EmptyPartition(0, 0);
    for (let partition of emptyPartitions)
      if (partition.getSize() >= memoryRequired && partition.getSize() > best.getSize())
        best = partition;
  }
  // Finally returns the start address of the best partition found
  return best.startAddress;
}

// Resizes an empty space for a process to fit in the gap left
function cutEmptySpace(startAddress, size, emptyPartitions) {
  let i;
  // First of all, looks for the empty partition to cut
  for (i in emptyPartitions)
    if (emptyPartitions[i].startAddress == startAddress)
      break;

  // As the index isn't declared in the for, once it breaks out of it, the index is still accesible
  // The empty partition is replaced for one whose start address is moved after the size of the process that's gonna be placed in that gap
  emptyPartitions[i] = new EmptyPartition(emptyPartitions[i].startAddress + size, emptyPartitions[i].endAddress);

  // In the case that the empty partition had the same size as the required (so now has null size), it's erased
  if (emptyPartitions[i].getSize() <= 0) // The case where the empty partition finishes with a negative size is checked, although it shouldn't happen
    emptyPartitions.splice(i, 1);
}

// Function used to compare the order of the partitions
function comparePartitions(a, b) {
  // If the sort function is given a function as a parameter, that function has to return -1 in case that a goes before b and vice versa
  // The ordering criterion here is the start address, so that those partitions with the lower start address go first
  if (a.startAddress < b.startAddress)
    return -1;
  if (a.startAddress > b.startAddress)
    return 1;
  // This is for the case that both are equal by the ordering criterion, although it shouldn't happen if the code executes correctly
  return 0;
}

// Creates a list for each instant
function createLists() {
  for (let instant of instants) {
    ul = document.createElement("ul");

    // To swipe between lists, the posterior to the first one come from the bottom, so they are .hidden. The .list class is used to later group all the lists
    ul.classList.add("list", "hidden");
    // And the ones that go before the first one comes from the top, so they are already .gone, the animation of going is just reverted by erasing the class
    if (instant.instant < initialInstant)
      ul.classList.add("show", "gone");

    let index = 0;   // z-index of each new list item, decreases for every new one
    next_color = 0;  // Color for each new li, loops through an array of colors and always start for the same one

    for (let partition of instant.memory) {
      // When hovering, apart from the name, the address will be shown, in case that the partition only occupies one unit,
      // it's a nonsense showing startAddress - endAddress so it only shows the startAddress
      let address = " " + partition.startAddress + (partition.getSize() == 1 ? "":" - " + partition.endAddress) ;
      if (partition instanceof EmptyPartition)
        addElement("EMPTY", "EMPTY" + address, index, ul, true);
      else
        addElement(partition.name, partition.name + address, index, ul);
      index--;
    }
    // Finally its title is set to its identifier as instant
    ul.children[0].style.setProperty("--title", "'instant " + instant.instant +"'");
    lists_container.appendChild(ul);
  }
  // Lists pushes every list created
  lists.push(...document.getElementsByClassName("list"));
}
