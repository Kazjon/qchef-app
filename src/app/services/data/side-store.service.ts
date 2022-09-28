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

    saveMealReview(mealDetails: any) {
        let localWeekStartDate = localStorage.localWeekStartDate;
        const collapsedID = this.getCollapsedID(
            mealDetails.recipe.id,
            mealDetails.id,
            localWeekStartDate
        );

        const sideStoreMealsArray = this.getSideStoreMealsDataFromStorage();
        let existingSideStoreMeal = sideStoreMealsArray.find(
            (meal) => meal.collapsed_id == collapsedID
        );

        if (existingSideStoreMeal) {
            console.log("We should updating existing Review", mealDetails);
        } else {
            sideStoreMealsArray.push({
                collapsed_id: collapsedID,
                reviewed: mealDetails.reviewed,
                ingredient_checklist: mealDetails.recipe.ingredientsFull.map(
                    (ing) => true
                ),
            });
            localStorage.setItem(
                this.mealStatesStorageKey,
                JSON.stringify(sideStoreMealsArray)
            );
        }
    }

    /**
     * Returns a side stored meal review and checklist
     * */
    getMealSlot(mealDetails: MealSlot, isReviewed: boolean = true) {
        let localWeekStartDate = localStorage.localWeekStartDate;
        let collapsedID = this.getCollapsedID(
            mealDetails.recipe!.id,
            mealDetails.id,
            localWeekStartDate
        );
        const sideStoreMealsArray = this.getSideStoreMealsDataFromStorage();

        const mealReviewExists = sideStoreMealsArray.find((meal) => {
            if (isReviewed)
                return (
                    meal.collapsed_id == collapsedID && meal.reviewed == true
                );
            else return meal.collapsed_id == collapsedID;
        });

        return mealReviewExists || false;
    }

    /**
     * Retrieves data from storage
     * */
    getSideStoreMealsDataFromStorage() {
        const sideStoreMealsString = localStorage.getItem(
            this.mealStatesStorageKey
        );
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
     * Creates side store "collapsed id" from combined datas
     * */
    getCollapsedID(
        recipeID: string,
        weeklyID: number,
        localWeekStartDate: string
    ): string {
        return `${recipeID}_${weeklyID.toString()}_${localWeekStartDate}`;
    }
}

interface SideStoreMealSlot {
    collapsed_id: string; // Made from weekly id, recipe id, and weekly start date
    reviewed: boolean;
    ingredient_checklist: boolean[];
}
