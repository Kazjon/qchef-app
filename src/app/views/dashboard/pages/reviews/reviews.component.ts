import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { combineLatest } from "rxjs";
import { take } from "rxjs/operators";
import { DataService } from "src/app/services/data/data.service";
import { MealSlot } from "src/app/core/objects/MealSlot";
import { SideStoreDataService } from "src/app/services/data/side-store.service";

@Component({
   selector: "app-reviews",
   templateUrl: "./reviews.component.html",
   styleUrls: ["./reviews.component.scss"],
})
export class ReviewsPage implements OnInit {
   mealSlots: MealSlot[];

   constructor(private dataService: DataService, private router: Router, private sideStoreService: SideStoreDataService) {}

   ngOnInit() {
      this.getMealsToReview();
   }

   private getMealsToReview() {
      this.dataService.getMealSlotsFromLocal();
      combineLatest(this.dataService.mealSlotsObservable)
         .pipe(take(2))
         .subscribe(([mealSlots]) => {
            this.checkData(mealSlots);
         });
   }

   private checkData(data) {
      if (data.length <= 0 || data[0].recipe == undefined) {
         this.router.navigateByUrl("mealselection/meal/1", { replaceUrl: true });
      } else {
         /** Side store: filter out meals stored in the side store as being reviewed */
         this.sideStoreService.saveMeals(data);
         data = data.filter((meal) => !this.sideStoreService.getMealSlot(meal, true));

         this.mealSlots = data;
      }
   }

   reviewMeal(meal: any) {
      this.router.navigate(["/dashboard/reviews-form/" + meal.id], { state: { data: { title: meal.title } } });
   }

   ionViewWillEnter() {
      console.log("reviews loaded!");
      this.getMealsToReview();
   }
}
