/* eslint-disable no-use-before-define */
import {
  initForm,
  renderButton,
  renderBackButton,
  switchSection,
} from './formHandler.js';
import getEstablishmentsByLocation from './fhrsHandler.js';

const FORM_HANDLERS_ARRAY = [
  userType,
  setupInfo,
  confirmInfo,
  openingTimes,
  submitSetupInfo,
];
// eslint-disable-next-line no-undef
initForm(FORM_HANDLERS_ARRAY);
// The rest of these functions below handle the individual sections
// They need to match the 'section' data attribute in order to get called
function userType(section, formSections, button, backBtn, sectionIndex) {
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
      localStorage.getItem('userType') === 'Fridge' ||
      localStorage.getItem('userType') === 'Business'
    ) {
      button.replaceWith(button.cloneNode(true));
      switchSection(formSections, FORM_HANDLERS_ARRAY, sectionIndex);
    }
  });
}

function setupInfo(section, formSections, button, backBtn, sectionIndex) {
  renderButton('button', 'Next', button);
  renderBackButton(backBtn, true);

  let redirect;
  button.addEventListener('click', () => {
    redirect = true;
    section.querySelectorAll('[name]').forEach((field) => {
      if (field.parentNode.nextSibling != null) {
        field.parentNode.nextSibling.remove();
        field.classList.remove('is-danger');
      }
      if (field.value === '') {
        field.classList.add('is-danger');
        const fieldContainer = field.parentNode;
        const warning = document.createElement('p');
        warning.classList.add('help', 'is-danger', 'is-size-6');
        warning.textContent = 'This field is required.';
        fieldContainer.insertAdjacentElement('afterend', warning);
        redirect = false;
      }
    });
  });
  button.addEventListener('click', () => {
    if (redirect === true) {
      button.replaceWith(button.cloneNode(true));
      switchSection(formSections, FORM_HANDLERS_ARRAY, sectionIndex);
    }
  });
  backBtn.addEventListener('click', () => {
    backBtn.replaceWith(backBtn.cloneNode(true));
    switchSection(formSections, FORM_HANDLERS_ARRAY, sectionIndex, 'prev');
  });
}

function confirmInfo(section, formSections, button, backBtn, sectionIndex) {
  renderButton('button', 'Next', button);
  renderBackButton(backBtn, true);

  // grab result
  getEstablishmentsByLocation({
    name: document.querySelector('[name=establishment-name]').value,
    street: document.querySelector('[name=address-street]').value,
    postCode: document.querySelector('[name=address-post-code]').value,
  }).then((establishment) => {
    if (establishment) {
      console.log(establishment);
      section.querySelector('.establishment-name').textContent =
        establishment.BusinessName;
      section.querySelector('.establishment-type').textContent =
        establishment.BusinessType;
      section.querySelector(
        '.address'
      ).textContent = `${establishment.AddressLine1}, ${establishment.AddressLine2}, ${establishment.AddressLine3}, ${establishment.AddressLine4}`;
      section.querySelector('.post-code').textContent = establishment.PostCode;
    } else {
      section.querySelector('.establishment-name').textContent = `Sorry`;
      button.disabled = true;
    }
  });
  button.addEventListener('click', () => {
    button.replaceWith(button.cloneNode(true));
    switchSection(formSections, FORM_HANDLERS_ARRAY, sectionIndex);
  });
  backBtn.addEventListener('click', () => {
    backBtn.replaceWith(backBtn.cloneNode(true));
    switchSection(formSections, FORM_HANDLERS_ARRAY, sectionIndex, 'prev');
  });
}

function openingTimes(section, formSections, button, backBtn, sectionIndex) {
  renderButton('button', 'Next', button);
  renderBackButton(backBtn, true);

  const switchBtns = section.querySelectorAll('label.pt-0');
  switchBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.currentTarget.parentNode
        .querySelectorAll('input[type=time]')
        .forEach((input) => {
          input.disabled = input.disabled !== true;
          input.value = '';
        });
    });
  });

  button.addEventListener('click', () => {
    button.replaceWith(button.cloneNode(true));
    switchSection(formSections, FORM_HANDLERS_ARRAY, sectionIndex);
  });
  backBtn.addEventListener('click', () => {
    backBtn.replaceWith(backBtn.cloneNode(true));
    switchSection(formSections, FORM_HANDLERS_ARRAY, sectionIndex, 'prev');
  });
}

function submitSetupInfo(section, formSections, button, backBtn, sectionIndex) {
  renderButton('submit', 'Submit', button);
  renderBackButton(backBtn, true);

  async function submit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('type', localStorage.getItem('userType'));
    await getEstablishmentsByLocation({
      name: document.querySelector('[name=establishment-name]').value,
      street: document.querySelector('[name=address-street]').value,
      postCode: document.querySelector('[name=address-post-code]').value,
    }).then((establishment) => {
      formData.append('name', establishment.BusinessName);
      formData.append('longitude', parseFloat(establishment.geocode.longitude));
      formData.append('latitude', parseFloat(establishment.geocode.latitude));
      formData.append(
        'address',
        `${establishment.AddressLine1}, ${establishment.AddressLine2}, ${establishment.AddressLine3}, ${establishment.AddressLine4}`
      );
      formData.append('postcode', establishment.PostCode);
      formData.append('council', establishment.LocalAuthorityName);
    });
    document.querySelectorAll('.working-hours').forEach((input, index) => {
      const weekMap = ['mon', 'tues', 'wed', 'thu', 'fri', 'sat', 'sun'];
      if (input.querySelector('.switch').checked === true) {
        formData.append(
          `${weekMap[index]}`,
          `${input.querySelector('[name=start-time]').value}-${
            input.querySelector('[name=finish-time]').value
          }`
        );
      } else {
        formData.append(`${weekMap[index]}`, 'closed');
      }
    });
    for (const value of formData.values()) {
      console.log(value);
    }
    const response = await fetch('/setup', {
      method: 'POST',
      body: formData,
      timeout: 4000,
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
    console.log(response.json());
    // return response.json();
  }
  button.addEventListener('click', submit);
  backBtn.addEventListener('click', () => {
    backBtn.replaceWith(backBtn.cloneNode(true));
    switchSection(formSections, FORM_HANDLERS_ARRAY, sectionIndex, 'prev');
  });
}
