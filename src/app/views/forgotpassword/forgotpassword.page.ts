import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
  errorMessage: string = undefined;
  formDisabled: boolean = false;
  loginStates = {
    loading: "loading",
    ready: "ready",
    error: "error"
  }
  state: string = undefined;

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

    this.state = this.loginStates.ready;
  }

  forgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.state = this.loginStates.ready;
      this.enableForm();
      this.errorMessage = "";
      this.confirmSendForgotPasswordEmailPopup()
    }
  }

  async confirmSendForgotPasswordEmailPopup() {

    const modal = await this.modalController.create({
        component: ForgotpasswordmodalComponent,
        cssClass: 'forgot-password-modal',
        componentProps: {
            'email': this.forgotPasswordForm.get('email').value,
        }
    });
    
    modal.onDidDismiss()
      .then((data) => {
        if(data.data) {
          this.state = this.loginStates.error;
          this.errorMessage = data.data;
        } else {
          this.state = this.loginStates.ready;
          this.errorMessage = undefined;
        }
        
    });

    return await modal.present();
  }

  private disableForm() {
    this.forgotPasswordForm.disable();
    this.formDisabled = true;
  }

  private enableForm() {
      this.forgotPasswordForm.enable();
      this.formDisabled = false;
  }
  
}
