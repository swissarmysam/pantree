import { checkInputs } from './formHandler.js';

// enables tags field
BulmaTagsInput.attach();

document.querySelector('#submitBtn').addEventListener('click', () => {
  // check if date is in the past
  const section = document.querySelector('.donation-form');
  if (checkInputs(section) === true) section.submit();
});
