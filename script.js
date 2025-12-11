// small helper for nav toggle + year insertion + active link highlight
document.addEventListener('DOMContentLoaded', function () {
  // mobile nav toggle
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.classList.toggle('open');
    });
  }

  // set year in all footers
  var yearEls = document.querySelectorAll('#year, #year-2, #year-3, #year-4, #year-5');
  var y = new Date().getFullYear();
  yearEls.forEach(function (el) { el.textContent = y; });

  // active nav highlight based on filename
  var navLinks = document.querySelectorAll('.nav-link');
  var path = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
});
