/* eslint-disable no-restricted-globals */
/* eslint-disable no-use-before-define */
import {
  initForm,
  renderButton,
  renderBackButton,
  renderCard,
  switchSection,
  checkInputs,
} from './formHandler.js';
import getEstablishmentsByLocation from './fhrsHandler.js';

const FORM_HANDLERS_ARRAY = [
  userType,
  setupInfo,
  selectInfo,
  editInfo,
  openingTimes,
  submitSetupInfo,
  redirectToDashboard,
];
// eslint-disable-next-line no-undef
window.onload = window.localStorage.clear();
initForm(FORM_HANDLERS_ARRAY);

function getUrlParam() {
  const url = window.location.href;
  const urlArr = url.split('/');
  return urlArr[4];
}

function setActiveEstablishment(e) {
  document.querySelectorAll('.establishment').forEach((establishment) => {
    establishment.classList.remove('is-light', 'is-primary');
    establishment.querySelector('.is-outlined').classList.remove('is-focused');
  });
  localStorage.setItem(
    'name',
    e.currentTarget.parentNode.querySelector('.establishment-name').textContent
  );
  e.currentTarget.parentNode.classList.add(
    'is-light',
    'is-primary',
    'is-selected'
  );
  e.currentTarget.classList.add('is-focused');
  document.querySelector('.primary-action').disabled = false;
}
// The rest of these functions below handle the individual sections
// They need to match the 'section' data attribute in order to get called
function userType(section, formSections, button, backBtn, sectionIndex) {
  renderButton('button', 'Next', button, true);
  renderBackButton(
    backBtn,
    formSections,
    FORM_HANDLERS_ARRAY,
    sectionIndex,
    false
  );

  const typeBtns = section.querySelectorAll('[user-type]');

  if (localStorage.getItem('userType') !== null) {
    button.disabled = false;
    section
      .querySelector(`[user-type=${localStorage.getItem('userType')}]`)
      .classList.add('is-active');
  }

  function setUser(e) {
    e.preventDefault();
    typeBtns.forEach((btn) => btn.classList.remove('is-active'));
    e.currentTarget.classList.add('is-active');
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
      backBtn.replaceWith(backBtn.cloneNode(true));
      switchSection(formSections, FORM_HANDLERS_ARRAY, sectionIndex);
    }
  });
}

function setupInfo(section, formSections, button, backBtn, sectionIndex) {
  renderButton('button', 'Next', button);
  renderBackButton(backBtn, formSections, FORM_HANDLERS_ARRAY, sectionIndex);

  button.addEventListener('click', () => {
    if (checkInputs(section) === true) {
      button.replaceWith(button.cloneNode(true));
      backBtn.replaceWith(backBtn.cloneNode(true));
      switchSection(formSections, FORM_HANDLERS_ARRAY, sectionIndex);
    }
  });
}

function selectInfo(section, formSections, button, backBtn, sectionIndex) {
  renderButton('button', 'Next', button, true);
  renderBackButton(backBtn, formSections, FORM_HANDLERS_ARRAY, sectionIndex);
  const message = section.querySelector('.message-body');
  const postcode = document.querySelector('[name=address-post-code]').value;
  message.parentNode.classList.remove('is-danger');
  message.innerHTML = `Here are all the results for <strong>${postcode},</strong> select your establishment from the list and click <strong>Next</strong>. If you can't find it make sure your postcode is correct.`;
  // grab results
  getEstablishmentsByLocation({
    postCode: postcode,
  }).then((establishments) => {
    section.querySelectorAll('.establishment').forEach((el) => el.remove());
    if (establishments.length !== 0) {
      establishments.forEach((establishment) => {
        renderCard(
          section,
          establishment.BusinessName,
          establishment.BusinessType,
          `${establishment.AddressLine1}, ${establishment.AddressLine2}, ${establishment.AddressLine3}, ${establishment.AddressLine4}`
            .split(' ,')
            .join(''),
          establishment.PostCode
        );
      });
      // add event listener
      section
        .querySelectorAll('.is-outlined')
        .forEach((btn) =>
          btn.addEventListener('click', setActiveEstablishment)
        );
    } else {
      document.querySelector(
        '.form-title'
      ).textContent = `Sorry we can't find a match`;
      message.innerHTML = `
      We can't find an establishment that matches <strong>${postcode}</strong> please make sure your postcode is correct and that your establishment is registered with the <strong>Food Standards agency.</strong>
      `;
    }
    message.parentNode.classList.add(
      establishments.length === 0 ? 'is-danger' : 'is-info'
    );
  });
  button.addEventListener('click', () => {
    button.replaceWith(button.cloneNode(true));
    backBtn.replaceWith(backBtn.cloneNode(true));
    switchSection(formSections, FORM_HANDLERS_ARRAY, sectionIndex);
  });
}

