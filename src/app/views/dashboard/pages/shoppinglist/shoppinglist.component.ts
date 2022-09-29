import { Component, OnInit } from "@angular/core";
import { combineLatest } from "rxjs";
import { MealSlot } from "src/app/core/objects/MealSlot";
import { DataService } from "src/app/services/data/data.service";
import { Router } from "@angular/router";
import { SideStoreDataService, SideStoreMealSlot } from "../../../../services/data/side-store.service";

@Component({
   selector: "app-shoppinglist",
   templateUrl: "./shoppinglist.component.html",
   styleUrls: ["./shoppinglist.component.scss"],
})
export class ShoppingListPage implements OnInit {
   mealSlots: MealSlot[];
   sideStoreIngredientStates: SideStoreMealSlot[] = [];

   constructor(private dataService: DataService, private router: Router, private sideStoreService: SideStoreDataService) {}

   ngOnInit() {
      this.dataService.getMealSlotsFromLocal();

      combineLatest(this.dataService.mealSlotsObservable).subscribe(([mealSlots]) => {
         this.checkData(mealSlots);
      });
   }

   private checkData(data) {
      if (data.length <= 0 || data[0].recipe == undefined) {
         this.router.navigateByUrl("mealselection/meal/1", {
            replaceUrl: true,
         });
      } else {
         /** Side store: filter out meals stored in the side store as being reviewed */
         this.sideStoreService.saveMeals(data);
         data = data.filter((meal) => !this.sideStoreService.getMealSlot(meal, true));

         // And finally return the data
         this.mealSlots = data;
      }
   }

   /**
    * Checks the Side Store for ingredients being collected
    * */
   ingredientCollected(index, meal) {
      if (!this.sideStoreIngredientStates.length) {
         this.sideStoreIngredientStates = this.sideStoreService.checkoutSideStoreMealStates();
      }

      const collapsedID = this.sideStoreService.getCollapsedID(meal.recipe.id, meal.id);
      const mealState = this.sideStoreIngredientStates.find((meal) => meal.collapsed_id == collapsedID);
      if (mealState) {
         return mealState.ingredient_checklist[index];
      } else {
         return false;
      }
   }

   toggleIngredientCollected(index, meal) {
      this.sideStoreIngredientStates = this.sideStoreService.toggleIngredientCollected(index, meal);
   }
}
