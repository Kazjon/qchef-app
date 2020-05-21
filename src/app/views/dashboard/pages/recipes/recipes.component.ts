import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { Subscription } from 'rxjs';
import { MealSlot } from 'src/app/core/objects/MealSlot';

@Component({
    selector: 'app-recipes',
    templateUrl: './recipes.component.html',
    styleUrls: ['./recipes.component.scss'],
})
export class RecipesPage implements OnInit {
    mealSlotsSubscription: Subscription;
    mealSlots: MealSlot[];

    constructor(private dataService: DataService) { }

    ngOnInit() {

        this.mealSlotsSubscription = this.dataService.mealSlotsObservable.subscribe((res) => {
            this.checkData(res);
        });

    }

    checkData(data) {
        if (data.length <= 0) {
            this.dataService.getMealSlotsFromLocal();
        }
        else {
            this.mealSlots = data;
        }
    }

    ngOnDestroy() {
        this.mealSlotsSubscription.unsubscribe();
    }

}
