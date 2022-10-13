import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { RecipeModalComponent } from "src/app/core/components/recipemodal/recipemodal.component";

import { HttpClientModule } from "@angular/common/http";
import { SharedComponentsModule } from "../app/core/components/shared.module";
import { DeleteAccountModalComponent } from "src/app/core/components/deleteaccountmodal/deleteaccountmodal.component";
import { DeleteAccountFailModalComponent } from "src/app/core/components/deleteaccountfailmodal/deleteaccountfailmodal.component";

@NgModule({
   declarations: [AppComponent, RecipeModalComponent, DeleteAccountModalComponent, DeleteAccountFailModalComponent],
   entryComponents: [RecipeModalComponent, DeleteAccountModalComponent, DeleteAccountFailModalComponent],
   imports: [BrowserModule, IonicModule.forRoot({ swipeBackEnabled: false }), AppRoutingModule, HttpClientModule, SharedComponentsModule],
   providers: [StatusBar, SplashScreen, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
   bootstrap: [AppComponent],
})
export class AppModule {}
