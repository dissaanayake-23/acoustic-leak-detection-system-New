import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAVQX524ZhrPQa1FVJDwjLd6e96AEOUsFM",
  authDomain: "acoustic-leak-monitor.firebaseapp.com",
  databaseURL: "https://acoustic-leak-monitor-default-rtdb.firebaseio.com",
  projectId: "acoustic-leak-monitor",
  storageBucket: "acoustic-leak-monitor.firebasestorage.app",
  messagingSenderId: "1067018090271",
  appId: "1:1067018090271:web:6a1d9f3b3f65f5484fa22a",
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);