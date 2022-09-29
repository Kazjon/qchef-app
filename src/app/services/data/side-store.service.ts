import { Injectable } from "@angular/core";
import { MealSlot } from "../../core/objects/MealSlot";

/**
 * The "Side-Store" Data Service is a temporary solution to some server data state issues
 * This code and the features it offers should be considered ephemeral.
 * No new features should be added to this; in fact, the data state features offered here should be migrated to the server
 * */
@Injectable({
   providedIn: "root",
})
export class SideStoreDataService {
   mealStatesStorageKey: string = "sidestore_mealstates";
   mealStartStorageKey: string = "sidestore_mealstartdate";

   constructor() {
      this.setupSideStore();
   }

   /**
    * Prepare the data
    * */
   setupSideStore() {
      if (localStorage.getItem(this.mealStatesStorageKey) === null) {
         localStorage.setItem(this.mealStatesStorageKey, "[]");
      }
   }

   /**
    * Saves meals to the side store
    * */
   saveMeals(mealSlots: any) {
      mealSlots.forEach((mealSlot) => {
         const collapsedID = this.getCollapsedID(mealSlot.recipe.id, mealSlot.id);
         this.createMealSlotIfMissing(mealSlot, collapsedID);
      });
   }

   /**
    * Save a meal review
    * */
   saveMealReview(mealSlot: any) {
      const collapsedID = this.getCollapsedID(mealSlot.recipe.id, mealSlot.id);
      const sideStoreMealsArray = this.getSideStoreMealsDataFromStorage();
      sideStoreMealsArray.forEach((meal) => {
         if (meal.collapsed_id == collapsedID) meal.reviewed = true;
      });

      localStorage.setItem(this.mealStatesStorageKey, JSON.stringify(sideStoreMealsArray));
   }

   toggleIngredientCollected(i, mealSlot) {
      const sideStoreMealsArray = this.getSideStoreMealsDataFromStorage();
      const collapsedID = this.getCollapsedID(mealSlot.recipe.id, mealSlot.id);
      const mealState = sideStoreMealsArray.find((mealState) => mealState.collapsed_id == collapsedID);

      if (mealState) {
         mealState.ingredient_checklist[i] = !mealState.ingredient_checklist[i];
         localStorage.setItem(this.mealStatesStorageKey, JSON.stringify(sideStoreMealsArray));
      }

      return sideStoreMealsArray;
   }

   /**
    * Creates a meal slot if missing
    * */
   createMealSlotIfMissing(mealSlot, collapsedID) {
      const sideStoreMealsArray = this.getSideStoreMealsDataFromStorage();
      let existingSideStoreMeal = sideStoreMealsArray.find((meal) => meal.collapsed_id == collapsedID);

      if (!existingSideStoreMeal) {
         sideStoreMealsArray.push({
            collapsed_id: collapsedID,
            reviewed: mealSlot.reviewed,
            ingredient_checklist: mealSlot.recipe.ingredientsFull.map((ing) => false),
         });
         localStorage.setItem(this.mealStatesStorageKey, JSON.stringify(sideStoreMealsArray));
      }
   }

   /**
    * Returns a side stored meal review and checklist
    * */
   getMealSlot(mealDetails: MealSlot, isReviewed: boolean = true): boolean {
      let recipe = mealDetails.recipe;
      if (!recipe) return false;

      let collapsedID = this.getCollapsedID(recipe.id, mealDetails.id);
      const sideStoreMealsArray = this.getSideStoreMealsDataFromStorage();

      const mealReviewExists = sideStoreMealsArray.find((meal) => {
         if (isReviewed) return meal.collapsed_id == collapsedID && meal.reviewed == true;
         else return meal.collapsed_id == collapsedID;
      });

      return mealReviewExists || false;
   }

   /**
    * Retrieves data from storage
    * */
   getSideStoreMealsDataFromStorage() {
      const sideStoreMealsString = localStorage.getItem(this.mealStatesStorageKey);
      const sideStoreMealsArray = JSON.parse(sideStoreMealsString!);
      return sideStoreMealsArray;
   }

   /*checkMealReviewState(mealID: string) {
        const mealStatesString: string | null = localStorage.getItem(this.mealStatesStorageKey) || null;
        let mealStatesArray: any[] = [];
        if (mealStatesString) {
            try {
                mealStatesArray = JSON.parse(mealStatesString);
            } catch(e) {
                return false;
            }
        }
        console.log("Reading", mealStatesArray);

        // Get the meal state from the ID
        let mealState = mealStatesArray.find(mealState => mealState.id == mealID);
        if (mealState) {
            console.log("Found meal state");
            return mealState;
        } else {
            return false;
        }
    }*/

   /**
    * Sets a side store date that isn't deleted on logout
    * */
   setSideStoreMealPlanStartDate() {
      localStorage.setItem(this.mealStartStorageKey, new Date().getTime().toString());
   }

   /**
    * Creates side store "collapsed id" from combined datas
    * */
   getCollapsedID(recipeID: string, weeklyID: number): string {
      const mealStartString = localStorage.getItem(this.mealStartStorageKey);
      return `${recipeID}_${weeklyID.toString()}_${mealStartString}`;
   }

   /**
    * Gets the side store state so that we don't need to constantly read from localStorage
    * Is the responsibility of the requesting component to save back appropriately, as this should
    * be considered ephemeral
    * */
   checkoutSideStoreMealStates() {
      return this.getSideStoreMealsDataFromStorage();
   }

   /**
    * Resets meal states, such as on a new week
    * */
   clearMealStates() {
      localStorage.setItem(this.mealStatesStorageKey, "[]");
   }
}

export interface SideStoreMealSlot {
   collapsed_id: string; // Made from weekly id, recipe id, and weekly start date
   reviewed: boolean;
   ingredient_checklist: boolean[];
}
