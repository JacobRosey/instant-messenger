import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { UserAuthService } from './userauth.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { InboxComponent } from './dashboard/inbox/inbox.component';

import {provideFirebaseApp, getApp, initializeApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBkBAZhma4e-dpFFAoj6LNsdZoZaK4UpF8",
  authDomain: "cipherchat-ec110.firebaseapp.com",
  projectId: "cipherchat-ec110",
  storageBucket: "cipherchat-ec110.appspot.com",
  messagingSenderId: "794202721899",
  appId: "1:794202721899:web:3f1146c877899b775deb2e",
  measurementId: "G-LD02TR9FZM"
};

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    ToolbarComponent,
    DashboardComponent,
    UserRegisterComponent,
    LandingPageComponent,
    PagenotfoundComponent,
    InboxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
  providers: [UserAuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
