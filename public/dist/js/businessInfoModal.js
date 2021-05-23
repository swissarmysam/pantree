export function businessInfoModal(business, donations, modal) {
  modal.querySelector('.modal-card-title').textContent =
    business.establishmentName;
  modal.querySelector(
    '.donor-name'
  ).textContent = `Donations from ${business.establishmentName}`;
  // if string contains double commas replace it with one
  // eslint-disable-next-line prettier/prettier
  const address = `${business.location.address}, ${
    business.location.postcode
  }`.replace(',,',',');
  // eslint-disable-next-line prettier/prettier
    modal.querySelector('.establishment-address').textContent = address;
  // render donations that belong to business
  if (donations.length === 0) {
    const donationTemplate = `
      <div class="box my-3 donation">
        <p class="subtitle is-5 has-text-grey">No available donations</p>
      </div>
    `;
    const donationEl = document
      .createRange()
      .createContextualFragment(donationTemplate);
    modal.querySelector('.donations').appendChild(donationEl);
  } else {
    // check if donations are still available
    fetch(`/api/donations/status?business=${business.account}`).then(
      async (response) => {
        const data = await response.json();
        console.log(data);
        const allDonations = donations;
        allDonations.forEach((donation) => {
          for (let i = 0; i < data.length; i++) {
            if (donation.id === data[i].id) {
              const expiryDate = new Date(
                donation.expiryDate
              ).toLocaleDateString('en-GB');
              const donationTemplate = `
                <div class="box my-3 donation">
                  <div class="columns is-vcentered">
                      <div class="column is-narrow is-flex is-justify-content-center">
                          <div class="image is-32x32"><img class="is-rounded" src="https://eu.ui-avatars.com/api/?name=${
                            business.establishmentName
                          }&background=random" /></div>
                      </div>
                      <div class="column has-text-centered-mobile">
                          <p class="title is-6 my-1">Donation contents</p>
                          <p class="is-size-6 my-1">${donation.tags[0]
                            .split(',')
                            .join(', ')}</p>
                      </div>
                      <div class="column is-narrow has-text-centered-mobile devider-l pl-5 has-text-centered">
                          <p class="title is-6 my-1">Weight</p>
                          <p class="is-size-6 my-1">${donation.weight.toString()} kg</p>
                      </div>
                      <div class="column is-narrow has-text-centered-mobile devider-r pr-5">
                          <p class="title is-6 my-1">Expiry date</p>
                          <p class="is-size-6 my-1 has-text-centered">${expiryDate}</p>
                      </div>
                      <div class="column is-narrow is-flex is-justify-content-center pl-4"><a class="is-link is-hidden-mobile" href="/donations/donation/${
                        donation.id
                      }">View</a><a class="button is-link is-hidden-tablet" href="#">View Donation</a></div>
                  </div>
                </div>
              `;
              const donationEl = document
                .createRange()
                .createContextualFragment(donationTemplate);
              modal.querySelector('.donations').appendChild(donationEl);
            }
          }
        });
      }
    );
  }
  // renders the opening times for the day
  function openingTimesWeekday(day, openingHours) {
    const checkIfToday = day === getWeekday() ? 'has-text-weight-semibold' : '';
    return `
        <div class="columns is-mobile" day="${day}">
          <div class="column is-one-quarter-fullhd is-one-third-desktop is-one-quarter-tablet">
              <p class="subtitle is-6 has-text-grey ${checkIfToday}">${day}</p>
          </div>
          <div class="column">
              <p class="subtitle is-6 has-text-grey ${checkIfToday}">${
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

export async function getDonationsByBusiness(businessId) {
  // fetch request frabs all businesses
  const res = await fetch(`/api/donations/business?id=${businessId}`);
  if (!res.ok) {
    const errorMessage = res.text();
    throw new Error(errorMessage);
  }

  const allDonations = await res.json();
  const availableDonations = [];
  allDonations.forEach((donation) => {
    if (donation.claimed === false) availableDonations.push(donation);
  });
  return availableDonations;
}

export function getWeekday() {
  const weekday = new Date().toLocaleString('default', { weekday: 'long' });
  weekday.toString();
  return weekday;
}
