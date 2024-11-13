import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { getDatabase, ref as dbRef, set, get, update, remove, child, onValue, push } from "firebase/database";

// Configuración de Firebase
const firebaseConfig = {
	apiKey: "AIzaSyD8PfOAnu89wAFStwhBxUT48RbdqlX9828",
	authDomain: "techshopsoft.firebaseapp.com",
	projectId: "techshopsoft",
	storageBucket: "techshopsoft.appspot.com",
	messagingSenderId: "114819965276",
	appId: "1:114819965276:web:36770db16a2bb8a1266199",
	measurementId: "G-7R442M2WZP"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, ref, getDownloadURL, uploadBytes, deleteObject };
export { database, dbRef, set, get, update, remove, child, onValue, push };