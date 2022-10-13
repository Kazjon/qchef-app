import { Component, ViewChild } from "@angular/core";
import { Platform, IonMenu, MenuController, ModalController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
//import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as firebase from "firebase/app";
import { firebaseConfig } from "../../firebaseconfig";
import { FirebaseService } from "./services/firebase/firebase.service";
import { Router } from "@angular/router";
import { DataService } from "./services/data/data.service";
import { Plugins, StatusBarStyle, KeyboardInfo } from "@capacitor/core";
import { DeleteAccountModalComponent } from "./core/components/deleteaccountmodal/deleteaccountmodal.component";
import { DeleteAccountFailModalComponent } from "./core/components/deleteaccountfailmodal/deleteaccountfailmodal.component";

const { Keyboard } = Plugins;
const { StatusBar } = Plugins;

@Component({
   selector: "app-root",
   templateUrl: "app.component.html",
   styleUrls: ["app.component.scss"],
})
export class AppComponent {
   @ViewChild("sideMenu", { static: false }) sideMenu: IonMenu;
   constructor(
      private platform: Platform,
      private splashScreen: SplashScreen,
      private firebaseService: FirebaseService,
      private dataService: DataService,
      private menu: MenuController,
      private router: Router,
      private modalController: ModalController
   ) {
      this.initializeApp();

      if (firebase.apps.length <= 0) {
         firebase.initializeApp(firebaseConfig);
      }

      let idToken = localStorage.getItem("idToken");
      if (idToken != undefined) {
         this.dataService.initAuthToken(idToken);
      } else {
         this.logout();
      }
   }

   initializeApp() {
      this.platform.ready().then(() => {
         StatusBar.setStyle({
            style: StatusBarStyle.Light,
         });
         StatusBar.setOverlaysWebView({
            overlay: true,
         });
         Keyboard.setAccessoryBarVisible({ isVisible: true });
         this.splashScreen.hide();
      });

      // Listen to app active states so we can trigger review submission cancellations if required
      const { App } = Plugins;
      App.addListener("appStateChange", (state: any) => {
         if (state.isActive) {
            // Suspended event
         } else {
            this.dataService.cancelReviewHTTP();
         }
      });
   }

   goTo(page: string) {
      switch (page) {
         case "recipes":
            this.router.navigateByUrl("dashboard/recipes", { replaceUrl: true });
            break;
         case "shoppinglist":
            this.router.navigateByUrl("dashboard/shoppinglist", { replaceUrl: true });
            break;
         case "reviews":
            this.router.navigateByUrl("dashboard/reviews", { replaceUrl: true });
            break;
         case "preferences":
            // TODO: Navigate route
            // this.router.navigateByUrl('dashboard/preferences', { replaceUrl: true });
            break;
      }

      this.menu.close();
   }

   async deleteAccountRequest() {
      const modal = await this.modalController.create({
         component: DeleteAccountModalComponent,
         cssClass: "delete-account-modal",
      });
      return await modal.present();
   }

   logout() {
      this.firebaseService
         .logoutUserFromApp()
         .then(() => {})
         .catch(() => {
            //
         });
   }
}
