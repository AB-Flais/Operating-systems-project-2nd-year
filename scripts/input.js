const label = document.getElementById("label");
const input = document.getElementById("inputTag");

let file;
const errorInput = "Error: non-valid format"; // Message displayed in the span element when a non-valid file is selected
const wrongInputColor = "#ff1867"; // Red
const rightInputColor = "#6ef43e"; // Green

// Event listeners to set up the input element for files to be dragged and dropped in it
label.addEventListener("dragover", (event) => {
  event.stopPropagation();
  event.preventDefault();
  // Style the drag-and-drop as a "copy file" operation.
  event.dataTransfer.dropEffect = "copy";
});

label.addEventListener("drop", (event) => {
  event.stopPropagation();
  event.preventDefault();
  const fileList = event.dataTransfer.files;

  showSubmit(fileList[0]);
});

function showSubmit(inputFile) {
  /* When dragging and dropping into the input element, its attribute "files" doesn't change. That means that if the user
     selects a file, then drags another file ("files" doesn't change) and lastly selects the first file again, the onchange event listener
     won't fire because as far as onchange is concerned, the same file has been selected twice in a row, therefore this function won't
     execute and the variable "file" won't get the value of the file selected.
     To solve that, every time the user selects a file, the input element attribute "files" is erased */
  input.value="";
  file = inputFile;

  if (file.name.substr(-4) != ".txt") {  // If it has a non-valid extension
    label.style.setProperty("--border-clr",wrongInputColor);

    span.style.color = wrongInputColor;
    span.innerText = errorInput;
  } else {
    label.style.setProperty("--border-clr",rightInputColor);

    span.style.color = rightInputColor;
    span.innerText = file.name;

    // Shows #submit element if it's not already shown
    if (!submit.classList.contains("show")) {
      submit.style.display = "flex";

      // Without the timeout, the previous line would cut the animation. Anyway, its duration is too short for the user to notice
      setTimeout(() => {
        submit.classList.add("show");
      }, 100);
    }
  }
}

function getFile() {
  return file;
}
