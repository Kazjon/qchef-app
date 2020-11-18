import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-guidemodal',
  templateUrl: './guidemodal.component.html',
  styleUrls: ['./guidemodal.component.scss'],
})
export class GuidemodalComponent implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    //console.log(this.recipe.description)
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
