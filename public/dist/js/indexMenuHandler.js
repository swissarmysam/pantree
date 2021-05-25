document.querySelectorAll('.nav__link').forEach((menuLink) => {
  menuLink.addEventListener('click', handleIndexMenuClick);
});

function handleIndexMenuClick(e) {
  const target = e.currentTarget.dataset.section;
  document
    .querySelector(`.page-section[data-section='${target}']`)
    .scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
}
