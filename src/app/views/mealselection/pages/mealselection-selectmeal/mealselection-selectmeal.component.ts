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

        combineLatest(
            this.dataService.mealsPerWeekObservable,
            this.dataService.mealSlotsObservable,
            this.dataService.recommendedMealsObservable
        ).pipe(
            take(4)
        )
        .subscribe(([mealsPerWeek, mealSlots, recommendedMeals]) => {
            this.checkData(mealsPerWeek, mealSlots, recommendedMeals);
        });

    }

    private checkData(mealsPerWeek, mealSlots, recommendedMeals) {
        if (mealSlots.length <= 0) {
            this.dataService.getMealSlotsFromLocal();
        }
        else if (recommendedMeals.length <= 0) {
            this.dataService.getRecommendedMealsFromLocal();
        }
        else {
            this.initialiseData(mealsPerWeek, mealSlots, recommendedMeals);
        }
    }

    private initialiseData(mealsPerWeek, mealSlots, recommendedMeals) {

        this.mealsPerWeek = mealsPerWeek;
        this.mealSlots = mealSlots;
        this.mealOptions = recommendedMeals;

        this.setCurrentMealSlot();

    }

    private setCurrentMealSlot() {
        for (let i = 0; i < this.mealSlots.length; i++) {
            if (this.paramMealSlot == this.mealSlots[i].id) {
                this.currentMealSlot = this.mealSlots[i];
                this.updateCurrentMeal(this.currentMealSlot);
                break;
            }
        }
    }

    private updateCurrentMeal(mealSlot: MealSlot) {
        if (mealSlot.selected && mealSlot.recipeID != undefined) {

            for (let i = 0; i < this.mealOptions.length; i++) {
                if (mealSlot.recipeID == this.mealOptions[i].id) {
                    this.mealOptions[i].selected = true;
                }
            }

        }

        console.log(this.mealOptions);
    }

    private updateMealSlots(mealSlot: MealSlot) {

        for (let i = 0; i < this.mealSlots.length; i++) {
            if (mealSlot.id == this.mealSlots[i].id) {
                this.mealSlots[i] = mealSlot;
                this.dataService.setMealSlots(this.mealSlots);
                break;
            }
        }

    }

    selectMeal(mealIndex: number) {

        this.mealOptions.forEach((meal) => {
            meal.selected = false;
        });

        this.mealOptions[mealIndex].selected = true;

        this.currentMealSlot.selected = true;
        this.currentMealSlot.image = this.mealOptions[mealIndex].image;
        this.currentMealSlot.recipeID = this.mealOptions[mealIndex].id;

        this.updateMealSlots(this.currentMealSlot);

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
