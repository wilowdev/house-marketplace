// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDrBk_s6rWbbtjvQjUgoC3aXyCeMm1yKjs',
  authDomain: 'house-marketplace-app-392b1.firebaseapp.com',
  projectId: 'house-marketplace-app-392b1',
  storageBucket: 'house-marketplace-app-392b1.appspot.com',
  messagingSenderId: '656337136010',
  appId: '1:656337136010:web:c219e9410cb38a4e1c0073',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
