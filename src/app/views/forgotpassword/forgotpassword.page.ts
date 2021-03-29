import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ForgotpasswordmodalComponent } from 'src/app/core/components/forgotpasswordmodal/forgotpasswordmodal.component';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {
  forgotPasswordForm: FormGroup;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [
          Validators.required,
          Validators.pattern("[^ @]*@[^ @]*")
      ]]
    });
  }

  forgotPassword() {
    this.confirmSendForgotPasswordEmailPopup()
  }

  async confirmSendForgotPasswordEmailPopup() {

    const modal = await this.modalController.create({
        component: ForgotpasswordmodalComponent,
        cssClass: 'forgot-password-modal',
        componentProps: {
            'email': this.forgotPasswordForm.get('email').value,
        }
    });
    return await modal.present();
  }

  goTo(route) {
    this.router.navigateByUrl(route);
  }
}
