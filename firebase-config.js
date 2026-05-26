import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
getAuth,
signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
apiKey: "AIzaSyDK1uFtei96IVay2mOlgXZMbmQlFWMV3GY",
authDomain: "nexora-81b15.firebaseapp.com",
projectId: "nexora-81b15",
storageBucket: "nexora-81b15.firebasestorage.app",
messagingSenderId: "177538157995",
appId: "1:177538157995:web:a2c91f139402d2166d16ee"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

signInAnonymously(auth)
.then(() => {
console.log("Firebase Connected");
})
.catch((error) => {
console.log(error);
});

export {
db,
auth
};
