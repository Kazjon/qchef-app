import { Component, Input, OnInit } from '@angular/core';
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
    public modalController: ModalController,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }

  confirmSendEmail() {
    this.modalController.dismiss();
    this.firebaseService.sendPasswordResetEmail(this.email);
  }
}
