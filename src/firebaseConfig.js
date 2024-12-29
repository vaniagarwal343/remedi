import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDWgWicsKnOffJMhFtlkGg6qW5WhYf7tQo",
  authDomain: "remedicate-app.firebaseapp.com",
  projectId: "remedicate-app",
  storageBucket: "remedicate-app.firebasestorage.app",
  messagingSenderId: "485284880675",
  appId: "1:485284880675:web:4ef569e5977975539f2c96",
  measurementId: "G-5GJMFFRH7K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;