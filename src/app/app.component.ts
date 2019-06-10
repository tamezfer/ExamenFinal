import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import * as firebase from 'firebase';
export const config = {
  apiKey: "AIzaSyC37ZwHfemWs4FtqgE_3q2OlRNHHfMCSlM",
    authDomain: "examen-19d7e.firebaseapp.com",
    databaseURL: "https://examen-19d7e.firebaseio.com",
    projectId: "examen-19d7e",
    storageBucket: "examen-19d7e.appspot.com",
    messagingSenderId: "369060780514",
    appId: "1:369060780514:web:72cbf985ec00cfe1"
};
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    firebase.initializeApp(config);
  }
}

