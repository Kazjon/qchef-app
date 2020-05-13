import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { Subscription } from 'rxjs';
import { MealsPerWeekResponse } from 'src/app/core/objects/MealsPerWeekResponse';
import { MealSlot } from 'src/app/core/objects/MealSlot';

@Component({
    selector: 'app-onboarding-complete',
    templateUrl: './onboarding-complete.component.html',
    styleUrls: ['./onboarding-complete.component.scss'],
})
export class OnboardingCompleteComponent implements OnInit {
    mealsPerWeekSubscription: Subscription;
    mealsPerWeek: MealsPerWeekResponse;
    mealSlots: MealSlot[] = [];

    constructor(private router: Router, private dataService: DataService) { }

    ngOnInit() {

        console.log("on init complete");

        // Get how many meals per week the user has selected
        this.mealsPerWeekSubscription = this.dataService.mealsPerWeekObservable.subscribe((res) => {
            this.mealsPerWeek = res;
        });

        // Pull down all recommended meals from the server then create meal slots
        this.dataService.getRecommendedMealsFromServer().subscribe((res) => {
            this.dataService.setRecommendedMeals(res);
            this.createMealSlots();
        });

    }

    private createMealSlots() {

        for (let i = 0; i < this.mealsPerWeek.mealsPerWeek; i++) {
            let mealSlot: MealSlot = {
                id: (i + 1),
                selected: false,
                active: false
            }
            this.mealSlots.push(mealSlot);
        }

        this.dataService.setMealSlots(this.mealSlots);

        this.goToMealSelection();

    }

    private goToMealSelection() {
        let arbitraryTimeout = setTimeout(() => {
            this.router.navigateByUrl("/mealselection/meal/1");
            clearTimeout(arbitraryTimeout);
        }, 2000);
    }

    ngOnDestroy() {
        this.mealsPerWeekSubscription.unsubscribe();
    }

}
