// add event litener to edit button
document.querySelector('.enable-edit').addEventListener('click', enableForm);

function enableForm() {
    // enable all fields
    const form = document.querySelector('.edit-form');
    document.querySelectorAll('input').forEach((input) => {
        // if input name is not
        input.disabled = input.value !== '' ? false : true;
    });
    document.querySelector('.submit').disabled = false;
}