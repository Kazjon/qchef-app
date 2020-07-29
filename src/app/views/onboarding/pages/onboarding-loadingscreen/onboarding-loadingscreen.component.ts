import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { Subscription } from 'rxjs';
import { MealsPerWeekResponse } from 'src/app/core/objects/MealsPerWeekResponse';
import { MealSlot } from 'src/app/core/objects/MealSlot';
import { DataHandlingService } from 'src/app/services/datahandling/datahandling.service';
import { MealPreference } from 'src/app/core/objects/MealPreference';

@Component({
    selector: 'app-onboarding-loadingscreen',
    templateUrl: './onboarding-loadingscreen.component.html',
    styleUrls: ['./onboarding-loadingscreen.component.scss'],
})
export class OnboardingLoadingScreenComponent implements OnInit {
    mealsPerWeekSubscription: Subscription;
    mealsPerWeek: MealsPerWeekResponse;
    mealSlots: MealSlot[] = [];
    imgSrc: string;

    constructor(private router: Router, private dataService: DataService, private dataHandlingService: DataHandlingService) {
        this.imgSrc = "../../../assets/images/splash.svg";
    }

    ngOnInit() {
        this.goToMealSelection();
    }

    ionViewWillEnter() {
        console.log('loading');
    }

    private createMealSlots() {

        for (let i = 0; i < this.mealsPerWeek.number_of_recipes; i++) {
            let mealSlot: MealSlot = {
                id: (i + 1),
                selected: false,
                active: false,
                reviewed: false
            }
            this.mealSlots.push(mealSlot);
        }

        this.dataService.setMealSlots(this.mealSlots);

        this.goToMealSelection();

    }

    private goToMealSelection() {
        let arbitraryTimeout = setTimeout(() => {
            this.router.navigateByUrl("/onboarding/surprisepreferences");
            clearTimeout(arbitraryTimeout);
        }, 2000);
    }

    ngOnDestroy() {
        this.mealsPerWeekSubscription.unsubscribe();
    }

}
