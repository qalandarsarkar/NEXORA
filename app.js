import {
db
} from "./firebase-config.js";

import {
doc,
setDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ===== TELEGRAM ===== */

let tg = window.Telegram?.WebApp;

if(tg){
tg.expand();
tg.ready();
}

let telegramUser = tg?.initDataUnsafe?.user;

let username =
telegramUser?.first_name || "Player";

document.getElementById("tgName").innerText =
username;

/* ===== USER ID ===== */

const userId =
telegramUser?.id?.toString() ||
localStorage.getItem("nexora_local_id") ||
Date.now().toString();

localStorage.setItem(
"nexora_local_id",
userId
);

/* ===== GAME DATA ===== */

let coins = 0;
let energy = 100;
let maxEnergy = 100;
let tapValue = 1;

/* ===== ELEMENTS ===== */

const coinsEl =
document.getElementById("coins");

const energyText =
document.getElementById("energyText");

const fill =
document.getElementById("fill");

const tapBtn =
document.getElementById("tapBtn");

const rank =
document.getElementById("rank");

/* ===== LOAD DATA ===== */

async function loadData(){

const ref = doc(db,"users",userId);

const snap = await getDoc(ref);

if(snap.exists()){

const data = snap.data();

coins = data.coins || 0;
energy = data.energy || 100;
maxEnergy = data.maxEnergy || 100;
tapValue = data.tapValue || 1;

}

updateUI();

}

loadData();

/* ===== SAVE ===== */

async function saveData(){

await setDoc(doc(db,"users",userId),{

username,
coins,
energy,
maxEnergy,
tapValue,
updatedAt: Date.now()

});

}

/* ===== UPDATE UI ===== */

function updateUI(){

coinsEl.innerText =
coins.toLocaleString();

energyText.innerText =
energy + "/" + maxEnergy;

fill.style.width =
(energy/maxEnergy*100)+"%";

if(coins>=10000){
rank.innerText='Legend';
}
else if(coins>=5000){
rank.innerText='Master';
}
else if(coins>=2000){
rank.innerText='Pro';
}
else if(coins>=500){
rank.innerText='Elite';
}
else{
rank.innerText='Rookie';
}

}

/* ===== FLOAT ===== */

function floating(text,event){

const div =
document.createElement("div");

div.className = "float";

div.innerText = text;

div.style.left =
(event?.clientX || window.innerWidth/2)+"px";

div.style.top =
(event?.clientY || window.innerHeight/2)+"px";

document.body.appendChild(div);

setTimeout(()=>{
div.remove();
},800);

}

/* ===== TAP ===== */

tapBtn.addEventListener("click",async(e)=>{

if(energy < tapValue){

floating("Low Energy!",e);

return;

}

coins += tapValue;

energy -= tapValue;

navigator.vibrate?.(15);

floating("+"+tapValue,e);

updateUI();

saveData();

});

/* ===== DAILY ===== */

window.dailyReward = function(){

coins += 100;

updateUI();

saveData();

alert("Daily Reward Claimed");

};

/* ===== ADS ===== */

window.watchAd = function(){

coins += 250;

updateUI();

saveData();

alert("Ad Reward Added");

};

/* ===== BOOST ===== */

window.buyUpgrade = function(type){

if(type === "multitap"){

if(coins >= 500){

coins -= 500;

tapValue++;

updateUI();

saveData();

alert("Multitap Upgraded");

}
else{

alert("Not enough coins");

}

}

if(type === "energy"){

if(coins >= 1000){

coins -= 1000;

maxEnergy += 50;

energy = maxEnergy;

updateUI();

saveData();

alert("Energy Increased");

}
else{

alert("Not enough coins");

}

}

};

/* ===== WALLET ===== */

window.connectWallet = function(){

alert("TON Wallet Coming Soon");

};

/* ===== ENERGY ===== */

setInterval(()=>{

if(energy < maxEnergy){

energy++;

updateUI();

saveData();

}

},1500);

/* ===== START ===== */

setTimeout(()=>{

document.getElementById(
"loadingScreen"
).style.display="none";

},1000);
