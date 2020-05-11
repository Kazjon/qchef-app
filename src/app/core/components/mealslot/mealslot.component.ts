import { Component, OnInit, Input } from '@angular/core';
import { MealSlot } from '../../objects/MealSlot';

@Component({
    selector: 'meal-slot',
    templateUrl: './mealslot.component.html',
    styleUrls: ['./mealslot.component.scss'],
})
export class MealSlotComponent implements OnInit {
    @Input() mealSlot: MealSlot;

    constructor() { }

    ngOnInit() {
        console.log(this.mealSlot);
    }

}
