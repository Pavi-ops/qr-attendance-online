// plugins/firebase.client.js
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyB8lrDVNeYDLGoxdhpk7fCgfvJ1bId8fZ0",
  authDomain: "sliit-project-f776c.firebaseapp.com",
  databaseURL: "https://sliit-project-f776c-default-rtdb.firebaseio.com",
  projectId: "sliit-project-f776c",
  storageBucket: "sliit-project-f776c.firebasestorage.app",
  messagingSenderId: "359216845490",
  appId: "1:359216845490:web:b6c522e408ed0a8c196fab"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export default defineNuxtPlugin(() => {
  return {
    provide: {
      db,
      auth
    }
  }
})
