/* ===== GAME CORE LOGIC ===== */
const stars=document.getElementById('stars');
for(let i=0;i<80;i++){
    let star=document.createElement('div');
    star.classList.add('star');
    star.style.left=Math.random()*100+'%';
    star.style.top=Math.random()*100+'%';
    star.style.animationDelay=Math.random()*5+'s';
    stars.appendChild(star);
}

function switchScreen(screenId, element) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + screenId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
}

let tg = window.Telegram?.WebApp;
if (tg) { tg.expand(); tg.ready(); }
let telegramUser = tg?.initDataUnsafe?.user;
document.getElementById('tgName').innerText = telegramUser ? telegramUser.first_name : "Player_1";

let coins = parseInt(localStorage.getItem('nexora_coins')) || 0;
let energy = parseInt(localStorage.getItem('nexora_energy')) || 100;
let maxEnergy = parseInt(localStorage.getItem('nexora_max_energy')) || 100;
let tapValue = parseInt(localStorage.getItem('nexora_tap_value')) || 1;
// ... (baki saari logic waise hi hai)

function updateUI(){ /* ... */ }
function floating(text, event){ /* ... */ }
// ... (saare functions yahan paste honge)

tapBtn.addEventListener('click',(e)=>{ /* ... */ });
setInterval(()=>{ /* ... */ }, 1500);

setTimeout(() => {
    updateUI();
    document.getElementById('loadingScreen').style.opacity = '0';
    setTimeout(() => document.getElementById('loadingScreen').style.display = 'none', 500);
}, 800);
