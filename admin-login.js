import { auth, USER_DOMAIN, isConfigured } from "./firebase-config.js";
import {
  onAuthStateChanged, signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const toggle = document.getElementById('adminToggle');
const music  = document.getElementById('musicToggle');
const modal  = document.getElementById('loginModal');
const form   = document.getElementById('loginForm');
const userEl = document.getElementById('loginUser');
const passEl = document.getElementById('loginPass');
const btn    = document.getElementById('loginBtn');
const status = document.getElementById('loginStatus');

if(toggle && modal && form){

  // أيقونة القفل تظهر مع أيقونة المزيكا (بعد فتح الظرف)
  if(music){
    const sync = () => toggle.classList.toggle('visible', music.classList.contains('visible'));
    new MutationObserver(sync).observe(music, { attributes: true, attributeFilter: ['class'] });
    sync();
  }

  let currentUser = null;
  onAuthStateChanged(auth, (u) => { currentUser = u; });

  function setStatus(text){ status.textContent = text || ''; }

  function openModal(){
    setStatus('');
    modal.hidden = false;
    setTimeout(() => userEl.focus(), 50);
  }
  function closeModal(){
    modal.hidden = true;
    form.reset();
    setStatus('');
  }

  toggle.addEventListener('click', () => {
    if(currentUser){ location.href = 'messages.html'; }   // لو داخل قبل كده
    else { openModal(); }
  });

  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && !modal.hidden) closeModal();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(!isConfigured){ setStatus('الخدمة لسه ما اتفعلتش'); return; }

    const username = userEl.value.trim().toLowerCase();
    const password = passEl.value;
    if(!username || !password){ setStatus('اكتب اسم المستخدم وكلمة السر'); return; }

    const email = username.includes('@') ? username : username + '@' + USER_DOMAIN;

    btn.disabled = true;
    btn.textContent = 'جاري الدخول...';
    setStatus('');

    try{
      await signInWithEmailAndPassword(auth, email, password);
      location.href = 'messages.html';
    }catch(err){
      console.error(err);
      if(err.code === 'auth/too-many-requests'){
        setStatus('محاولات كتير، حاول تاني بعد شوية');
      }else if(err.code === 'auth/network-request-failed'){
        setStatus('مفيش اتصال بالإنترنت');
      }else{
        setStatus('اسم المستخدم أو كلمة السر غير صحيحة');
      }
      passEl.value = '';
    }finally{
      btn.disabled = false;
      btn.textContent = 'دخول';
    }
  });
}
