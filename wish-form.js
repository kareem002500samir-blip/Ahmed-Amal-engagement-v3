import { db, isConfigured } from "./firebase-config.js";
import {
  collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById('wishForm');
if(form){
  const nameEl = document.getElementById('wishName');
  const msgEl  = document.getElementById('wishMsg');
  const hpEl   = document.getElementById('wishHp');
  const btn    = document.getElementById('wishBtn');
  const status = document.getElementById('wishStatus');

  const COOLDOWN_MS = 30 * 1000;   // رسالة واحدة كل 30 ثانية من نفس الجهاز

  function show(text, type){
    status.textContent = text;
    status.className = 'wish-status ' + (type || '');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if(hpEl && hpEl.value) return;                 // بوت
    if(!isConfigured){ show('الخدمة لسه ما اتفعلتش', 'err'); return; }

    const name = nameEl.value.trim();
    const message = msgEl.value.trim();
    if(!name || !message){ show('من فضلك اكتب اسمك ورسالتك', 'err'); return; }

    let last = 0;
    try{ last = Number(localStorage.getItem('wishLastSent') || 0); }catch(_){}
    if(Date.now() - last < COOLDOWN_MS){
      show('استنى شوية قبل ما تبعت رسالة تانية', 'err');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'جاري الإرسال...';
    show('');

    try{
      await addDoc(collection(db, 'wishes'), {
        name: name.slice(0, 40),
        message: message.slice(0, 500),
        createdAt: serverTimestamp()
      });
      try{ localStorage.setItem('wishLastSent', String(Date.now())); }catch(_){}
      form.reset();
      show('وصلت رسالتك للعروسين، شكراً ليك 🤍', 'ok');
    }catch(err){
      console.error(err);
      show('حصلت مشكلة في الإرسال، حاول تاني', 'err');
    }finally{
      btn.disabled = false;
      btn.textContent = 'إرسال';
    }
  });
}
