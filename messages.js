import { db, auth, isConfigured } from "./firebase-config.js";
import {
  collection, query, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const grid   = document.getElementById('cards');
const state  = document.getElementById('state');
const count  = document.getElementById('count');
const logout = document.getElementById('logoutBtn');

function showState(text){
  state.textContent = text;
  state.hidden = false;
}

function formatDate(ts){
  try{
    const d = ts && ts.toDate ? ts.toDate() : null;
    if(!d) return '';
    return d.toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' });
  }catch(e){ return ''; }
}

function buildCard(data, i){
  const card = document.createElement('article');
  card.className = 'msg-card';
  card.style.animationDelay = (Math.min(i, 10) * 0.07) + 's';

  const text = document.createElement('p');
  text.className = 'msg-text';
  text.textContent = data.message || '';

  const foot = document.createElement('div');
  foot.className = 'msg-foot';

  const name = document.createElement('span');
  name.className = 'msg-name';
  name.textContent = data.name || 'مجهول';
  const heart = document.createElement('span');
  heart.className = 'heart';
  heart.textContent = '♥';
  name.appendChild(heart);

  const date = document.createElement('span');
  date.className = 'msg-date';
  date.textContent = formatDate(data.createdAt);

  foot.append(name, date);
  card.append(text, foot);
  return card;
}

let unsubscribe = null;

function startListening(){
  if(unsubscribe) return;
  showState('جاري تحميل الرسائل...');
  const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));

  unsubscribe = onSnapshot(q, (snap) => {
    grid.innerHTML = '';

    if(snap.empty){
      showState('لسه مفيش رسائل، هتظهر هنا أول ما حد يبعت 🤍');
      count.textContent = '';
      return;
    }

    state.hidden = true;
    let i = 0;
    snap.forEach((doc) => grid.appendChild(buildCard(doc.data(), i++)));
    count.textContent = snap.size + ' رسالة حب';
  }, (err) => {
    console.error(err);
    showState('تعذر تحميل الرسائل، اتأكد إنك داخل بحساب العروسين.');
  });
}

if(!isConfigured){
  showState('لسه محتاج تلصق إعدادات Firebase في ملف firebase-config.js');
}else{
  onAuthStateChanged(auth, (user) => {
    if(!user){
      if(unsubscribe){ unsubscribe(); unsubscribe = null; }
      location.replace('index.html');       // مش داخل = يرجع للدعوة
      return;
    }
    startListening();
  });
}

if(logout){
  logout.addEventListener('click', async () => {
    try{ await signOut(auth); }catch(e){ console.error(e); }
    location.replace('index.html');
  });
}
