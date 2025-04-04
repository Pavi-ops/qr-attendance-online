import { defineNuxtPlugin } from '#app'
import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

export default defineNuxtPlugin(async (nuxtApp) => {
  const firebaseConfig = {
    apiKey: "AIzaSyB8lrDVNeYDLGoxdhpk7fCgfvJ1bId8fZ0",
    authDomain: "sliit-project-f776c.firebaseapp.com",
    projectId: "sliit-project-f776c",
    storageBucket: "sliit-project-f776c.firebasestorage.app",
    messagingSenderId: "359216845490",
    appId: "1:359216845490:web:b6c522e408ed0a8c196fab"
  }

  const app: FirebaseApp = initializeApp(firebaseConfig)
  const auth: Auth = getAuth(app)
  await setPersistence(auth, browserLocalPersistence)

  const db: Firestore = getFirestore(app)

  nuxtApp.provide('auth', auth)
  nuxtApp.provide('db', db)
})