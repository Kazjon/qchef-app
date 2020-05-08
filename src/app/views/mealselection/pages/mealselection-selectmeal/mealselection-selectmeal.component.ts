import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MealPlanSelectionResponse } from 'src/app/core/objects/MealPlanSelectionResponse';
import { DataService } from 'src/app/services/data/data.service';
import { forkJoin, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { MealsPerWeekResponse } from 'src/app/core/objects/MealsPerWeekResponse';
import { MealPreference } from 'src/app/core/objects/MealPreference';
import { ModalController } from '@ionic/angular';
import { RecipeModalComponent } from '../../../../core/components/recipemodal/recipemodal.component';
import { MealSlot } from 'src/app/core/objects/MealSlot';

@Component({
    selector: 'app-mealselection-selectmeal',
    templateUrl: './mealselection-selectmeal.component.html',
    styleUrls: ['./mealselection-selectmeal.component.scss'],
})
export class MealSelectionSelectMealComponent implements OnInit {
    currentMealSlot: MealSlot;
    mealsPerWeek: MealsPerWeekResponse;
    mealOptions: MealPreference[];
    mealSlots: MealSlot[];
    canContinue: boolean = false;
    paramMealSlot: number;

    constructor(
        private route: ActivatedRoute,
        private dataService: DataService,
        public modalController: ModalController) { }

    ngOnInit() {

        this.route.paramMap.subscribe(params => {
            this.paramMealSlot = parseInt(params.get('mealslot'));
        });

        // get meals per week
        // get meal slots
        // get meal recommendations
        forkJoin({
            mealsPerWeek: this.dataService.mealsPerWeek.pipe(take(1)),
            mealSlots: this.dataService.mealSlots.pipe(take(1)),
            mealRecommendations: this.dataService.recommendedMeals.pipe(take(1))
        }).subscribe((res) => {
            this.initialiseData(res);
        });

    }

    private initialiseData(data) {

        this.mealSlots = data.mealSlots;
        this.mealsPerWeek = data.mealsPerWeek;
        this.mealOptions = data.mealRecommendations;

    }

    selectMeal(mealIndex: number) {

        this.mealOptions.forEach((meal) => {
            meal.selected = false;
        });

        this.mealOptions[mealIndex].selected = true;

        this.canContinue = true;

    }

    async openRecipe(recipe: MealPreference) {

        const modal = await this.modalController.create({
            component: RecipeModalComponent,
            componentProps: {
                'recipe': recipe
            }
        });

        return await modal.present();

    }
}
