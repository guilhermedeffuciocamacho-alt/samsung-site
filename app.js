gsap.registerPlugin(ScrollTrigger);

/* ============ mount SVGs ============ */
document.getElementById('assembledWrap').innerHTML = window.__PHONE_SVG__;
document.getElementById('camVisual').innerHTML = window.__CAM_SVG__;
document.getElementById('finaleRotor').innerHTML = window.__PHONE_SVG__;

/* Lock scroll during intro */
document.documentElement.style.overflow = 'hidden';

/* ============ INTRO SEQUENCE ============ */
const introTl = gsap.timeline({
  defaults: { ease: 'power2.out' },
  onComplete: () => {
    document.documentElement.style.overflow = '';
    ScrollTrigger.refresh();
  }
});

introTl
  .to('#intro-wordmark', { opacity: 1, duration: 1.4, ease: 'power1.inOut' }, 0.3)
  .to('#intro-wordmark .sheen', {
      backgroundPosition: '-50% 0',
      duration: 1.8,
      ease: 'power2.inOut'
    }, 1.1)
  .to({}, { duration: 0.9 }) // hold
  .to('#intro-wordmark', { opacity: 0, duration: 1.1, ease: 'power2.in' }, '+=0')
  .to('#intro-fade', { opacity: 1, duration: 1.0, ease: 'power2.inOut' }, '-=0.3')
  .set('header', { opacity: 1 })
  .to('#intro', { opacity: 0, duration: 0.8, pointerEvents: 'none', ease: 'power1.out' }, '+=0.05')
  .call(() => { document.getElementById('intro').style.display = 'none'; })
  // reveal hero content just as intro clears
  .to('.phone-photo', { opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=0.9')
  .to('.hero-copy h1', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.9')
  .to('.hero-copy p.tagline', { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.7')
  .to('.hero-copy p.micro', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
  .to('.scroll-hint', { opacity: 1, duration: 0.8 }, '-=0.4');

/* subtle initial offsets for hero copy so the fade also slides */
gsap.set('.hero-copy h1', { y: 18 });
gsap.set('.hero-copy p.tagline', { y: 14 });
gsap.set('.hero-copy p.micro', { y: 10 });

/* ============ CURSOR PARALLAX ON HERO ============ */
const stagePin = document.getElementById('stage-pin');
stagePin.addEventListener('mousemove', (e) => {
  const rect = stagePin.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  gsap.to('.phone-photo, .phone-svg-wrap', {
    x: x * 14, y: y * 10, duration: 0.9, ease: 'power2.out'
  });
  gsap.to('.hero-copy', {
    x: x * 6, duration: 1.1, ease: 'power2.out'
  });
});

/* ============ ASSEMBLY SCROLL SEQUENCE ============ */
/*
  Phases inside #stage (420vh, pinned 100vh):
   0.00 - 0.22  hero copy holds, photo visible (fast opening feel already delivered by intro)
   0.22 - 0.34  crossfade: exploded photo -> svg assembled phone appears in EXPLODED arrangement (fast)
   0.34 - 0.60  parts converge, moderate speed
   0.60 - 0.92  final precise settle, slow easing
   0.92 - 1.00  hold assembled + fade hero copy up/out, scroll hint hides
*/

const explodeState = {
  gCameraLenses: { x: -46, y: -58, rotate: -10, scale: 1 },
  gBackCover:    { x: -16, y: -8,  rotate: -4,  scale: 1 },
  gFrame2:       { x: 10,  y: 6,   rotate: 3,   scale: 1 },
  gFrontGlass:   { x: 34,  y: 22,  rotate: 7,   scale: 1 },
};

function setExploded() {
  Object.entries(explodeState).forEach(([id, v]) => {
    gsap.set('#' + id, { x: v.x, y: v.y, rotation: v.rotate, transformOrigin: '50% 50%' });
  });
}
setExploded();

const assembleTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#stage',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
  }
});

/* crossfade photo -> svg (fast, early) */
assembleTl.to('.phone-photo', { opacity: 0, scale: 0.94, duration: 0.10, ease: 'none' }, 0.18);
assembleTl.to('.phone-svg-wrap', { opacity: 1, duration: 0.10, ease: 'none' }, 0.20);
assembleTl.to('.hero-copy', { opacity: 0, y: -40, duration: 0.10, ease: 'none' }, 0.16);
assembleTl.to('.scroll-hint', { opacity: 0, duration: 0.06, ease: 'none' }, 0.10);

/* Phase A: fast — camera lenses + back cover travel most of the distance */
assembleTl.to('#gCameraLenses', { x: -18, y: -22, rotation: -5, duration: 0.16, ease: 'power1.out' }, 0.24);
assembleTl.to('#gBackCover',    { x: -5,  y: -2,  rotation: -1.4, duration: 0.16, ease: 'power1.out' }, 0.24);
assembleTl.to('#gFrame2',       { x: 3,   y: 1.5, rotation: 0.8,  duration: 0.16, ease: 'power1.out' }, 0.24);
assembleTl.to('#gFrontGlass',   { x: 10,  y: 6,   rotation: 2,    duration: 0.16, ease: 'power1.out' }, 0.24);

/* Phase B: moderate — closing in */
assembleTl.to('#gCameraLenses', { x: -6, y: -7, rotation: -1.6, duration: 0.22, ease: 'power1.inOut' }, 0.42);
assembleTl.to('#gBackCover',    { x: -1.5, y: -0.5, rotation: -0.3, duration: 0.22, ease: 'power1.inOut' }, 0.42);
assembleTl.to('#gFrame2',       { x: 1, y: 0.4, rotation: 0.2, duration: 0.22, ease: 'power1.inOut' }, 0.42);
assembleTl.to('#gFrontGlass',   { x: 3, y: 1.6, rotation: 0.6, duration: 0.22, ease: 'power1.inOut' }, 0.42);

/* Phase C: slow, precise final settle */
assembleTl.to('#gCameraLenses', { x: 0, y: 0, rotation: 0, duration: 0.34, ease: 'power4.out' }, 0.64);
assembleTl.to('#gBackCover',    { x: 0, y: 0, rotation: 0, duration: 0.34, ease: 'power4.out' }, 0.64);
assembleTl.to('#gFrame2',       { x: 0, y: 0, rotation: 0, duration: 0.34, ease: 'power4.out' }, 0.64);
assembleTl.to('#gFrontGlass',   { x: 0, y: 0, rotation: 0, duration: 0.34, ease: 'power4.out' }, 0.64);

/* subtle scale settle "snap" at the very end */
assembleTl.fromTo('.phone-svg-wrap', { scale: 1.015 }, { scale: 1, duration: 0.08, ease: 'power2.out' }, 0.90);

/* ============ INFO CARDS REVEAL ============ */
gsap.utils.toArray('[data-info]').forEach((card, i) => {
  gsap.to(card, {
    opacity: 1,
    filter: 'blur(0px)',
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: card,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    delay: (i % 2) * 0.08
  });
});

/* ============ CAMERA SECTION ============ */
const camTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#camera',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6
  }
});
gsap.set('.cam-visual', { scale: 0.72, opacity: 0 });
gsap.set('.cam-copy', { opacity: 0, y: 12 });
gsap.set('.cam-detail-copy', { opacity: 0, y: 12 });

