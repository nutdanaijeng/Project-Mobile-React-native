// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import {getAuth} from 'firebase/auth';
// import {initializeFirestore} from 'firebase/firestore';
// // import 'firebase/compat/auth';
// // import * as firebase from 'firebase';
// // import 'firebase/compat/firestore';
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBOCI7HwVYIB8PZ6_YU08vyEPWrNCGlnNw",
//   authDomain: "chat-ac823.firebaseapp.com",
//   projectId: "chat-ac823",
//   storageBucket: "chat-ac823.appspot.com",
//   messagingSenderId: "517265906154",
//   appId: "1:517265906154:web:dc1e08b150a9e34b8d7a93"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// Import the functions you need from the SDKs you need
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOCI7HwVYIB8PZ6_YU08vyEPWrNCGlnNw",
  authDomain: "chat-ac823.firebaseapp.com",
  projectId: "chat-ac823",
  storageBucket: "chat-ac823.appspot.com",
  messagingSenderId: "517265906154",
  appId: "1:517265906154:web:dc1e08b150a9e34b8d7a93",
};

let app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
export { db, auth };
// // Initialize Firebase
// const auth = getAuth(app);
// const db = initializeFirestore(app, {
//   experimentalForceLongPolling: true,
// });

// export {auth, db};
