import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { MealSlot } from 'src/app/core/objects/MealSlot';
import { Router } from '@angular/router';

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

    goToNext() {
        this.router.navigateByUrl('home', { replaceUrl: true });
    }

}
