import { checkInputs } from './formHandler.js';

// enables tags field
const bulmaTagsInputElement = new BulmaTagsInput('.donation-overview');
const inputElement = document.querySelector('.donation-overview');

// addTag function
function addTag() {
  bulmaTagsInputElement.add(inputElement.value);
  inputElement.value = '';
}

// add tag when user clicks on tags button
document.querySelector('.add-tag').addEventListener('click', () => {
  addTag();
  bulmaTagsInputElement.focus();
});

document.querySelector('.button.submit').addEventListener('click', () => {
  // check if date is in the past
  const section = document.querySelector('.donation-form');
  // add tag when submit is pressed
  addTag();
  if (checkInputs(section) === true) section.submit();
});
