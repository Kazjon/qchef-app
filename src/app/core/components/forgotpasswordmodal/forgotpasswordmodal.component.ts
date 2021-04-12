import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

@Component({
  selector: 'app-forgotpasswordmodal',
  templateUrl: './forgotpasswordmodal.component.html',
  styleUrls: ['./forgotpasswordmodal.component.scss'],
})
export class ForgotpasswordmodalComponent implements OnInit {
  @Input() email: string;
  constructor(
    private router: Router,
    public modalController: ModalController,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }

  confirmSendEmail() {
    
    this.firebaseService.sendPasswordResetEmail(this.email).then((res) => {
      this.modalController.dismiss();
      this.router.navigateByUrl('login', { replaceUrl: true });

    })
    .catch((error) => {
      console.log(error)
      let errorMsg = error.message;
      this.modalController.dismiss(errorMsg);
    });
  }
}
