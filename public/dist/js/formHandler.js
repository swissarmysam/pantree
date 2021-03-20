// if the form has multiple steps run the block below
if (document.body.contains(document.querySelector('.steps'))) {
  const formSections = document.querySelectorAll('[section]');
  const stepCont = document.querySelector('.steps');
  renderSteps(formSections, stepCont);
  renderSection(formSections, 0);
}
// else render a submit button
// renders the the active section
function renderSection(formSections, switchToSection) {
  const section = formSections[switchToSection];
  const button = document.querySelector('.button.is-fullwidth');
  // fn veriable stores a function that handles the form section
  // function must match the value of the section attribute
  const fn = window[section.getAttribute('section')];
  renderTitle(section);
  if (typeof fn === 'function') fn.apply(null, [section, formSections, button]);
  formSections.forEach(function(item, i) {
    item.style.display = switchToSection === i ? 'block' : 'none';
  });
}
// creates the step component
function renderSteps(formSections, stepCont) {
  for (let i = 0; i < formSections.length; i++) {
    const step = document.createElement('li');
    const stepMarker = document.createElement('span');
    if (i === 0) step.classList.add('is-active');
    step.classList.add('steps-segment');
    stepMarker.classList.add('steps-marker');
    if (i === formSections.length - 1) {
      const iconCont = document.createElement('span');
      const icon = document.createElement('i');
      iconCont.classList.add('icon');
      icon.classList.add('fa', 'fa-check');
      iconCont.appendChild(icon);
      stepMarker.appendChild(iconCont);
    }
    step.append(stepMarker);
    stepCont.appendChild(step);
  }
}
// renders the section title
function renderTitle(section) {
  const title = document.querySelector('.form-title');
  title.innerHTML = section.getAttribute('section-name');
}
// helper function, returns the section currently displayed
function currentSection(formSections) {
  let sectionIndex;
  formSections.forEach((section, i) => {
    if (section.style.display !== 'none') {
      sectionIndex = i;
    }
  });
  return sectionIndex;
}
// renders the primary button
function renderButton(type, label, button) {
  button.type = type;
  button.value = label;
  button.textContent = label;
}

function nextSection(formSections) {
  const section = currentSection(formSections) + 1;
  renderSection(formSections, section);
  switchStep(section);
}
// updates the step component
function switchStep(sectionIndex) {
  const steps = document.querySelectorAll('.steps-segment');
  steps.forEach(function(item, i) {
    console.log(i);
    if (sectionIndex === i) {
      item.classList.add('is-active');
      steps[i - 1].classList.remove('is-active');
    }
  });
}
// The rest of these functions below handle the individual sections
// They need to match the 'section' data attribute in order to get called
function userType(section, formSections, button) {
  renderButton('button', 'Next', button);
  button.addEventListener('click', () => {
    // validate section inputs
    console.log(section);
    button.replaceWith(button.cloneNode(true));
    // if validation is successful switch to next section
    nextSection(formSections);
  });
}

function accountInfo(section, formSections, button) {
  renderButton('submit', 'Submit', button);
  button.addEventListener('click', () => {
    // validate section inputs
    console.log(section);
    button.replaceWith(button.cloneNode(true));
    // if validation is successful switch to next section
    nextSection(formSections);
  });
}

function accountVerification(section, formSections, button) {
  renderButton('button', 'Resend', button);
  button.addEventListener('click', () => {
    // validate section inputs
    console.log(section);
    button.replaceWith(button.cloneNode(true));
    // if validation is successful switch to next section
    nextSection(formSections);
  });
}
