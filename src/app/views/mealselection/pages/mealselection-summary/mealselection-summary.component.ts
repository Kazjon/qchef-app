import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { MealSlot } from 'src/app/core/objects/MealSlot';
import { Router } from '@angular/router';
import { MealPlanSelectionResponse } from 'src/app/core/objects/MealPlanSelectionResponse';

@Component({
    selector: 'app-mealselection-summary',
    templateUrl: './mealselection-summary.component.html',
    styleUrls: ['./mealselection-summary.component.scss'],
})
export class MealSelectionSummaryComponent implements OnInit {
    mealSlots: MealSlot[];

    constructor(private dataService: DataService, private router: Router) { }

    ngOnInit() {

        combineLatest(
            this.dataService.mealSlotsObservable,
        ).pipe(
            take(4)
        )
        .subscribe(([mealSlots]) => {
            console.log(mealSlots);
            this.checkData(mealSlots);
        });


    }

    private checkData(mealSlots: MealSlot[]) {

        if (mealSlots.length <= 0) {
            this.dataService.getMealSlotsFromLocal();
        }
        else {
            this.initialiseMealSlots(mealSlots);
        }

    }

    private initialiseMealSlots(mealSlots: MealSlot[]) {
        this.mealSlots = mealSlots;
        console.log(this.mealSlots);
    }

    changeMeal(mealSlot: MealSlot) {
        this.router.navigateByUrl('/mealselection/meal/' + mealSlot.id + '/change');
    }

    setWeekStartDate() {
        let todayDate = new Date();
        this.dataService.setWeekStartDate(todayDate);
        this.saveMealSelection();
    }

    private saveMealSelection() {

        let picked: string[] = [];

        for (let i = 0; i < this.mealSlots.length; i++) {
            picked.push(this.mealSlots[i].recipe.id);
        }

        let uid = localStorage.getItem("userID");

        let selectedMealPlan: MealPlanSelectionResponse = {
            userID: uid,
            picked: picked
        }

        // TODO: Have a loading spinner here to show that something's happening
        this.dataService.postMealPlanSelectionToServer(selectedMealPlan)
            .subscribe((res) => {
                console.log(res);
                this.goToNext();
            });

    }

    private goToNext() {
        this.router.navigateByUrl('dashboard', { replaceUrl: true });
    }

}
