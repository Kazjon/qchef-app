import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { combineLatest, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MealsPerWeekResponse } from 'src/app/core/objects/MealsPerWeekResponse';
import { MealPreference } from 'src/app/core/objects/MealPreference';
import { ModalController, IonSlides } from '@ionic/angular';
import { RecipeModalComponent } from '../../../../core/components/recipemodal/recipemodal.component';
import { MealSlot } from 'src/app/core/objects/MealSlot';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { DataHandlingService } from 'src/app/services/datahandling/datahandling.service';

@Component({
    selector: 'app-mealselection-selectmeal',
    templateUrl: './mealselection-selectmeal.component.html',
    styleUrls: ['./mealselection-selectmeal.component.scss'],
})
export class MealSelectionSelectMealComponent implements OnInit {
    @ViewChild('mealSlides', { static: false }) mealSlides: IonSlides;
    isLoading: boolean = true;
    currentMealSlot: MealSlot;
    mealsPerWeek: MealsPerWeekResponse;
    mealOptions: MealPreference[];
    mealSlots: MealSlot[];
    canContinue: boolean = false;
    paramMealSlot: number;
    visibleMealOptions: MealPreference[] = [];
    changeMeal: boolean = false;
    selected: boolean = false;
    mealsPerWeekSubscription: Subscription;
    mealSlotsSubscription: Subscription;
    recommendedMealsSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private firebaseService: FirebaseService,
        private dataService: DataService,
        public modalController: ModalController,
        private router: Router,
        private dataHandlingService: DataHandlingService) { }

    ngOnInit() {

        this.route.paramMap.subscribe(params => {
            this.paramMealSlot = parseInt(params.get('mealslot'));

            if (this.router.url.includes('/change')) {
                this.changeMeal = true;
            }

        });

        this.getData();

    }

    private getData() {
        /*combineLatest(
            this.dataService.mealsPerWeekObservable,
            this.dataService.mealSlotsObservable,
            this.dataService.recommendedMealsObservable
        ).pipe(
            take(4)
        )
        .subscribe(([mealsPerWeek, mealSlots, recommendedMeals]) => {
            this.checkData(mealsPerWeek, mealSlots, recommendedMeals);
        });*/

        this.mealsPerWeekSubscription = this.dataService.mealsPerWeekObservable.subscribe((res) => {
            if (res.userID == undefined) {
                let mealsPerWeekLocal = this.dataService.getMealsPerWeekFromLocal();
                if (mealsPerWeekLocal == null || mealsPerWeekLocal == undefined) {
                    this.router.navigateByUrl('onboarding/numberofmeals', { replaceUrl: true });
                }
                else {
                    this.mealsPerWeek = mealsPerWeekLocal;
                }
            }
            else {
                this.mealsPerWeek = res;
            }

        });

        this.mealSlotsSubscription = this.dataService.mealSlotsObservable.subscribe((res) => {

            if (res.length <= 0) {
                this.dataService.getMealSlotsFromLocal();
            }
            else {
                this.mealSlots = res;
            }


        });

        this.recommendedMealsSubscription = this.dataService.recommendedMealsObservable.subscribe((res) => {

            if (res.length <= 0) {
                let areThereMeals = this.dataService.getRecommendedMealsFromLocal();

                if (!areThereMeals) {
                    this.router.navigateByUrl('onboarding/numberofmeals', { replaceUrl: true });
                }
            }
            else {
                this.initialiseData(this.mealsPerWeek, this.mealSlots, res);
            }

        });

    }

    ionViewWillEnter() {
        //this.getData();
    }

    imageLoaded(meal: MealPreference) {
        meal.loaded = true;
    }

    private checkData(mealsPerWeek, mealSlots, recommendedMeals) {
        if (mealSlots.length <= 0) {
            this.dataService.getMealSlotsFromLocal();
        }
        else if (recommendedMeals.length <= 0) {
            //this.dataService.getRecommendedMealsFromLocal(mealsPerWeek);
            this.dataService.getMealPlanSelectionFromServer(mealsPerWeek).subscribe((res) => {
                this.dataHandlingService.handleMealPreferenceData(res)
                    .then((organisedData: MealPreference[]) => {
                        this.dataService.setRecommendedMeals(organisedData);
                    });
            },
            (error) => {
                console.log(error);
            });
        }
        else {
            this.initialiseData(mealsPerWeek, mealSlots, recommendedMeals);
        }
    }

    private initialiseData(mealsPerWeek, mealSlots, recommendedMeals) {
        this.mealsPerWeek = mealsPerWeek;
        this.mealSlots = mealSlots;
        this.mealOptions = recommendedMeals;

        if (this.mealOptions.length <= 0) {
            this.firebaseService.logout()
                .then(() => {
                    this.router.navigateByUrl('splash');
                })
        }
        else {
            this.setCurrentMealSlot();
            this.organiseMealOptions();
            this.isLoading = false;
        }

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
                console.log("match!");
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

        this.selected = true;

        this.currentMealSlot.selected = true;
        this.currentMealSlot.recipe = this.visibleMealOptions[mealIndex];

        this.dataService.logAction(this.visibleMealOptions[mealIndex].id, "selected");

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

        console.log("open recipe");
        this.dataService.logAction(recipe.id, "opened");

        const modal = await this.modalController.create({
            component: RecipeModalComponent,
            cssClass: 'recipe-modal',
            componentProps: {
                'recipe': recipe,
                'showReview': false
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

    slideChanged() {
        this.mealSlides.getActiveIndex()
            .then((index) => {
                let currentRecipe = this.visibleMealOptions[index];
                console.log("slide changed");
                this.dataService.logAction(currentRecipe.id, "viewed");
            });
    }

}

/*Timestamp and recipeID whenever the user views a recipe page (including closing the recipe details page)
Timestamp and recipeID whenever they select a meal
Timestamp and recipeID whenever they open the “details” panel with the ingredients and method for a particular recipe*/