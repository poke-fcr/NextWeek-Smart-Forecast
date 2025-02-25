import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom(HttpClientModule)]
};

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAW1HViR1Ka1-FWC5Jpqlv5kRl7rlV_zmE",
  authDomain: "nextweek-forecast.firebaseapp.com",
  projectId: "nextweek-forecast",
  storageBucket: "nextweek-forecast.firebasestorage.app",
  messagingSenderId: "318192842397",
  appId: "1:318192842397:web:60827eb39a4e81ebc34674",
  measurementId: "G-036JLFKQH5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);