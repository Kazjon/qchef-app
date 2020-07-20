import { Component, ViewChild } from '@angular/core';
import { Platform, IonMenu, MenuController } from '@ionic/angular';
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
        private menu: MenuController,
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
