import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-incompletereviewmodal',
  templateUrl: './incompletereviewmodal.component.html',
  styleUrls: ['./incompletereviewmodal.component.scss'],
})
export class IncompleteReviewModalComponent implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }
}
