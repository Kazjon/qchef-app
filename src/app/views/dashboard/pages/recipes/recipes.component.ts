import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { MealSlot } from 'src/app/core/objects/MealSlot';
import { MealPreference } from 'src/app/core/objects/MealPreference';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { RecipeModalComponent } from 'src/app/core/components/recipemodal/recipemodal.component';

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
        private router: Router,
        private modalController: ModalController) { }

    ngOnInit() {

        this.dataService.getMealSlotsFromLocal();
        this.dataService.getWeekStartDateFromLocal();

        combineLatest(
            this.dataService.mealSlotsObservable,
            this.dataService.weekStartDateObservable
        ).pipe(
            take(2)
        )
        .subscribe(([mealSlots, weekStartDate]) => {
            this.checkData(mealSlots);
            this.checkIfWeekIsComplete(weekStartDate);
        });


    }

    private checkData(data) {
        if (data.length <= 0 || data[0].recipe == undefined) {
           this.router.navigateByUrl('mealselection/meal/1', { replaceUrl: true });
        }
        else {
            this.mealSlots = data;
        }
    }

    private checkIfWeekIsComplete(weekStartDate: Date) {
        let todayDate = new Date();
        let daysBetweenDates = this.getDaysBetweenDates(weekStartDate, todayDate);

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
