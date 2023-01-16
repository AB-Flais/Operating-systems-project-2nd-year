const next = document.getElementById('next');
const previous = document.getElementById('previous');

let currentInstant = initialInstant;
let text;

function download() {
  // Generates the text that the download file will have. The code could have been abbreviated, although this way is more visual
  if (!text) { // Once generated, for next downloads there's no need to generate it again
    text = "";
    for (let instant of instants) {
      text += instant.instant;
      text += ' ';
      for (partition of instant.memory) {
        text += '[';
        console.log(partition);
        text += partition.startAddress;
        text += ' ';
        text += partition instanceof EmptyPartition ? 'hueco':partition.name;
        text += ' ';
        text += partition.getSize();
        text += '] ';
      }
      text += ' \n';
    }
  }

  // Creates an anchor element, which links to a download with the text previously generated.
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', 'gestormemoria.txt');

  element.style.display = 'none';
  document.body.appendChild(element);

  // Automatically clicks the button and erases it
  element.click();

  document.body.removeChild(element);
}

function nextInstant() {
  currentInstant++;

  // If the current instant is 1 means that previously we were on the 0 and the previous button was disabled. Enables it again
  if (currentInstant == 1)
    enable(previous)

  // Disables next button as there's no more instants to see
  if (currentInstant == instants.length - 1)
    disable(next);

  // Current list goes
  lists[currentInstant - 1].classList.add('gone');
  lists[currentInstant - 1].style.transform = 'translateY(-50vh)';
  setTimeout(() => {
    lists[currentInstant - 1].style.display = 'none';
  }, 1500)

  // Next list enters
  lists[currentInstant].style.display = "initial";
  setTimeout(() => {
    lists[currentInstant].classList.add('show');
    lists[currentInstant].style.transform = "skewY(-15deg)";
  },50);
}

function previousInstant() {
  currentInstant--;

  // Disables previous as there are, obviously, no more instants before the first one
  if (currentInstant == 0)
    disable(previous);

  // Enables the next button that was disabled for reaching the final instant
  if (currentInstant == instants.length - 2)
    enable(next);

  // Current instant goes
  lists[currentInstant + 1].classList.remove('show');
  lists[currentInstant + 1].style.transform = 'translateY(50vh)';
  setTimeout(() => {
    lists[currentInstant + 1].style.display = 'none';
  }, 1500)

  // Previous instant shows
  lists[currentInstant].style.display = "initial";
  setTimeout(() => {
    lists[currentInstant].classList.remove('gone');
    lists[currentInstant].style.transform = "skewY(-15deg)";
  },50);

  // Note that instead of adding classes as in the rest of transitions on the code, here we remove them to do them backwards
}

function disable(element) {
  // Turns off the link for it to do nothing, and by a class system indicates it visually when hovering
  element.href = "javascript:";
  element.classList.remove("screen_3_button_hover");
}

function enable(element) {
  // Turns on the link and enables again the hover colorful effect
  element.href = "javascript:" + element.id + "Instant()";
  element.classList.add("screen_3_button_hover");
}
