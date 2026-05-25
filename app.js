import { firebaseConfig, BOT_USERNAME } from "./config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
getFirestore,
doc,
getDoc,
setDoc,
updateDoc,
increment,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const user = tg?.initDataUnsafe?.user;

const userId = user?.id || "guest_" + Math.floor(Math.random()*999999);

document.getElementById("tgName").innerText =
user?.first_name || "Player";

const userRef = doc(db,"users",String(userId));

let coins=0;
let energy=100;
let maxEnergy=100;
let tapValue=1;

/* LOAD USER */
async function loadUser(){
const snap=await getDoc(userRef);

if(snap.exists()){
const d=snap.data();
coins=d.coins||0;
energy=d.energy||100;
maxEnergy=d.maxEnergy||100;
tapValue=d.tapValue||1;
}else{
await setDoc(userRef,{
telegramId:userId,
coins:0,
energy:100,
maxEnergy:100,
tapValue:1,
referredBy:null,
createdAt:serverTimestamp()
});
}
updateUI();
}

/* UI */
function updateUI(){
document.getElementById("coins").innerText=coins;
document.getElementById("energyText").innerText=`${energy}/${maxEnergy}`;
}

/* FLOAT */
function float(text){
const d=document.createElement("div");
d.className="float";
d.innerText=text;
document.body.appendChild(d);
setTimeout(()=>d.remove(),800);
}

/* TAP */
document.getElementById("tapBtn").onclick=async()=>{
if(energy<tapValue) return float("Low Energy");

coins+=tapValue;
energy-=tapValue;

await updateDoc(userRef,{
coins:increment(tapValue),
energy:energy
});

updateUI();
float("+"+tapValue);
};

/* DAILY */
window.dailyReward=async()=>{
await updateDoc(userRef,{coins:increment(100)});
coins+=100;
updateUI();
float("+100");
};

/* ADS */
window.watchAd=async()=>{
await updateDoc(userRef,{coins:increment(250)});
coins+=250;
updateUI();
float("+250");
};

/* UPGRADE */
window.buyUpgrade=async(type)=>{
if(type==="multitap"){
if(coins<500) return;
coins-=500;
tapValue++;
}
if(type==="energy"){
if(coins<1000) return;
coins-=1000;
maxEnergy+=50;
energy=maxEnergy;
}

await updateDoc(userRef,{
coins,
tapValue,
maxEnergy,
energy
});

updateUI();
};

/* REFERRAL */
window.inviteFriends=function(){
const link=`https://t.me/${BOT_USERNAME}?startapp=${userId}`;
navigator.clipboard.writeText(link);
alert("Copied:\n"+link);
};

/* ENERGY REGEN */
setInterval(()=>{
if(energy<maxEnergy){
energy++;
updateUI();
}
},1500);

loadUser();