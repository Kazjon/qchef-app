import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MealPreference } from '../../objects/MealPreference';
import { DataService } from 'src/app/services/data/data.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-recipemodal',
    templateUrl: './recipemodal.component.html',
    styleUrls: ['./recipemodal.component.scss'],
})
export class RecipeModalComponent {
    @Input() recipe: MealPreference;
    @Input() showReview: boolean;
    closeImgSrc: string;

    constructor(public modalController: ModalController, private dataService: DataService, private router: Router) {
        this.closeImgSrc = "../../../assets/images/icon-close.svg";
    }

    closeModal() {

        this.dataService.logAction(this.recipe.id, "closed");

        this.modalController.dismiss();
    }

    openReview() {
        this.modalController.dismiss();
        this.router.navigateByUrl("/dashboard/reviews-form/" + this.recipe.id);
    }

}
