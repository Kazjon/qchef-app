import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ingredientmodal',
  templateUrl: './ingredientmodal.component.html',
  styleUrls: ['./ingredientmodal.component.scss'],
})
export class IngredientmodalComponent implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {}
  
  closeModal() {
    this.modalController.dismiss();
  }

}
