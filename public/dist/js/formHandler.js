/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
export function initForm(handlersArr) {
  if (document.body.contains(document.querySelector('.steps'))) {
    const formSections = document.querySelectorAll('[section]');
    const stepContainer = document.querySelector('.steps');
    renderSteps(formSections, stepContainer);
    renderSection(formSections, 0, handlersArr);
  }
}
function renderSection(
  formSections,
  switchToSection,
  handlersArr,
  optionalParam
) {
  const section = formSections[switchToSection];
  const button = document.querySelector('.button.primary-action');
  const backBtn = document.querySelector('.secondary-action');
  const fn = handlersArr[switchToSection];
  renderTitle(section);
  if (typeof fn === 'function')
    fn.apply(null, [
      section,
      formSections,
      button,
      backBtn,
      switchToSection,
      optionalParam,
    ]);
  formSections.forEach((item, i) => {
    item.style.display = switchToSection === i ? null : 'none';
  });
}
// creates the step component
function renderSteps(formSections, stepContainer) {
  for (let i = 0; i < formSections.length; i++) {
    const step = document.createElement('li');
    const stepMarker = document.createElement('span');
    if (i === 0) step.classList.add('is-active');
    step.classList.add('steps-segment');
    stepMarker.classList.add('steps-marker');
    if (i === formSections.length - 1) {
      const iconContainer = document.createElement('span');
      const icon = document.createElement('i');
      iconContainer.classList.add('icon');
      icon.classList.add('fa', 'fa-check');
      iconContainer.appendChild(icon);
      stepMarker.appendChild(iconContainer);
    }
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
  backBtn.addEventListener('click', () => {
    backBtn.nextSibling.replaceWith(backBtn.nextSibling.cloneNode(true));
    backBtn.replaceWith(backBtn.cloneNode(true));
    switchSection(formSections, handlersArr, sectionIndex, 'prev');
  });
}
// creates the layout for a establisment info
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
  const card = document.createRange().createContextualFragment(html);
  section.appendChild(card);
}
// navigates to the section called from a form-section function
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
  return redirect;
}
