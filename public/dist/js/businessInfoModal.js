export function businessInfoModal(business, modal, open) {
  console.log(business);
  console.log(open);
  modal.querySelector('.modal-card-title').textContent =
    business.establishmentName;
  modal.querySelector(
    '.donor-name'
  ).textContent = `Donations from ${business.establishmentName}`;
  // TODO - remove string sanitasation
  // eslint-disable-next-line prettier/prettier
  const address = `${business.location.address}, ${
    business.location.postcode
  }`.replace(',,',',');
  // if string contains double commas replace it with one
  // eslint-disable-next-line prettier/prettier
    modal.querySelector('.establishment-address').textContent = address;
  // renders the opening times for the day
  function openingTimesWeekday(day, openingHours) {
    return `
        <div class="columns is-mobile" day="${day}">
          <div class="column is-one-quarter-fullhd is-one-third-desktop is-one-quarter-tablet">
              <p class="subtitle is-6 has-text-grey">${day}</p>
          </div>
          <div class="column">
              <p class="subtitle is-6 has-text-grey">${
                openingHours !== null ? openingHours : 'closed'
              }</p>
          </div>
        </div>
      `;
  }

  const hoursTemplate = `
      <div class="notification mt-3 working-hours">
        ${openingTimesWeekday('Monday', business.openingHours.mon.hours)}
        ${openingTimesWeekday('Tuesday', business.openingHours.tues.hours)}
        ${openingTimesWeekday('Wednesday', business.openingHours.weds.hours)}
        ${openingTimesWeekday('Thursday', business.openingHours.thurs.hours)}
        ${openingTimesWeekday('Friday', business.openingHours.fri.hours)}
        ${openingTimesWeekday('Saturday', business.openingHours.sat.hours)}
        ${openingTimesWeekday('Sunday', business.openingHours.sun.hours)}
      </div>
    `;
  const workingHours = document
    .createRange()
    .createContextualFragment(hoursTemplate);
  modal.querySelector('.modal-card-body').appendChild(workingHours);
  // checkIfOpen(modal.querySelector('.working-hours'));
  // if the current time is not within working hours apply closed styling
  // fetch the donations associated with the business id
  modal.style.display = 'flex';
  modal.style.position = 'fixed';
  document.documentElement.classList.add('is-clipped');
}

export function getWeekday(element) {
  const weekday = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
  }).format(new Date().getDay());
  return weekday;
}
