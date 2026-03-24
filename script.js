// =============================================
//  CARTA ROMÁNTICA - SCRIPT
// =============================================

const openBtn   = document.getElementById('openLetterBtn');
const overlay   = document.getElementById('letterOverlay');
const closeBtn  = document.getElementById('closeBtn');
const container = document.getElementById('letterContainer');
const backBtn   = document.getElementById('backToGalleryBtn');

// =============================================
//  MÚSICA DE FONDO
// =============================================
const musicaGaleria = document.getElementById('musicaGaleria');
const musicaCarta   = document.getElementById('musicaCarta');

musicaGaleria.volume = 0.4;
musicaCarta.volume   = 0.0;

// Los navegadores bloquean autoplay hasta que el usuario interactúa
// Al primer click en cualquier parte arranca la música de galería
document.addEventListener('click', iniciarMusica, { once: true });

function iniciarMusica() {
  musicaGaleria.play().catch(() => {});
}

function fadeOut(audio, duracion = 900) {
  const volInicial = audio.volume;
  const pasos      = duracion / 50;
  const paso       = volInicial / pasos;
  const intervalo  = setInterval(() => {
    if (audio.volume > paso) {
      audio.volume = Math.max(0, audio.volume - paso);
    } else {
      audio.volume = 0;
      audio.pause();
      clearInterval(intervalo);
    }
  }, 50);
}

function fadeIn(audio, volFinal = 0.5, duracion = 900) {
  audio.volume = 0;
  audio.play().catch(() => {});
  const pasos     = duracion / 50;
  const paso      = volFinal / pasos;
  const intervalo = setInterval(() => {
    if (audio.volume + paso < volFinal) {
      audio.volume += paso;
    } else {
      audio.volume = volFinal;
      clearInterval(intervalo);
    }
  }, 50);
}

// =============================================
//  ABRIR CARTA
// =============================================
openBtn.addEventListener('click', () => {
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  container.scrollTop = 0;

  // Cambiar música: galería → carta
  fadeOut(musicaGaleria, 900);
  setTimeout(() => fadeIn(musicaCarta, 0.5, 900), 400);

  // Corazones flotantes
  for (let i = 0; i < 12; i++) {
    setTimeout(() => crearCorazon(), i * 75);
  }
});

// =============================================
//  CERRAR CARTA
// =============================================
closeBtn.addEventListener('click', cerrarCarta);

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) cerrarCarta();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
    cerrarCarta();
  }
});

// Botón volver a las fotos
backBtn.addEventListener('click', () => {
  cerrarCarta();
  setTimeout(() => {
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
  }, 400);
});

function cerrarCarta() {
  overlay.classList.remove('is-open');
  document.body.style.overflow = '';

  // Volver música de galería
  fadeOut(musicaCarta, 900);
  setTimeout(() => fadeIn(musicaGaleria, 0.4, 900), 400);
}

// =============================================
//  CORAZONES FLOTANTES
// =============================================
function crearCorazon() {
  const emojis = ['💗','💕','🌹','✨','💝','🥰'];
  const heart  = document.createElement('span');
  heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

  const size = 1 + Math.random() * 1.5;
  const dur  = 2 + Math.random() * 2;
  const left = Math.random() * 100;
  const rot  = (Math.random() > 0.5 ? '' : '-') + (30 + Math.random() * 60);

  heart.style.cssText = `
    position: fixed;
    left: ${left}vw;
    bottom: -40px;
    font-size: ${size}rem;
    pointer-events: none;
    z-index: 200;
    animation: riseUp ${dur}s ease forwards;
  `;

  if (!document.getElementById('riseUpStyle')) {
    const style = document.createElement('style');
    style.id = 'riseUpStyle';
    style.textContent = `
      @keyframes riseUp {
        0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-100vh) rotate(${rot}deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(heart);
  heart.addEventListener('animationend', () => heart.remove());
}

// =============================================
//  HOVER DINÁMICO EN EL BOTÓN
// =============================================
const phrases = [
  { text: 'No abras esto', hint: '(abre esto)'      },
  { text: 'En serio no',   hint: '(de verdad sí)'   },
  { text: 'Espera...',     hint: '(ya ábrelo)'       },
  { text: 'Ok ya ábrelo',  hint: '(💌)'              },
  { text: 'Es para ti',    hint: '(te lo juro)'      },
];

let phraseIndex = 0;
const btnText = document.querySelector('.btn-text');
const btnHint = document.querySelector('.btn-hint');

openBtn.addEventListener('mouseenter', () => {
  phraseIndex = (phraseIndex + 1) % phrases.length;
  btnText.textContent = phrases[phraseIndex].text;
  btnHint.textContent = phrases[phraseIndex].hint;
});