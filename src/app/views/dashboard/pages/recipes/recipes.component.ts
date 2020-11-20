import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { MealSlot } from 'src/app/core/objects/MealSlot';
import { MealPreference } from 'src/app/core/objects/MealPreference';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { RecipeModalComponent } from 'src/app/core/components/recipemodal/recipemodal.component';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

@Component({
    selector: 'app-recipes',
    templateUrl: './recipes.component.html',
    styleUrls: ['./recipes.component.scss'],
})
export class RecipesPage implements OnInit {
    mealSlots: MealSlot[];
    isLoading: boolean = true;
    isNewWeek: boolean = false;

    constructor(
        private dataService: DataService,
        private firebaseService: FirebaseService,
        private router: Router,
        private modalController: ModalController) { }

    ngOnInit() {

        this.dataService.setOnboardingStage("dashboard");

        this.dataService.getMealSlotsFromLocal();
        this.dataService.getWeekStartDateFromLocal();

        combineLatest(
            this.dataService.mealSlotsObservable,
            this.dataService.weekStartDateObservable
        ).pipe(
            take(3)
        )
        .subscribe(([mealSlots, weekStartDate]) => {
            console.log(mealSlots);
            console.log(weekStartDate);
            this.checkData(mealSlots, weekStartDate);
            this.checkIfWeekIsComplete(weekStartDate);
        });


    }

    private checkData(data, weekStartDate) {
        if (weekStartDate == undefined || isNaN(weekStartDate.getTime()) && data.length <= 0) {
            this.firebaseService.logout()
                .then(() => {
                    this.router.navigateByUrl('splash');
                })
        }
        else if (data.length <= 0 || data[0].recipe == undefined) {
           this.router.navigateByUrl('mealselection/summary', { replaceUrl: true });
        }
        else {
            this.mealSlots = data;
        }
    }

    private checkIfWeekIsComplete(weekStartDate: Date) {
        console.log(weekStartDate);
        let startDate = weekStartDate;

        if (isNaN(weekStartDate.getTime())) {
            startDate = new Date();
        }

        let todayDate = new Date();

        let daysBetweenDates = this.getDaysBetweenDates(startDate, todayDate);

        if (daysBetweenDates >= 7) {
            this.isNewWeek = true;
            this.isLoading = false;
        }
        else {
            this.isNewWeek = false;
            this.isLoading = false;
        }

    }

    private getDaysBetweenDates(dateOne: Date, dateTwo: Date) {
        let differenceInTime = dateTwo.getTime() - dateOne.getTime();
        let differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return differenceInDays;
    }

    startWeeklyFlow() {
        this.dataService.setMealSlots([]);
        this.dataService.setWeekStartDate(undefined);
        this.router.navigateByUrl('onboarding/numberofmeals', { replaceUrl: true });
    }

    async openRecipe(recipe: MealPreference) {

        const modal = await this.modalController.create({
            component: RecipeModalComponent,
            cssClass: 'recipe-modal',
            componentProps: {
                'recipe': recipe,
                'showReview': true
            }
        });
        return await modal.present();

    }

}
