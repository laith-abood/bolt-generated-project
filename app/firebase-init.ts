// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQdEka09c_N0fA-J8sRu6951EyIrIWU9s",
  authDomain: "mrbobheap.firebaseapp.com",
  projectId: "mrbobheap",
  storageBucket: "mrbobheap.firebasestorage.app",
  messagingSenderId: "231341770899",
  appId: "1:231341770899:web:1fedaadebb2c34ffffe566",
  measurementId: "G-CHR47TX043"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };
