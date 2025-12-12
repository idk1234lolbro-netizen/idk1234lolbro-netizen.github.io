/* assets/script.js
   - Mobile nav toggle
   - Active link highlight
   - Reveal on scroll (IntersectionObserver)
   - Smooth scrolling for anchors
   - Small subtle parallax on hero bg
*/

document.addEventListener('DOMContentLoaded', ()=> {
  // mobile nav toggle
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', ()=> {
      nav.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
  }

  // close nav when link clicked (mobile)
  document.querySelectorAll('.nav a').forEach(a => {
    a.addEventListener('click', () => {
      if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        if (hamburger) hamburger.classList.remove('open');
      }
    });
  });

  // active link highlighting based on path or hash
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href.endsWith(path) || (href === path))) {
      a.classList.add('active');
    }
  });

  // reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting) {
        e.target.classList.add('show');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});
  reveals.forEach(r => io.observe(r));

  // smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(!target) return;
      target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // subtle parallax on hero background
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('mousemove', (ev)=>{
      const x = (ev.clientX / window.innerWidth) - 0.5;
      const y = (ev.clientY / window.innerHeight) - 0.5;
      heroBg.style.transform = `translate3d(${x*10}px, ${y*8}px, 0) scale(1.02)`;
    });
  }

  // small counter animation (if any .count element present)
  document.querySelectorAll('.count').forEach(c => {
    const end = parseInt(c.dataset.end || c.textContent) || 0;
    let start = 0;
    const step = Math.max(1, Math.floor(end/60));
    const id = setInterval(()=> {
      start += step;
      if (start >= end) { c.textContent = end; clearInterval(id); }
      else c.textContent = start;
    }, 16);
  });

});
