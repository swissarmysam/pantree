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
function renderSection(formSections, switchToSection, handlersArr) {
  const section = formSections[switchToSection];
  const button = document.querySelector('.button.primary-action');
  const backBtn = document.querySelector('.secondary-action');
  const fn = handlersArr[switchToSection];
  renderTitle(section);
  if (typeof fn === 'function')
    fn.apply(null, [section, formSections, button, backBtn]);
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
// returns the section currently displayed
function currentSection(formSections) {
  let sectionIndex;
  formSections.forEach((section, i) => {
    if (section.style.display !== 'none') {
      sectionIndex = i;
      console.log(sectionIndex);
    }
  });
  return sectionIndex;
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
  backBtn.style.display = visible === true ? 'block' : 'none';
}
// navigates to the section called from a form-section function
// selectedSection will eiher add or substact 1 from the current section index
export function switchSection(
  formSections,
  handlersArr,
  switchDirection = 'prev'
) {
  const selectedSection = switchDirection === 'next' ? 1 : -1;
  console.log('currentSection', currentSection(formSections));
  const section = currentSection(formSections) + selectedSection;
  renderSection(formSections, section, handlersArr);
  switchStep(section);
  console.log('selectedSection', selectedSection);
  console.log('section', section);
}
// updates the step component
function switchStep(sectionIndex) {
  const steps = document.querySelectorAll('.steps-segment');
  steps.forEach((item, i) => {
    if (sectionIndex === i) {
      item.classList.add('is-active');
      steps[i - 1].classList.remove('is-active');
    }
  });
}
