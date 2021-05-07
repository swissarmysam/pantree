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
export function renderBackButton(backBtn, visible) {
  backBtn.style.display = visible === true ? 'flex' : 'none';
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
