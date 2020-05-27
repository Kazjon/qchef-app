import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-exitreviewmodal',
  templateUrl: './exitreviewmodal.component.html',
  styleUrls: ['./exitreviewmodal.component.scss'],
})
export class ExitReviewModalComponent implements OnInit {
  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }

}
