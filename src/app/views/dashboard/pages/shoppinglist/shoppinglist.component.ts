import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { MealSlot } from 'src/app/core/objects/MealSlot';
import { DataService } from 'src/app/services/data/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shoppinglist',
  templateUrl: './shoppinglist.component.html',
  styleUrls: ['./shoppinglist.component.scss'],
})
export class ShoppingListPage implements OnInit {
  mealSlots: MealSlot[];

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.dataService.getMealSlotsFromLocal();

        combineLatest(
            this.dataService.mealSlotsObservable,
        ).pipe(
            take(2)
        )
        .subscribe(([mealSlots]) => {
            this.checkData(mealSlots);
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

}
