import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlugintesterPageRoutingModule } from './plugintester-routing.module';

import { PlugintesterPage } from './plugintester.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlugintesterPageRoutingModule
  ],
  declarations: [PlugintesterPage]
})
export class PlugintesterPageModule {}
