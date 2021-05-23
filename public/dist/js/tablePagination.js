/* eslint-disable no-use-before-define */

/* file handles the pable pagination */

// select all table elements
document.querySelectorAll('.b-table.has-pagination').forEach((table) => {
  // select all pagination buttons that belong to that table
  table.querySelectorAll('.button.switch-page').forEach((button, index) => {
    // pass each pagination button a reference to its parent table
    button.table = table;
    // add an event listener that handles the page switch
    button.addEventListener('click', (e) => {
      e.currentTarget.parentNode.childNodes.forEach((child) =>
        child.classList.remove('is-active')
      );
      e.currentTarget.classList.add('is-active');
      switchPage(button.table, index);
    });
  });
});

// handler function that switches the table rows displayed
function switchPage(table, index) {
  // select all table rows from the event targets parent table
  table.querySelectorAll('tr.donation-row').forEach((row) => {
    // asign each rows display property via a ternary
    // condition : if the data atribute on the el equals the button index then display it
    row.style.display =
      parseInt(row.dataset.page) === index ? 'table-row' : 'none';
  });
}
