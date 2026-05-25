import { firebaseConfig, BOT_USERNAME } from "./config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore(initializeApp(firebaseConfig));
const tg = window.Telegram?.WebApp;
tg?.ready();

const user = tg?.initDataUnsafe?.user;
const userId = String(user?.id || Math.floor(Math.random()*999999));
const startParam = tg?.initDataUnsafe?.start_param;

const userRef = doc(db, "users", userId);
let state = { coins: 0, energy: 100, lastTap: Date.now() };

async function init() {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
        await setDoc(userRef, { 
            coins: 0, energy: 100, 
            referredBy: startParam || null, 
            createdAt: serverTimestamp() 
        });
        if(startParam) await updateDoc(doc(db, "users", startParam), { coins: increment(1000) });
    } else {
        state = snap.data();
    }
    document.getElementById("tgName").innerText = user?.first_name || "Guest";
    updateUI();
}

function updateUI() {
    document.getElementById("coins").innerText = state.coins;
    document.getElementById("energy").innerText = `${state.energy}/100`;
}

document.getElementById("tapBtn").onclick = async () => {
    if(state.energy <= 0 || Date.now() - state.lastTap < 50) return; // Anti-cheat
    state.coins++; state.energy--; state.lastTap = Date.now();
    updateUI();
    await updateDoc(userRef, { coins: increment(1), energy: state.energy });
};

init();
