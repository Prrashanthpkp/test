/* script.js — Clean, defensive, theme-aware, Netlify-friendly form submit */

/* ---------------------------
   Helper: safe query
   --------------------------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ---------------------------
   Run when DOM ready
   --------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     TYPING EFFECT (defensive)
     ========================= */
  (function typingEffect() {
    const roles = ["Front-end Developer", "Game Designer"];
    let idx = 0, charIdx = 0;
    const typingEl = $('#typing');
    const cursorEl = document.querySelector('.cursor');

    if (!typingEl) return;

    function type() {
      if (charIdx < roles[idx].length) {
        typingEl.textContent += roles[idx].charAt(charIdx);
        charIdx++;
        setTimeout(type, 100);
      } else {
        setTimeout(erase, 1400);
      }
    }
    function erase() {
      if (charIdx > 0) {
        typingEl.textContent = roles[idx].substring(0, charIdx - 1);
        charIdx--;
        setTimeout(erase, 60);
      } else {
        idx = (idx + 1) % roles.length;
        setTimeout(type, 400);
      }
    }
    type();
    // cursor animation handled purely by CSS (.cursor)
  })();


  /* =========================
     SECTION REVEAL OBSERVER
     ========================= */
  (function sectionObserver() {
    const sections = $$('section');
    if (!sections.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
        else entry.target.classList.remove('active');
      });
    }, { threshold: 0.35 });

    sections.forEach(s => observer.observe(s));
  })();


  /* =========================
     SMOOTH SCROLL NAV + LOGO
     ========================= */
  (function smoothScroll() {
    $$('.nav-links a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        const tgt = document.querySelector(href);
        if (tgt) tgt.scrollIntoView({ behavior: 'smooth' });
      });
    });

    const logo = $('.logo');
    if (logo) {
      logo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  })();


  /* =========================
     NETLIFY-FRIENDLY CONTACT FORM
     - Uses AJAX post so developer can see result without reload
     - Works with data-netlify="true" (Netlify will capture request)
     ========================= */
  (function contactFormHandler() {
    const form = $('#contactForm');
    if (!form) return;

    const submitBtn = form.querySelector('.form-btn');

    async function showSentAnimation() {
      if (!submitBtn) return;
      // read accent colors from CSS variables
      const style = getComputedStyle(document.body);
      const accent = style.getPropertyValue('--accent').trim() || '#a855f7';
      const accent2 = style.getPropertyValue('--accent-2').trim() || '#7e22ce';

      submitBtn.textContent = "✅ Sent!";
      submitBtn.style.boxShadow = `0 0 25px ${accent}, 0 0 50px ${accent2}`;
      submitBtn.style.background = `linear-gradient(120deg, ${accent}, ${accent2})`;

      await new Promise(res => setTimeout(res, 1600));

      submitBtn.textContent = "Send Message";
      submitBtn.style.boxShadow = '';
      submitBtn.style.background = 'transparent';
    }

    // helper to encode formdata for netlify-compatible POST
    function encodeFormData(fd) {
      // returns application/x-www-form-urlencoded string
      const params = new URLSearchParams();
      for (const [k, v] of fd.entries()) {
        params.append(k, v);
      }
      return params.toString();
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // local validation pass-through (browser already enforces required)
      const formData = new FormData(form);

      // If using Netlify, POST to current page path with form data
      const endpoint = form.getAttribute('action') || window.location.pathname || '/';

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormData(formData)
      })
      .then(response => {
        // Netlify returns 200 on success; we don't need the body
        // Show success animation and reset form
        showSentAnimation();
        form.reset();
        return response;
      })
      .catch(err => {
        console.error('Form submit failed:', err);
        alert('Failed to send message. If you are testing locally, Netlify form submissions require deployment. The message is still shown as "sent" locally.');
        // still show animation so user experience remains consistent
        showSentAnimation();
        form.reset();
      });
    });
  })();


  /* =========================
     THEME TOGGLE (persistence)
     ========================= */
  (function themeToggle() {
    const toggle = $('#theme-toggle');
    if (!toggle) return;

    // apply saved theme
    try {
      const saved = localStorage.getItem('pk_theme');
      if (saved === 'light') document.body.classList.add('light');
    } catch (err) { /* ignore */ }

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isLight = document.body.classList.toggle('light');
      try {
        localStorage.setItem('pk_theme', isLight ? 'light' : 'dark');
      } catch (err) { /* ignore */ }
    });
  })();


  /* =========================
     Small guards: interactive UI
     ========================= */
  (function smallGuards() {
    // ensure nav-links highlighting when scrolling
    const links = $$('.nav-links a');
    if (!links.length) return;
    const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

    function onScroll() {
      const y = window.scrollY + (window.innerHeight / 3);
      let current = sections[0];
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        const top = window.scrollY + rect.top;
        if (top <= y) current = sec;
      });
      links.forEach(link => link.classList.toggle('active', document.querySelector(link.getAttribute('href')) === current));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

}); // DOMContentLoaded end

/* Loader hide after 2.5s */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 2500); // 2.5 sec
  }
});

document.querySelectorAll("section").forEach(section => {
  const starField = document.createElement("div");
  starField.classList.add("stars");
  section.appendChild(starField);

  for (let i = 0; i < 50; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    // random position
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;

    // random size
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    // random animation delay
    star.style.animationDelay = `${Math.random() * 5}s`;

    starField.appendChild(star);
  }
});
