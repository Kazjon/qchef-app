import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MealPlanSelection } from 'src/app/core/objects/MealPlanSelection';
import { DataService } from 'src/app/services/data/data.service';
import { Subscription } from 'rxjs';
import { MealsPerWeekResponse } from 'src/app/core/objects/MealsPerWeekResponse';
import { MealPreference } from 'src/app/core/objects/MealPreference';
import { ModalController } from '@ionic/angular';
import { RecipeModalComponent } from '../../../../core/components/recipemodal/recipemodal.component';

@Component({
    selector: 'app-mealselection-selectmeal',
    templateUrl: './mealselection-selectmeal.component.html',
    styleUrls: ['./mealselection-selectmeal.component.scss'],
})
export class MealSelectionSelectMealComponent implements OnInit {
    mealSlot: number;
    mealsPerWeekSubscription: Subscription;
    mealsPerWeek: MealsPerWeekResponse;
    allSelectedMealPlans: MealPlanSelection[];
    mealPlanSelection: MealPlanSelection;
    mealOptions: MealPreference[];
    canContinue: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private dataService: DataService,
        public modalController: ModalController) { }

    ngOnInit() {

        this.mealsPerWeekSubscription = this.dataService.mealsPerWeekObservable.subscribe((res) => {
            this.mealsPerWeek = res;
        });

        this.allSelectedMealPlans = this.dataService.getMealPlansFromLocal();

        this.route.paramMap.subscribe(params => {
            let mealSlot: number = parseInt(params.get('mealslot'));
            this.initialiseMealSlot(mealSlot);
        });

        this.dataService.getMealsFromServer().subscribe((res) => {
            this.mealOptions = res;
        });

    }

    ngOnDestroy() {
        this.mealsPerWeekSubscription.unsubscribe();
    }

    initialiseMealSlot(mealSlot: number) {

        this.mealSlot = mealSlot;

        if (this.allSelectedMealPlans.length <= 0) {
            this.createNewMealPlanSlot(mealSlot);
            this.addSlotToSelectedMealPlans(this.mealPlanSelection);
        }
        else {

        }

    }

    createNewMealPlanSlot(mealSlot: number) {
        this.mealPlanSelection = {
            recipeID: 1,
            reviewed: false,
            mealSlot: mealSlot
        }
    }

    addSlotToSelectedMealPlans(mealPlan) {
        this.allSelectedMealPlans.push(mealPlan);
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
