import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore/lite'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCl-xdRRlw2sCTGw_s-FcK4aHrsKm_PPdY',
  authDomain: 'kw-magic3t.firebaseapp.com',
  projectId: 'kw-magic3t',
  storageBucket: 'kw-magic3t.appspot.com',
  messagingSenderId: '586055179641',
  appId: '1:586055179641:web:a631be38039c386d1723a8',
  measurementId: 'G-02NLLLF02Z',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

export const auth = getAuth()

export const firestore = getFirestore()

export const provider = new GoogleAuthProvider()
