import { Component, ViewChild } from '@angular/core';
import { Platform, IonMenu } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as firebase from 'firebase/app';
import { firebaseConfig } from '../../firebaseconfig';
import { FirebaseService } from './services/firebase/firebase.service';
import { Router } from '@angular/router';

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
        private statusBar: StatusBar,
        private firebaseService: FirebaseService,
        private router: Router
    ) {
        this.initializeApp();

        if (firebase.apps.length <= 0) {
            firebase.initializeApp(firebaseConfig);
        }
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    logout() {
        this.firebaseService.logout()
            .then(() => {
                this.sideMenu.close();
                this.router.navigateByUrl('splash');
            })
            .catch(() => {
                //
            });
    }
}
