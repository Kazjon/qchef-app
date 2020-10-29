import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RecipeModalComponent } from 'src/app/core/components/recipemodal/recipemodal.component';

import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [AppComponent, RecipeModalComponent],
  entryComponents: [RecipeModalComponent],
  imports: [BrowserModule, IonicModule.forRoot({ swipeBackEnabled: false }), AppRoutingModule, HttpClientModule,],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
