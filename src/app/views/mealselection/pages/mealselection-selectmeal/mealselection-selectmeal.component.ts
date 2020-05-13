import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealPlanSelectionResponse } from 'src/app/core/objects/MealPlanSelectionResponse';
import { DataService } from 'src/app/services/data/data.service';
import { combineLatest } from 'rxjs';
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
    visibleMealOptions: MealPreference[] = [];
    changeMeal: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private dataService: DataService,
        public modalController: ModalController,
        private router: Router) { }

    ngOnInit() {

        this.route.paramMap.subscribe(params => {
            this.paramMealSlot = parseInt(params.get('mealslot'));

            if (this.router.url.includes('/change')) {
                this.changeMeal = true;
            }

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

    ionViewWillEnter() {
        this.organiseMealOptions();
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
        this.organiseMealOptions();

    }

    private organiseMealOptions() {

        this.visibleMealOptions = [];

        for (let i = 0; i < this.mealOptions.length; i++) {

            if (!this.mealOptions[i].selected || (this.currentMealSlot.recipe != undefined && this.mealOptions[i].id == this.currentMealSlot.recipe.id)) {
                this.visibleMealOptions.push(this.mealOptions[i]);
            }
        }

    }

    private setCurrentMealSlot() {

        for (let i = 0; i < this.mealSlots.length; i++) {
            if (this.paramMealSlot == this.mealSlots[i].id) {
                this.mealSlots[i].active = true;
                this.currentMealSlot = this.mealSlots[i];
                this.updateCurrentMeal(this.currentMealSlot);
                break;
            }
            else {
                this.mealSlots[i].active = false;
            }
        }

    }

    private updateCurrentMeal(mealSlot: MealSlot) {
        if (mealSlot.selected && mealSlot.recipe.id != undefined) {

            for (let i = 0; i < this.visibleMealOptions.length; i++) {
                if (mealSlot.recipe.id == this.visibleMealOptions[i].id) {
                    this.visibleMealOptions[i].selected = true;
                }
            }

        }

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

        this.visibleMealOptions.forEach((meal) => {
            meal.selected = false;
        });

        this.visibleMealOptions[mealIndex].selected = true;

        this.currentMealSlot.selected = true;
        this.currentMealSlot.recipe = this.visibleMealOptions[mealIndex];

        console.log(this.currentMealSlot);


        this.updateMealSlots(this.currentMealSlot);

    }

    private updateMeals() {
        for (let i = 0; i < this.mealOptions.length; i++) {

            for (let p = 0; p < this.visibleMealOptions.length; p++) {

                if (this.visibleMealOptions[p].id == this.mealOptions[i].id) {
                    this.mealOptions[i] = this.visibleMealOptions[p];
                    this.dataService.setRecommendedMeals(this.mealOptions);
                }

            }

        }
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

    goToNext() {

        this.updateMeals();



        if (this.paramMealSlot < this.mealSlots.length) {
            let nextSlot = this.paramMealSlot + 1;
            this.router.navigateByUrl("/mealselection/meal/" + nextSlot);
        }
        else {
            this.router.navigateByUrl("/mealselection/summary", { replaceUrl: true });
        }

    }

    goToSummary() {
        this.router.navigateByUrl("/mealselection/summary");
    }
}
