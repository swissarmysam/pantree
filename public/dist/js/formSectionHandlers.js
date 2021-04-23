/* eslint-disable no-use-before-define */
import {
  initForm,
  renderButton,
  renderBackButton,
  switchSection,
} from './formHandler.js';

const FORM_HANDLERS_ARRAY = [userType, setupInfo, confirmInfo, openingTimes];

initForm(FORM_HANDLERS_ARRAY);
// The rest of these functions below handle the individual sections
// They need to match the 'section' data attribute in order to get called
function userType(section, formSections, button, backBtn) {
  renderButton('button', 'Next', button, true);
  renderBackButton(backBtn, false);

  const typeBtns = section.querySelectorAll('[user-type]');

  function setUser(e) {
    e.preventDefault();
    typeBtns.forEach((btn) => btn.classList.remove('is-active'));
    e.currentTarget.classList.toggle('is-active');
    localStorage.setItem(
      'userType',
      `${e.currentTarget.getAttribute('user-type')}`
    );
    // make button clickable if a user type is selected
    button.disabled = false;
  }

  typeBtns.forEach((btn) => {
    btn.addEventListener('click', setUser);
  });

  button.addEventListener('click', () => {
    if (
      localStorage.getItem('userType') === 'Community Fridge' ||
      localStorage.getItem('userType') === 'Food Business'
    ) {
      button.replaceWith(button.cloneNode(true));
      switchSection(formSections, FORM_HANDLERS_ARRAY, 'next');
    }
  });
}

function setupInfo(section, formSections, button, backBtn) {
  renderButton('button', 'Next', button);
  renderBackButton(backBtn, true);

  button.addEventListener('click', () => {
    button.replaceWith(button.cloneNode(true));
    switchSection(formSections, FORM_HANDLERS_ARRAY, 'next');
  });
  backBtn.addEventListener('click', (e) => {
    backBtn.replaceWith(backBtn.cloneNode(true));
    switchSection(formSections, FORM_HANDLERS_ARRAY);
  });
}

function confirmInfo(section, formSections, button, backBtn) {
  renderButton('button', 'Confirm', button);
  renderBackButton(backBtn, true);

  button.addEventListener('click', () => {
    button.replaceWith(button.cloneNode(true));
    switchSection(formSections, FORM_HANDLERS_ARRAY, 'next');
  });
  backBtn.addEventListener('click', (e) => {
    console.log('YO');
    backBtn.replaceWith(backBtn.cloneNode(true));
    switchSection(formSections, FORM_HANDLERS_ARRAY);
  });
}

function openingTimes(section, formSections, button, backBtn) {
  renderButton('button', 'Next', button);
  renderBackButton(backBtn, true);

  button.addEventListener('click', () => {
    button.replaceWith(button.cloneNode(true));
    switchSection(formSections, FORM_HANDLERS_ARRAY, 'next');
  });
  backBtn.addEventListener('click', (e) => {
    backBtn.replaceWith(backBtn.cloneNode(true));
    switchSection(formSections, FORM_HANDLERS_ARRAY);
  });
}
