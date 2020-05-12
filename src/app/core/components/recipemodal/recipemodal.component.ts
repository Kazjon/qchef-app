import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MealPreference } from '../../objects/MealPreference';

@Component({
    selector: 'app-recipemodal',
    templateUrl: './recipemodal.component.html',
    styleUrls: ['./recipemodal.component.scss'],
})
export class RecipeModalComponent {
    @Input() recipe: MealPreference;

    constructor(public modalController: ModalController) { }

    closeModal() {
        this.modalController.dismiss();
    }

}