const colors = ["#FC4F3F","#B77DE3","#66B8FA","#52E380","#FCFA5B"] // colors list
let next_color; // index for the next color

const fakeList = document.getElementById("fakeList");


// Returns the next color on the list. Once reached its final element, it comes back to the first
function getColor() {
  color = colors[next_color];
  if (next_color == colors.length - 1)
    next_color = 0;
  else
    next_color++;
  return color;
}

// Adds a new list element.
// content: content the new element will have
// hoverContent: content the new element will show when it's hovered
// index: z-index of the li, it had to be a parameter for some issues with the code being asynchronous
// list: the list to which the element is added
// empty: boolean, indicates whether it is an empty partition
function addElement(content,hoverContent,index,list,empty) {
  const li = document.createElement("li");

  li.appendChild(createLiContent(content,hoverContent,empty));

  // Set li's color depending on whether it's an empty partition
  if (empty) {
    li.style.setProperty("--clr","#594C53");
    li.style.setProperty("--clr2","#fff");
  } else {
    li.style.setProperty("--clr",getColor());
    li.style.setProperty("--clr2","#000");
  }

  // Sets the z-index of the li
  li.style.setProperty("--i",index);

  list.appendChild(li);

  // Lastly, adjusts the padding as well as the width
  adjustPadding(list);

  // To adjust the width, it adds a element exacly like the previous to a decoy ul that the user doesn't see
  if (list != fakeList) {
    // To save resources, the elements are erased as a new one is added
    for (var children of fakeList.children)
      children.remove();
    addElement(content,hoverContent,0,fakeList,empty);
    // By testing the width on the decoy ul, we are able to know how much the main list will need
    if (list.style.width == "" || parseInt(list.style.width.slice(0,-2) < fakeList.children[0].offsetWidth)) {
      list.style.width = fakeList.children[0].offsetWidth + "px";
    }
  }
}

// Creates the content that's gonna be appended to the li element
function createLiContent (content,hoverContent,empty) {
  const a = document.createElement("a");
  const beforeHover = document.createElement("span");
  const afterHover = document.createElement("span");

  // Creates a empty icon depending on whether the li element is empty
  if (empty) {
    const span = document.createElement("span");
    const i = document.createElement("i");
    span.classList.add("icon");
    i.classList.add("fa-solid","fa-notdef");
    span.appendChild(i);
    a.appendChild(span);
  }

  // Content by default
  beforeHover.classList.add("beforeHover");
  beforeHover.appendChild(document.createTextNode(content));

  // Content shown when hovering
  afterHover.classList.add("afterHover");
  afterHover.appendChild(document.createTextNode(hoverContent))

  // Groups the elements to add to the li, so that we can add them all together
  let documentFragment = document.createDocumentFragment();
  documentFragment.appendChild(a);
  documentFragment.appendChild(afterHover);
  documentFragment.appendChild(beforeHover);
  return documentFragment;
}

// Changes the list elements padding for them to fit on the screen
function adjustPadding(list) {
  elements = list.children; // These both variables are merely created to abbreviate
  length = elements.length;
  
  // Length in which the padding is decreased, at first it is 2vh, from 11 elements, it will be 1vh, and from 17 elements will be 0.5vh
  const MAX_LENGTH_1 = 11, MAX_LENGTH_2 = 17;

  if (length == MAX_LENGTH_1) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.padding = "1vh";
    }
  } else if (length > MAX_LENGTH_1 && elements.length < MAX_LENGTH_2) {
    elements[length - 1].style.padding = "1vh";
  } else if (length == MAX_LENGTH_2) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.padding = "0.5vh";
    }
  } else if (length > MAX_LENGTH_2) {
    elements[length - 1].style.padding = "0.5vh";
  }
}
