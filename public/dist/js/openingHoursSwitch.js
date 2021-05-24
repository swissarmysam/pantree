const switchBtns = document.querySelectorAll('label.pt-0');
switchBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.currentTarget.parentNode
      .querySelectorAll('input[type=time]')
      .forEach((input) => {
        input.disabled = input.disabled !== true;
        input.value = '';
      });
  });
});