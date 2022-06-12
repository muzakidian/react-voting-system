import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';
import { getFirestore } from '@firebase/firestore';

// Initialize Firebase
export const initApp = () => firebase.initializeApp(firebaseConfig);
export const db = getFirestore(initializeApp(firebaseConfig));
