
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

// Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// Angular Calendar & date adapter
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

// Animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';
//auth
import { provideAuth, getAuth } from '@angular/fire/auth';


bootstrapApplication(AppComponent, {
  providers: [
    // Routing
    provideRouter(routes),

    // Firebase
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()), 

    // Angular animations
    importProvidersFrom(BrowserAnimationsModule),

    // Angular Calendar module (standalone)
    importProvidersFrom(CalendarModule),

    // Date adapter pour angular-calendar
    {
      provide: DateAdapter,
      useFactory: adapterFactory
    }
  ],
})
.catch(err => console.error(err));
