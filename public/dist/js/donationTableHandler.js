const modal = document.querySelector('.modal');
// checks if table has any rows
function checkIfTableEmpty() {
  document.querySelectorAll('.has-table').forEach((table) => {
    if (table.querySelector('.donation-row')) {
      table.querySelector('.no-results').remove();
    }
  });
}
// handler function, marks donation as collected
function markCollected(e) {
  const row = e.currentTarget.parentNode.parentNode.parentNode;
  fetch(`/donations/donation/${row.dataset.id}/collect`, {
    method: 'POST',
    body: JSON.stringify({ id: row.dataset.id }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok) {
      const errorMessage = res.text();
      throw new Error(errorMessage);
    } else if (res.ok) {
      // if response is ok then move table row to collected table
      const table = document.querySelector(
        'table[table-type="Collected donations"]'
      );
      row.querySelector('.buttons').remove();
      table.querySelector('tbody').appendChild(row);
      checkIfTableEmpty();
    }
  });
}
// handler function, deletes a donation from the collection
function markDeleted(e) {
  // open confirm modal
  const row = e.currentTarget.parentNode.parentNode.parentNode;
  modal.style.display = 'flex';
  modal.style.position = 'fixed';
  modal.querySelector('.message-body').innerHTML =
    'please confirm that you wish to <strong>delete</strong> this donation.';
  document.documentElement.classList.add('is-clipped');
  // remove event listener
  modal
    .querySelector('.confirmBtn')
    .removeEventListener('click', confirmDelete);
  // if confirm is pressed delete the donation
  function confirmDelete() {
    handleModalClose();
    fetch(`/donations/donation/${row.dataset.id}/remove`, {
      method: 'POST',
      body: JSON.stringify({ id: row.dataset.id }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      if (!res.ok) {
        const errorMessage = res.text();
        throw new Error(errorMessage);
      } else if (res.ok) {
        // if response is ok then remove table row
        row.remove();
        checkIfTableEmpty();
      }
    });
  }
  modal.querySelector('.confirmBtn').addEventListener('click', confirmDelete);
}
// handler function, marks donation as cancelled
function markCanceled(e) {
  // open confirm modal
  const row = e.currentTarget.parentNode.parentNode.parentNode;
  modal.style.display = 'flex';
  modal.style.position = 'fixed';
  modal.querySelector('.message-body').innerHTML =
    'please confirm that you wish to <strong>give up</strong> this donation.';
  document.documentElement.classList.add('is-clipped');
  // remove event listener
  modal
    .querySelector('.confirmBtn')
    .removeEventListener('click', confirmCancel);
  // if confirm is pressed cancel the donation
  function confirmCancel() {
    handleModalClose();
    fetch(`/donations/donation/${row.dataset.id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ id: row.dataset.id }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      if (!res.ok) {
        const errorMessage = res.text();
        throw new Error(errorMessage);
      } else if (res.ok) {
        // if response is ok then remove table row from claimed
        row.remove();
        checkIfTableEmpty();
      }
    });
  }
  // add event listener
  modal.querySelector('.confirmBtn').addEventListener('click', confirmCancel);
}

function handleModalClose() {
  modal.style.display = 'none';
  document.documentElement.classList.remove('is-clipped');
}

// event listeners

document.querySelectorAll('.collectBtn').forEach((button) => {
  button.addEventListener('click', markCollected);
});

document.querySelectorAll('.deleteBtn').forEach((button) => {
  button.addEventListener('click', markDeleted);
});

document.querySelectorAll('.cancelBtn').forEach((button) => {
  button.addEventListener('click', markCanceled);
});
document
  .querySelectorAll('.closeBtn')
  .forEach((btn) => btn.addEventListener('click', handleModalClose));