function editInfo(section, formSections, button, backBtn, sectionIndex) {
  renderButton('button', 'Confirm', button);
  renderBackButton(backBtn, formSections, FORM_HANDLERS_ARRAY, sectionIndex);

  const displayName = section.querySelector('[name=establishment-name]');
  if (displayName.value === '') {
    displayName.value = localStorage.getItem('name');
  }

  button.addEventListener('click', () => {
    if (checkInputs(section) === true) {
      button.replaceWith(button.cloneNode(true));
      backBtn.replaceWith(backBtn.cloneNode(true));
      switchSection(formSections, FORM_HANDLERS_ARRAY, sectionIndex);
    }
  });
}

function openingTimes(section, formSections, button, backBtn, sectionIndex) {
  renderButton('button', 'Next', button);
  renderBackButton(backBtn, formSections, FORM_HANDLERS_ARRAY, sectionIndex);

  button.addEventListener('click', () => {
    button.replaceWith(button.cloneNode(true));
    backBtn.replaceWith(backBtn.cloneNode(true));
    switchSection(formSections, FORM_HANDLERS_ARRAY, sectionIndex);
  });
}

function submitSetupInfo(section, formSections, button, backBtn, sectionIndex) {
  renderButton('submit', 'Submit', button);
  renderBackButton(backBtn, formSections, FORM_HANDLERS_ARRAY, sectionIndex);

  async function submit(e) {
    e.preventDefault();
    button.disabled = true;

    const formData = {
      account: getUrlParam(),
      type: localStorage.getItem('userType'),
      // eslint-disable-next-line prettier/prettier
      establishmentName: document.querySelector('[name=establishment-name]').value,
      location: {
        coordinates: null,
        address: null,
        postcode: null,
      },
      openingHours: {
        mon: {
          open: false,
          hours: null,
        },
        tues: {
          open: false,
          hours: null,
        },
        weds: {
          open: false,
          hours: null,
        },
        thurs: {
          open: false,
          hours: null,
        },
        fri: {
          open: false,
          hours: null,
        },
        sat: {
          open: false,
          hours: null,
        },
        sun: {
          open: false,
          hours: null,
        },
      },
      localAuthority: {
        council: null,
      },
    };
    await getEstablishmentsByLocation({
      name: localStorage.getItem('name'),
      postCode: document.querySelector('[name=address-post-code]').value,
    }).then((establishments) => {
      const establishment = establishments[0];
      formData.location.coordinates = [
        parseFloat(establishment.geocode.latitude),
        parseFloat(establishment.geocode.longitude),
      ];
      // eslint-disable-next-line prettier/prettier
      formData.location.address = `${establishment.AddressLine1}, ${
        establishment.AddressLine2
      }, ${establishment.AddressLine3}, ${establishment.AddressLine4}`.split(' ,').join('');
      formData.location.postcode = establishment.PostCode;
      formData.localAuthority.council = establishment.LocalAuthorityName;
    });
    document.querySelectorAll('.working-hours').forEach((input, index) => {
      const weekMap = ['mon', 'tues', 'weds', 'thurs', 'fri', 'sat', 'sun'];
      if (input.querySelector('.switch').checked === true) {
        formData.openingHours[weekMap[index]].open = true;
        formData.openingHours[weekMap[index]].hours = `${
          input.querySelector('[time-interval=start]').value
        }-${input.querySelector('[time-interval=finish]').value}`;
      }
    });
    const request = await fetch(`/setup`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (!res.ok) {
        const errorMessage = res.text();
        throw new Error(errorMessage);
      } else if (res.ok) {
        button.replaceWith(button.cloneNode(true));
        backBtn.replaceWith(backBtn.cloneNode(true));
        switchSection(formSections, FORM_HANDLERS_ARRAY, sectionIndex);
      }
    });
  }
  button.addEventListener('click', submit);
}

function redirectToDashboard(
  section,
  formSections,
  button,
  backBtn,
  sectionIndex
) {
  renderButton('button', 'Go to dashboard', button);
  renderBackButton(
    backBtn,
    formSections,
    FORM_HANDLERS_ARRAY,
    sectionIndex,
    false
  );
  button.addEventListener('click', () => {
    location.href = `/donations/${getUrlParam()}`;
  });
}
