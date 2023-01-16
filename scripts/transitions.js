const screen_1_elements = document.getElementsByClassName('screen_1');
const screen_3_elements = document.getElementsByClassName('screen_3');
const buttons_divs = document.getElementsByClassName('buttons_div');
const span = document.getElementById('fileName');
const submit = document.getElementById('submit');

let mode; // True: best gap; false: worst gap

/* Let's clear up, in every transition, there are two components, the add of a new class (.show or .gone) and
   the set of the display of the element in question. Both things are separated for a timeout, which is not just
   for aesthetic reasons. The class hidden, that makes the elements to stay not visible to the user, includes
   sets the display to none, so that the user cant click it. If we did both at the same time the animation would
   cut because in css, display is not a value able to transition unlike opacity. The thing with opacity is that
   even if an element has 0 opacity, it can still be clicked, so the display none is needed. Sommething similar
   happens with the fade out, to not cut the animation first goes the class gone and then, 1.5 seconds later
   the display changes to none so that the element doesn't stay there just apparently gone */

function screen_1() {
  // screen_1 enters
  screen_1_elements[0].style.display = 'flex';
  screen_1_elements[1].style.display = 'flex';
  show(screen_1_elements);
}

// Choice: boolean, whether the user has chosen best gap or worst gap
function screen_2(choice) {
  mode = choice;
  // screen_1 go
  screen_1_elements[0].classList.add('gone');
  setTimeout(() => {
    screen_1_elements[1].classList.add('gone');
  }, 300)
  setTimeout(() => {
    screen_1_elements[0].style.display = 'none';
    screen_1_elements[1].style.display = 'none';
  }, 1500)
  // screen_2 enters
  label.style.display = 'initial';
  setTimeout(() => {
    label.classList.add('show');
  }, 600);
}

function screen_3() {
  // If the file selected is not valid the color of the text of error will flicker for a second
  if (span.innerText == errorInput.toUpperCase()) {
    let contador = 0;
    let intermittent = setInterval(function(){
      if (contador % 2 == 0)
        span.style.color = '#ff1867';
      else
        span.style.color = '#fff';
      if (contador >= 10)
        clearInterval(intermittent);
      contador++;
    },100);
  } else { // Otherwise both the submit button and the input file will disable
    input.disabled = true;
    submit.href = 'javascript:';
    // screen_2 go
    label.classList.add('gone');
    setTimeout(() => {
      submit.classList.add('gone');
    }, 300)
    setTimeout(() => {
      label.style.display = 'none';
      submit.style.display = 'none';
    }, 1500)

    //screen_3 enters
    screen_3_elements[0].style.display = 'flex';
    for (let i = 1; i < screen_3_elements.length; i++)
      screen_3_elements[i].style.display = 'block';

    // Starts main code
    processFile(getFile());

    // Once finished the first list shows
    show(screen_3_elements);
  }
}

// Adds recursively the class show to a list of elements
function show(elements, i = 0) {
  setTimeout(() => {
    elements[i].classList.add('show');
    i++;
    if (elements.length != i)
      show(elements,i);
  }, 300)
}

function getMode() {
  return mode;
}
