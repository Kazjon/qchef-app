import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotpasswordPageRoutingModule } from './forgotpassword-routing.module';

import { ForgotpasswordPage } from './forgotpassword.page';
import { ForgotpasswordmodalComponent } from 'src/app/core/components/forgotpasswordmodal/forgotpasswordmodal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ForgotpasswordPageRoutingModule
  ],
  declarations: [
    ForgotpasswordPage,
    ForgotpasswordmodalComponent
  ], 
  entryComponents: [
    ForgotpasswordmodalComponent
  ]
})
export class ForgotpasswordPageModule {}
