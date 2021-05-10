/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */

// utility functions used to power our multi-step forms

// initialises the multi-step form
export function initForm(handlersArr) {
  const formSections = document.querySelectorAll('[section]');
  const stepContainer = document.querySelector('.steps');
  renderSteps(formSections, stepContainer);
  renderSection(formSections, 0, handlersArr);
}
// function renders a new form section
function renderSection(
  formSections,
  switchToSection,
  handlersArr,
  optionalParam
) {
  // select the specific section to be rendered
  const section = formSections[switchToSection];
  const button = document.querySelector('.button.primary-action');
  const backBtn = document.querySelector('.secondary-action');
  // select the specific handler function from the array
  const handlerFn = handlersArr[switchToSection];
  // render the section title
  renderTitle(section);
  // if the value contained in the handlersArr corresponds to a funtion, call it
  if (typeof handlerFn === 'function')
    handlerFn.apply(null, [
      section,
      formSections,
      button,
      backBtn,
      switchToSection,
      optionalParam,
    ]);
  formSections.forEach((item, index) => {
    // if the index is not equal to switchToSection, don't display it
    item.style.display = switchToSection !== index ? 'none' : null;
  });
}
// creates the step component
function renderSteps(formSections, stepContainer) {
  for (let i = 0; i < formSections.length; i++) {
    // create step indicator
    const step = document.createElement('li');
    const stepMarker = document.createElement('span');
    // set the first step to active
    if (i === 0) step.classList.add('is-active');
    step.classList.add('steps-segment');
    stepMarker.classList.add('steps-marker');
    // add a check icon to the last step
    if (i === formSections.length - 1) {
      const iconContainer = document.createElement('span');
      const icon = document.createElement('ion-icon');
      iconContainer.classList.add('icon');
      icon.setAttribute('name', 'checkmark-sharp');
      icon.style.fontSize = '20px';
      iconContainer.appendChild(icon);
      stepMarker.appendChild(iconContainer);
    }
    // append the step indicator to the parent container
    step.append(stepMarker);
    stepContainer.appendChild(step);
  }
}
// renders the section title
function renderTitle(section) {
  const title = document.querySelector('.form-title');
  title.innerHTML = section.getAttribute('section-name');
}
// renders the primary button
export function renderButton(type, label, button, clickable = false) {
  button.type = type;
  button.value = label;
  button.textContent = label;
  button.disabled = clickable;
}
// renders the secondary button
export function renderBackButton(
  backBtn,
  formSections,
  handlersArr,
  sectionIndex,
  visible = true
) {
  backBtn.style.display = visible === true ? 'flex' : 'none';
  // when the back button is clicked remove both button and backBtn event listeners
  // then switch to the  previous section
  backBtn.addEventListener('click', () => {
    backBtn.nextSibling.replaceWith(backBtn.nextSibling.cloneNode(true));
    backBtn.replaceWith(backBtn.cloneNode(true));
    switchSection(formSections, handlersArr, sectionIndex, 'prev');
  });
}
// creates the layout for a establisment info card
export function renderCard(section, name, businessType, address, postcode) {
  const html = `
    <div class="notification establishment">
      <p class="title is-3 establishment-name">${name}</p>
      <p class="subtitle is-5 establishment-type">
        ${businessType}
      </p>
      <label class="has-text-weight-semibold mb-1">Address</label>
      <p  for="address" class="subtitle is-5 has-text-grey address">
        ${address}
      </p>
      <label for="post-code" class="has-text-weight-semibold mb-1">
      Post code
      </label>
      <p class="subtitle is-5 has-text-grey post-code">${postcode}</p>
      <button type="button" class="button is-primary is-outlined">
        Select
      </button>
    </div>
  `;
  // using create range we create a contextual fragment from the html string
  // it allows the string to be parsed into actual html element
  // which is needed to edit the component dynamically
  const card = document.createRange().createContextualFragment(html);
  section.appendChild(card);
}
// navigates to the section called from a formHandler function
export function switchSection(
  formSections,
  handlersArr,
  currentSection,
  direction = 'next',
  optionalParam = null
) {
  const switchDirection = direction === 'next' ? 1 : -1;
  const requestedSection = currentSection + switchDirection;
  switchStep(requestedSection);
  renderSection(formSections, requestedSection, handlersArr, optionalParam);
}
// updates the step component
function switchStep(sectionIndex) {
  const steps = document.querySelectorAll('.steps-segment');
  const stepTitle = document.querySelector('label[for=step]');
  steps.forEach((item, i) => {
    if (sectionIndex === i) {
      steps.forEach((step) => step.classList.remove('is-active'));
      item.classList.add('is-active');
      stepTitle.textContent = `Step ${i + 1}`;
    }
  });
}
// validates input values
export function checkInputs(section) {
  let redirect = true;
  section.querySelectorAll('[name]').forEach((field) => {
    // remove all error styling applied to inputs from previous invocation of the function
    if (field.parentNode.nextSibling != null) {
      field.parentNode.nextSibling.remove();
      field.classList.remove('is-danger');
    }
    // check if all fields are filled out
    if (field.value === '') {
      // if a field is empty apply error styling
      field.classList.add('is-danger');
      const fieldContainer = field.parentNode;
      const warning = document.createElement('p');
      warning.classList.add('help', 'is-danger', 'is-size-6');
      warning.textContent = 'This field is required.';
      fieldContainer.insertAdjacentElement('afterend', warning);
      // if a field is empty set redirect to false
      // this stops the user being redirected to the next section
      redirect = false;
    }
  });
  return redirect;
}