camTl
  .to('.cam-copy', { opacity: 1, y: 0, duration: 0.14, ease: 'none' }, 0.05)
  .to('.cam-visual', { opacity: 1, scale: 0.9, duration: 0.16, ease: 'none' }, 0.10)
  .to('.cam-copy', { opacity: 0, y: -14, duration: 0.10, ease: 'none' }, 0.30)
  .to('.cam-visual', { scale: 1.28, duration: 0.34, ease: 'none' }, 0.32)
  .to('.cam-detail-copy', { opacity: 1, y: 0, duration: 0.14, ease: 'none' }, 0.55)
  .to('.cam-detail-copy', { opacity: 0, duration: 0.1, ease: 'none' }, 0.78)
  .to('.cam-visual', { scale: 0.9, opacity: 0.85, duration: 0.18, ease: 'none' }, 0.80);

/* ============ DESIGN TILES ============ */
gsap.utils.toArray('[data-tile]').forEach((tile, i) => {
  gsap.to(tile, {
    opacity: 1, y: 0, scale: 1,
    duration: 0.9, ease: 'power2.out',
    delay: i * 0.06,
    scrollTrigger: {
      trigger: tile,
      start: 'top 88%',
      toggleActions: 'play none none reverse'
    }
  });
  const sweep = tile.querySelector('.sheen-sweep');
  gsap.to(sweep, {
    backgroundPosition: '-30% -30%',
    duration: 1.6,
    ease: 'power2.out',
    delay: 0.3 + i * 0.06,
    scrollTrigger: {
      trigger: tile,
      start: 'top 88%',
      toggleActions: 'play none none reverse'
    }
  });
});

/* ============ FINALE ============ */
gsap.set('.finale-copy', { opacity: 0, y: 16 });
ScrollTrigger.create({
  trigger: '#finale',
  start: 'top 60%',
  onEnter: () => gsap.to('.finale-copy', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }),
  onLeaveBack: () => gsap.to('.finale-copy', { opacity: 0, y: 16, duration: 0.6, ease: 'power2.in' })
});
