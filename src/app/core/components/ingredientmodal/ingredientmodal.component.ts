import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MealPreference } from '../../objects/MealPreference';

@Component({
  selector: 'app-ingredientmodal',
  templateUrl: './ingredientmodal.component.html',
  styleUrls: ['./ingredientmodal.component.scss'],
})
export class IngredientmodalComponent implements OnInit {
  @Input() recipe: MealPreference;
  constructor(public modalController: ModalController) { }

  ngOnInit() {
    console.log(this.recipe.description)
  }
  
  closeModal() {
    this.modalController.dismiss();
  }

}
