// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCg2Rl7gO_CASG-0Ml6rjsRcAWkPoII6s8',
  authDomain: 'algar-1616501032135.firebaseapp.com',
  projectId: 'algar-1616501032135',
  storageBucket: 'algar-1616501032135.appspot.com',
  messagingSenderId: '759630716122',
  appId: '1:759630716122:web:21f120906602f49890d9e3',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
