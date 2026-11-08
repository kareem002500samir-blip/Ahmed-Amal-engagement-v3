// Envelope intro
(function(){
  const seal = document.getElementById('waxSeal');
  const box = document.querySelector('.zarf-box');
  const intro = document.getElementById('zarf-intro');
  const music = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  if(!seal || !box || !intro) return;

  document.documentElement.style.overflow = 'hidden';

  seal.addEventListener('click', () => {
    if(box.classList.contains('opening')) return;
    box.classList.add('opening');

    if(music){
      music.volume = 0.55;
      music.play().catch(()=>{});
    }
    if(musicToggle){
      musicToggle.classList.add('visible');
    }

    setTimeout(() => {
      intro.classList.add('opened');
      document.documentElement.style.overflow = '';
    }, 700);
  });

  if(musicToggle && music){
    musicToggle.addEventListener('click', () => {
      if(music.paused){
        music.play().catch(()=>{});
        musicToggle.classList.remove('muted');
      } else {
        music.pause();
        musicToggle.classList.add('muted');
      }
    });
  }
})();

// Countdown
const target = new Date("2026-12-10T19:00:00+02:00").getTime();
const daysEl = document.getElementById('cd-days');
const hoursEl = document.getElementById('cd-hours');
const minsEl = document.getElementById('cd-mins');
const secsEl = document.getElementById('cd-secs');

// ترتيب العدّاد من الشمال لليمين: يوم - ساعة - دقيقة - ثانية
(function orderCountdown(){
  if(!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // نلاقي أقرب عنصر أب مشترك للأربع خانات
  let container = daysEl.parentElement;
  while(container && !(container.contains(hoursEl) && container.contains(minsEl) && container.contains(secsEl))){
    container = container.parentElement;
  }
  if(!container) return;

  // نجيب كل خانة (الابن المباشر للحاوية اللي جواه الرقم)
  const itemOf = (el) => {
    let n = el;
    while(n && n.parentElement !== container) n = n.parentElement;
    return n;
  };
  const items = [daysEl, hoursEl, minsEl, secsEl].map(itemOf);
  if(items.some(i => !i)) return;

  // نرتب العناصر في الـ DOM: يوم ثم ساعة ثم دقيقة ثم ثانية
  items.forEach(i => container.appendChild(i));

  // الحاوية LTR عشان أول عنصر (اليوم) يبقى على الشمال
  container.style.direction = 'ltr';
  // النص جوه كل خانة يفضل عربي RTL
  items.forEach(i => { i.style.direction = 'rtl'; });
})();

function pad(n){ return String(n).padStart(2,'0'); }

function tick(){
  const now = Date.now();
  let diff = target - now;
  if(diff < 0) diff = 0;
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff / (1000*60*60)) % 24);
  const mins = Math.floor((diff / (1000*60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  daysEl.textContent = pad(days);
  hoursEl.textContent = pad(hours);
  minsEl.textContent = pad(mins);
  secsEl.textContent = pad(secs);
}
tick();
setInterval(tick, 1000);

// Scroll reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-section').forEach((el, i)=>{
  el.style.transitionDelay = (i % 6) * 0.08 + 's';
  io.observe(el);
});