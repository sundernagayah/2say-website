// Keep homepage hero video running on mobile browsers.
const homepageHeroVideo = document.querySelector('.hero-video video');

function startHomepageHeroVideo() {
  if (!homepageHeroVideo) return;
  homepageHeroVideo.muted = true;
  homepageHeroVideo.defaultMuted = true;
  homepageHeroVideo.playsInline = true;

  const playAttempt = homepageHeroVideo.play();
  if (playAttempt && typeof playAttempt.catch === 'function') {
    playAttempt.catch(() => {});
  }
}

if (homepageHeroVideo) {
  if (homepageHeroVideo.readyState >= 2) {
    startHomepageHeroVideo();
  } else {
    homepageHeroVideo.addEventListener('canplay', startHomepageHeroVideo, { once: true });
    homepageHeroVideo.addEventListener('loadeddata', startHomepageHeroVideo, { once: true });
  }

  // iOS can suspend inline video after tab/app state changes.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) startHomepageHeroVideo();
  });

  // If autoplay was deferred, the first touch resumes it without navigating anywhere.
  document.addEventListener('touchstart', startHomepageHeroVideo, { once: true, passive: true });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id.length > 1) {
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.style.background = 'rgba(7,7,7,.92)';
    header.style.borderBottom = '1px solid rgba(255,255,255,.08)';
  } else {
    header.style.background = 'linear-gradient(to bottom, rgba(5,5,5,.78), rgba(5,5,5,0))';
    header.style.borderBottom = 'none';
  }
});

const showreelOpen = document.querySelector('#showreel-open');
const showreelModal = document.querySelector('#showreel-modal');
const showreelClose = document.querySelector('#showreel-close');
const showreelPlayer = document.querySelector('#showreel-player');

function openShowreel() {
  if (!showreelModal || !showreelPlayer) return;

  showreelPlayer.src = showreelPlayer.dataset.src;
  showreelModal.classList.add('is-open');
  showreelModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('showreel-open');
  showreelClose?.focus();
}

function closeShowreel() {
  if (!showreelModal || !showreelPlayer) return;

  showreelModal.classList.remove('is-open');
  showreelModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('showreel-open');
  showreelPlayer.src = '';
  showreelOpen?.focus();
}

showreelOpen?.addEventListener('click', openShowreel);
showreelClose?.addEventListener('click', closeShowreel);

showreelModal?.addEventListener('click', (event) => {
  if (event.target === showreelModal) closeShowreel();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && showreelModal?.classList.contains('is-open')) {
    closeShowreel();
  }
});


// Subtle reveal motion: preserves a static layout when JS is unavailable.
document.documentElement.classList.add('motion-ready');

const revealTargets = document.querySelectorAll(
  '.work-category, .visual-interlude, .about-split, .services-section, .contact-banner, .portfolio-project, .portfolio-break, .next-work'
);

revealTargets.forEach((el) => el.classList.add('reveal-item'));

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -6% 0px'
  });

  revealTargets.forEach((el) => revealObserver.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}


// Project video modal — used by portfolio thumbnails.
const projectVideoModal = document.querySelector('#project-video-modal');
const projectVideoPlayer = document.querySelector('#project-video-player');
const projectVideoClose = document.querySelector('#project-video-close');
const projectVideoTriggers = document.querySelectorAll('.video-modal-trigger');
let lastProjectVideoTrigger = null;

function openProjectVideo(trigger) {
  if (!projectVideoModal || !projectVideoPlayer) return;
  const src = trigger?.dataset?.videoSrc;
  if (!src) return;

  lastProjectVideoTrigger = trigger;
  projectVideoPlayer.src = src;
  projectVideoModal.classList.add('is-open');
  projectVideoModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('project-video-open');
  projectVideoClose?.focus();
}

function closeProjectVideo() {
  if (!projectVideoModal || !projectVideoPlayer) return;

  projectVideoModal.classList.remove('is-open');
  projectVideoModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('project-video-open');
  projectVideoPlayer.src = '';
  lastProjectVideoTrigger?.focus();
}

projectVideoTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => openProjectVideo(trigger));
});

projectVideoClose?.addEventListener('click', closeProjectVideo);

projectVideoModal?.addEventListener('click', (event) => {
  if (event.target === projectVideoModal) closeProjectVideo();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && projectVideoModal?.classList.contains('is-open')) {
    closeProjectVideo();
  }
});


// Ensure all reveal content is visible before printing.
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('.reveal-item').forEach((el) => {
    el.classList.add('is-visible');
  });
});


// Shared contact modal.
const contactModal = document.querySelector('#contact-modal');
const contactModalClose = document.querySelector('#contact-modal-close');
const contactModalForm = document.querySelector('#contact-modal-form');
const contactModalTriggers = document.querySelectorAll('.contact-modal-trigger');
let lastContactTrigger = null;

function openContactModal(trigger) {
  if (!contactModal) return;
  lastContactTrigger = trigger || null;
  contactModal.classList.add('is-open');
  contactModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('contact-modal-open');
  window.setTimeout(() => {
    contactModal.querySelector('input[name="name"]')?.focus();
  }, 50);
}

function closeContactModal() {
  if (!contactModal) return;
  contactModal.classList.remove('is-open');
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('contact-modal-open');
  lastContactTrigger?.focus();
}

contactModalTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openContactModal(trigger);
  });
});

contactModalClose?.addEventListener('click', closeContactModal);

contactModal?.addEventListener('click', (event) => {
  if (event.target === contactModal) closeContactModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && contactModal?.classList.contains('is-open')) {
    closeContactModal();
  }
});

contactModalForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const form = new FormData(contactModalForm);
  const name = String(form.get('name') || '').trim();
  const email = String(form.get('email') || '').trim();
  const message = String(form.get('message') || '').trim();

  if (!name || !email || !message) {
    contactModalForm.reportValidity();
    return;
  }

  const subject = encodeURIComponent('2Say Films enquiry — ' + name);
  const body = encodeURIComponent(
    'Name: ' + name + '\n' +
    'Email: ' + email + '\n\n' +
    message
  );

  window.location.href = 'mailto:hello@2sayfilms.com?subject=' + subject + '&body=' + body;
});
