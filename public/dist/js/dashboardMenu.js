function toggleAside(e) {
  e.currentTarget.classList.toggle('is-active');
  document.documentElement.classList.toggle('has-aside-mobile-expanded');
}

document
  .querySelector('.aside-mobile-toggle')
  .addEventListener('click', toggleAside);
