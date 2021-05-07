/* eslint-disable no-restricted-globals */
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
  redirectToDashboard,
];
// eslint-disable-next-line no-undef
initForm(FORM_HANDLERS_ARRAY);

function getUrlParam() {
  const url = window.location.href;
  const urlArr = url.split('/');
  return urlArr[4];
}

const switchBtns = document.querySelectorAll('label.pt-0');
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
// The rest of these functions below handle the individual sections
// They need to match the 'section' data attribute in order to get called
function userType(section, formSections, button, backBtn, sectionIndex) {
  console.log('Section', sectionIndex);
  renderButton('button', 'Next', button, true);
  renderBackButton(backBtn, false);

  const typeBtns = section.querySelectorAll('[user-type]');

  if (localStorage.getItem('userType') !== null) {
    button.disabled = false;
    section
      .querySelector(`[user-type=${localStorage.getItem('userType')}]`)
      .classList.toggle('is-active');
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
      switchSection(formSections, FORM_HANDLERS_ARRAY, sectionIndex);
    }
  });
}

function setupInfo(section, formSections, button, backBtn, sectionIndex) {
  console.log('Section', sectionIndex);
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
  console.log('Section', sectionIndex);
  renderButton('button', 'Next', button, true);
  renderBackButton(backBtn, true);

  // grab result
  getEstablishmentsByLocation({
    postCode: document.querySelector('[name=address-post-code]').value,
  }).then((establishments) => {
    if (establishments) {
      console.log(establishments);
      // section.querySelector('.establishment-name').textContent =
      //   establishment.BusinessName;
      // section.querySelector('.establishment-type').textContent =
      //   establishment.BusinessType;
      // // eslint-disable-next-line prettier/prettier
      // section.querySelector('.address').textContent = `${
      //   establishment.AddressLine1
      // }, ${establishment.AddressLine2}, ${establishment.AddressLine3}, ${
      //   establishment.AddressLine4
      // }`;
      // section.querySelector('.post-code').textContent = establishment.PostCode;
      button.disabled = false;
    } else {
      section.querySelector(
        '.establishment-name'
      ).textContent = `No match found`;
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
  console.log('Section', sectionIndex);
  renderButton('button', 'Next', button);
  renderBackButton(backBtn, true);

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
  console.log('Section', sectionIndex);
  renderButton('submit', 'Submit', button);
  renderBackButton(backBtn, true);

  async function submit(e) {
    e.preventDefault();
    button.disabled = true;

    const formData = {
      account: getUrlParam(),
      type: localStorage.getItem('userType'),
      establishmentName: null,
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
      name: document.querySelector('[name=establishment-name]').value,
      street: document.querySelector('[name=address-street]').value,
      postCode: document.querySelector('[name=address-post-code]').value,
    }).then((establishment) => {
      formData.establishmentName = establishment.BusinessName;
      formData.location.coordinates = [
        parseFloat(establishment.geocode.latitude),
        parseFloat(establishment.geocode.longitude),
      ];
      // eslint-disable-next-line prettier/prettier
      formData.location.address = `${establishment.AddressLine1}, ${
        establishment.AddressLine2
      }, ${establishment.AddressLine3}, ${establishment.AddressLine4}`;
      formData.location.postcode = establishment.PostCode;
      formData.localAuthority.council = establishment.LocalAuthorityName;
    });
    console.log(formData);
    document.querySelectorAll('.working-hours').forEach((input, index) => {
      const weekMap = ['mon', 'tues', 'weds', 'thurs', 'fri', 'sat', 'sun'];
      if (input.querySelector('.switch').checked === true) {
        formData.openingHours[weekMap[index]].open = true;
        formData.openingHours[weekMap[index]].hours = `${
          input.querySelector('[name=start-time]').value
        }-${input.querySelector('[name=finish-time]').value}`;
      }
    });
    const request = await fetch(`/setup`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      console.log(res.text());
      if (!res.ok) {
        const errorMessage = res.text();
        throw new Error(errorMessage);
      } else if(res.ok){
        button.replaceWith(button.cloneNode(true));
        switchSection(formSections, FORM_HANDLERS_ARRAY, sectionIndex);
      }
    });

  }
  button.addEventListener('click', submit);
  backBtn.addEventListener('click', () => {
    backBtn.replaceWith(backBtn.cloneNode(true));
    switchSection(formSections, FORM_HANDLERS_ARRAY, sectionIndex, 'prev');
  });
}

function redirectToDashboard(
  section,
  formSections,
  button,
  backBtn,
  sectionIndex
) {
  renderButton('button', 'Go to dashboard', button);
  renderBackButton(backBtn, false);
  button.addEventListener('click', () => {
    location.href = `/donations/${getUrlParam()}`;
  });
}
