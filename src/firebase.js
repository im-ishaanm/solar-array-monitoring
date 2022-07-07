import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBxvL708k7zeMkUWlRCcR73e4mRaPe9_SE",
  authDomain: "esp32-project-test.firebaseapp.com",
  databaseURL:
    "https://esp32-project-test-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp32-project-test",
  storageBucket: "esp32-project-test.appspot.com",
  messagingSenderId: "835411245634",
  appId: "1:835411245634:web:c7402b7cc144dfa927cbdb",
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase
export const db = getDatabase(app);
