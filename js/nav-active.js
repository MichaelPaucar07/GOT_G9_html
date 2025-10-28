const links = document.querySelectorAll('.main-nav .nav-link');
links.forEach(a => {
  const here = location.pathname.split('/').pop();
  const href = a.getAttribute('href');
  if (href && href.endsWith(here)) a.classList.add('is-active');
});
