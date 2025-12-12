/* src/assets/js/main.js
   - component loader (inject navbar/footer)
   - hamburger toggle
   - reveal on scroll
   - simple canvas particles
   - tiny parallax for hero bg
*/

(() => {
  // --- DOM helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // --- inject components (navbar + footer)
  async function loadComponent(selector, path) {
    const el = $(selector);
    if (!el) return;
    try {
      const res = await fetch(path);
      const txt = await res.text();
      el.innerHTML = txt;
    } catch (e) {
      console.error('component load failed', path, e);
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    // insert navbar and footer placeholders if present
    await loadComponent('#component-navbar', '../components/navbar.html');
    await loadComponent('#component-footer', '../components/footer.html');

    // wire hamburger (delegated in case navbar just injected)
    setTimeout(()=> {
      const hamb = document.getElementById('hambtn') || document.querySelector('.hambtn');
      const nav = document.getElementById('nav-links') || document.querySelector('.nav');
      if (hamb && nav) {
        hamb.addEventListener('click', () => {
          nav.classList.toggle('open');
          hamb.classList.toggle('open');
          if (nav.style.display === 'flex') nav.style.display = ''; else nav.style.display = 'flex';
        });
        // close nav when link clicked (mobile)
        nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
          if (nav.classList.contains('open')) {
            nav.classList.remove('open');
            if (hamb) hamb.classList.remove('open');
            nav.style.display = '';
          }
        }));
      }
    }, 120);

    // reveal on scroll
    const revealEls = $$('.reveal');
    const io = new IntersectionObserver((entries, ob) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('show');
          ob.unobserve(en.target);
        }
      });
    }, {threshold: 0.12});
    revealEls.forEach(r => io.observe(r));

    // simple parallax on hero background based on mouse (desktop)
    const heroBg = document.querySelector('.hero .bg');
    if (heroBg && window.innerWidth > 720) {
      window.addEventListener('mousemove', (ev) => {
        const x = (ev.clientX / window.innerWidth - 0.5) * 20;
        const y = (ev.clientY / window.innerHeight - 0.5) * 14;
        heroBg.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.03)`;
      });
    }

    // small counters animation
    document.querySelectorAll('.stat .num.count').forEach(el => {
      const end = parseInt(el.dataset.end || el.textContent.replace(/\D/g,'')) || 0;
      let cur = 0;
      const step = Math.max(1, Math.floor(end / 60));
      const t = setInterval(()=> {
        cur += step;
        if (cur >= end) { el.textContent = end + (el.dataset.suffix || ''); clearInterval(t); }
        else el.textContent = cur + (el.dataset.suffix || '');
      }, 16);
    });

    // initialize particles
    initParticles();
  });

  // ----- particles (lightweight canvas)
  function initParticles() {
    const canv = document.createElement('canvas');
    canv.className = 'particles';
    document.body.appendChild(canv);
    const ctx = canv.getContext('2d');
    let w, h, particles = [];
    function resize() {
      w = canv.width = innerWidth;
      h = canv.height = innerHeight;
      particles = [];
      const count = Math.max(20, Math.floor((w*h)/90000));
      for (let i=0;i<count;i++) particles.push(makeParticle());
    }
    function makeParticle() {
      const s = Math.random()*1.6 + 0.4;
      return {
        x: Math.random()*w,
        y: Math.random()*h,
        vx: (Math.random()-0.5)*0.3,
        vy: (Math.random()*0.6 + 0.2) * (Math.random()>0.6?1:-1),
        s
      };
    }
    function step() {
      ctx.clearRect(0,0,w,h);
      for (let p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -50) p.x = w+50;
        if (p.x > w+50) p.x = -50;
        if (p.y < -50) p.y = h+50;
        if (p.y > h+50) p.y = -50;
        // draw soft circle
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.s*18);
        g.addColorStop(0, 'rgba(20,255,122,0.06)');
        g.addColorStop(1, 'rgba(20,255,122,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.s*18,0,Math.PI*2);
        ctx.fill();
      }
      // connect nearby
      for (let i=0;i<particles.length;i++){
        for (let j=i+1;j<particles.length;j++){
          const a = particles[i], b = particles[j];
          const dx = a.x-b.x, dy = a.y-b.y, d = Math.sqrt(dx*dx+dy*dy);
          if (d < 120) {
            ctx.strokeStyle = `rgba(20,255,122,${(0.18*(1 - d/120)).toFixed(3)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x,a.y);
            ctx.lineTo(b.x,b.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(step);
    }
    addEventListener('resize', resize);
    resize();
    requestAnimationFrame(step);
  }

})();
