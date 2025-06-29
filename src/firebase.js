import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7QYLv0SFz2or8WSLHAv8y5rfKUo8IaK4",
  authDomain: "redleafstats.firebaseapp.com",
  projectId: "redleafstats",
  storageBucket: "redleafstats.firebasestorage.app",
  messagingSenderId: "548150773399",
  appId: "1:548150773399:web:06549c81f36615db2b8bd2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
