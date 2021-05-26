document.querySelectorAll('.collectBtn').forEach((button) => {
  button.addEventListener('click', markCollected);
});

function markCollected(e) {
  const row = e.currentTarget.parentNode.parentNode.parentNode;
  fetch(`/donations/donation/${row.dataset.id}/collect`, {
    method: 'POST',
    body: JSON.stringify({ id: row.dataset.id }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    let data;
    if (!res.ok) {
      const errorMessage = res.text();
      throw new Error(errorMessage);
    } else if (res.ok) {
      // if response is ok then move table row to collected table
    }
  });
}
