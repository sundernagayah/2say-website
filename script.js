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
