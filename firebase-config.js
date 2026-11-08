// ============================================================
// إعدادات Firebase — الصق هنا الـ config بتاعك
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBaqA0zc8HG6WrTGgYnrDcAz-qX5NX7ZPM",
  authDomain: "ahmed-amal.firebaseapp.com",
  projectId: "ahmed-amal",
  storageBucket: "ahmed-amal.firebasestorage.app",
  messagingSenderId: "397769010529",
  appId: "1:397769010529:web:970c770faf07ba7c202920",
};

// اسم المستخدم بيتحول لإيميل بالدومين ده (لازم يطابق الإيميل اللي هتعمله في Firebase)
// مثال: اسم المستخدم "ahmed-amal"  ←  ahmed-amal@example.com
export const USER_DOMAIN = "example.com";

export const isConfigured = !firebaseConfig.apiKey.startsWith("PASTE");

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
