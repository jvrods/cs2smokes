import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp, getApp } from '@angular/fire/app';
import { getFirestore, provideFirestore, initializeFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyBGfVwh8L5D2OFZm_G1AXj8sRBQ9Hrz_dc",
      authDomain: "cs2-smokes-4de6e.firebaseapp.com",
      projectId: "cs2-smokes-4de6e",
      storageBucket: "cs2-smokes-4de6e.firebasestorage.app",
      messagingSenderId: "876456087389",
      appId: "1:876456087389:web:ea004c433c44e4352222b4",
      measurementId: "G-ZD0SCT3K15"
    })),
    provideFirestore(() => {
      const app = getApp();
      return initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
      });
    }),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage())
  ]
};
