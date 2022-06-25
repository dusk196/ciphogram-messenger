import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { initializeAppCheck, provideAppCheck, ReCaptchaV3Provider } from '@angular/fire/app-check';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { ServiceWorkerModule } from '@angular/service-worker';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { HomeComponent } from './components/home/home.component';
import { StartComponent } from './components/start/start.component';
import { MessagesComponent } from './components/messages/messages.component';
import { InfoModalComponent } from './components/messages/info-modal/info-modal.component';
import { ErrorComponent } from './components/error/error.component';

import { ModalComponent } from './components/shared/modal/modal.component';

import { UserByIdPipe } from './pipes/user-by-id.pipe';
import { DecryptMsgsPipe } from './pipes/decrypt-msgs.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StartComponent,
    MessagesComponent,
    InfoModalComponent,
    ErrorComponent,
    ModalComponent,
    UserByIdPipe,
    DecryptMsgsPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAppCheck(() => initializeAppCheck(getApp(), { provider: new ReCaptchaV3Provider(environment.recaptchaSiteKey), isTokenAutoRefreshEnabled: true })),
    provideDatabase(() => getDatabase()),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
