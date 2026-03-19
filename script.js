/* ============================================================
   ATOM FITNESS — SCRIPT.JS
   Sections: Navbar, Mobile Menu, Scroll Reveal, Testimonial Slider, FAQ, Form
============================================================ */

/* ---- Navbar scroll shadow ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ---- Mobile hamburger ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const open = mobileMenu.classList.contains('open');
  hamburger.setAttribute('aria-expanded', open);

  // Animate hamburger to X
  const spans = hamburger.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

/* ---- Scroll Reveal ---- */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

/* ---- Testimonial Slider ---- */
const track = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('sliderDots');

const cards = track ? track.querySelectorAll('.testimonial-card') : [];
let current = 0;
let autoSlide;

function buildDots() {
  dotsContainer.innerHTML = '';
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });
}

function updateDots() {
  dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

function goTo(index) {
  current = (index + cards.length) % cards.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  updateDots();
}

function startAutoSlide() {
  // Auto-slide disabled by request.
  return;
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

if (cards.length > 0) {
  buildDots();

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoSlide(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoSlide(); });

  // Touch / swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
      resetAutoSlide();
    }
  });
}

/* ---- FAQ Accordion ---- */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all others
    faqItems.forEach(fi => fi.classList.remove('open'));

    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});

/* ---- Lead Form Submission ---- */
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');
const leadForm = document.getElementById('leadForm');

if (submitBtn) {
  submitBtn.addEventListener('click', () => {
    const name   = document.getElementById('fname').value.trim();
    const phone  = document.getElementById('fphone').value.trim();
    const timing = document.getElementById('ftiming').value;

    // Basic validation
    if (!name) { shake(document.getElementById('fname')); return; }
    if (!phone || phone.length < 10) { shake(document.getElementById('fphone')); return; }
    if (!timing) { shake(document.getElementById('ftiming')); return; }

    // Simulate form submission (replace with actual endpoint / WhatsApp / Formspree etc.)
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      window.location.href = 'thankyou.html';
    }, 1200);
  });
}

function shake(el) {
  el.style.border = '1px solid #f55';
  el.style.animation = 'shake 0.35s';
  el.addEventListener('animationend', () => {
    el.style.animation = '';
  }, { once: true });
}

// Inject shake keyframe dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{ transform: translateX(0); }
    20%    { transform: translateX(-6px); }
    40%    { transform: translateX(6px); }
    60%    { transform: translateX(-4px); }
    80%    { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ---- Smooth active nav highlight ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--secondary)' : '';
      });
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(sec => sectionObserver.observe(sec));

/* ---- Why choose auto highlight ---- */
const whyCards = document.querySelectorAll('.why-card');
let whyIndex = 0;
let whyTimer;

function setWhyActive(index) {
  whyCards.forEach((card, i) => card.classList.toggle('active', i === index));
}

function startWhyAuto() {
  if (!whyCards.length) return;
  setWhyActive(whyIndex);
  whyTimer = setInterval(() => {
    whyIndex = (whyIndex + 1) % whyCards.length;
    setWhyActive(whyIndex);
  }, 1800);
}

if (whyCards.length) {
  startWhyAuto();
}
