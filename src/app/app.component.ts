import { Component, ViewChild } from '@angular/core';
import { Platform, IonMenu, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
//import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as firebase from 'firebase/app';
import { firebaseConfig } from '../../firebaseconfig';
import { FirebaseService } from './services/firebase/firebase.service';
import { Router } from '@angular/router';
import { DataService } from './services/data/data.service';
import {
    Plugins,
    StatusBarStyle,
    KeyboardInfo
  } from '@capacitor/core';

  const { Keyboard } = Plugins;
  const { StatusBar } = Plugins;

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    @ViewChild('sideMenu', { static: false }) sideMenu: IonMenu;
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private firebaseService: FirebaseService,
        private dataService: DataService,
        private menu: MenuController,
        private router: Router
    ) {
        this.initializeApp();

        if (firebase.apps.length <= 0) {
            firebase.initializeApp(firebaseConfig);
        }

        let idToken = localStorage.getItem("idToken");
        if (idToken != undefined) {
            this.dataService.initAuthToken(idToken);
        }
        else {
            this.logout();
        }

    }

    initializeApp() {
        this.platform.ready().then(() => {
            StatusBar.setStyle({
                style: StatusBarStyle.Light
              });
            StatusBar.setOverlaysWebView({
                overlay: true
            });
            Keyboard.setAccessoryBarVisible({isVisible: true});
            this.splashScreen.hide();
        });
    }

    goTo(page: string) {
        switch(page) {
            case 'recipes':
                this.router.navigateByUrl('dashboard/recipes', { replaceUrl: true });
                break;
            case 'shoppinglist':
                this.router.navigateByUrl('dashboard/shoppinglist', { replaceUrl: true });
                break;
            case 'reviews':
                this.router.navigateByUrl('dashboard/reviews', { replaceUrl: true });
                break;
            case 'preferences':
                // TODO: Navigate route
                // this.router.navigateByUrl('dashboard/preferences', { replaceUrl: true });
                break;
        }

        this.menu.close();

    }

    logout() {
        console.log("logout!");
        this.firebaseService.logout()
            .then(() => {
                console.log("logged out?");
                console.log(this.sideMenu);
                this.sideMenu.close();
                this.router.navigateByUrl('splash');
            })
            .catch(() => {
                //
            });
    }
}
