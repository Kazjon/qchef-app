import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { MealPreference } from '../../core/objects/MealPreference';
import { IngredientPreference } from 'src/app/core/objects/IngredientPreference';
import { MealPlanSelectionResponse } from 'src/app/core/objects/MealPlanSelectionResponse';
import { MealsPerWeekResponse } from 'src/app/core/objects/MealsPerWeekResponse';
import { MealSlot } from 'src/app/core/objects/MealSlot';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    mealsPerWeek = new BehaviorSubject<MealsPerWeekResponse>({ mealsPerWeek: 3 });
    mealsPerWeekObservable = this.mealsPerWeek.asObservable();

    recommendedMeals = new BehaviorSubject<MealPreference[]>([]);
    recommendedMealsObservable = this.recommendedMeals.asObservable();

    mealSlots = new BehaviorSubject<MealSlot[]>([]);
    mealSlotsObservable = this.mealSlots.asObservable();

    constructor(private http: HttpClient) { }

    getMealsFromServer(): Observable<MealPreference[]> {
        return this.http.get<MealPreference[]>('assets/data/mealpreferences.json');
    }

    getIngredientsFromServer(): Observable<IngredientPreference[]> {
        return this.http.get<IngredientPreference[]>('assets/data/ingredientpreferences.json');
    }

    getRecommendedMealsFromServer(): Observable<MealPreference[]> {
        return this.http.get<MealPreference[]>('assets/data/mealpreferences.json');
    }

    getRecommendedMealsFromLocal() {

        let recommendedMeals: MealPreference[];
        let localRecommendedMealsString = localStorage.getItem("localRecommendedMeals");

        if (localRecommendedMealsString != undefined) {
            recommendedMeals = JSON.parse(localRecommendedMealsString);
        }
        else {
            recommendedMeals = [];
        }

        this.setRecommendedMeals(recommendedMeals);

    }

    getMealSlotsFromLocal() {


        let mealSlots: MealSlot[];
        let localMealSlotsString = localStorage.getItem("localMealSlots");

        if (localMealSlotsString != undefined) {
            mealSlots = JSON.parse(localMealSlotsString);
        }
        else {
            mealSlots = [];
        }

        this.setMealSlots(mealSlots);

    }

    saveRecommendedMealsToLocal(recommendedMeals: MealPreference[]) {
        let recommendedMealsString = JSON.stringify(recommendedMeals);
        localStorage.setItem("localRecommendedMeals", recommendedMealsString);
    }

    saveMealSlotsToLocal(mealSlots: MealSlot[]) {
        let mealSlotsString = JSON.stringify(mealSlots);
        localStorage.setItem("localMealSlots", mealSlotsString);
    }

    getMealsPerWeekFromLocal() {

        let mealsPerWeek: MealsPerWeekResponse;
        let localMealsPerWeekString = localStorage.getItem("localMealsPerWeek");

        if (localMealsPerWeekString != undefined) {
            mealsPerWeek = JSON.parse(localMealsPerWeekString);
        }
        else {
            mealsPerWeek = { mealsPerWeek: 3 };
        }

        this.setMealsPerWeek(mealsPerWeek);

    }

    setMealsPerWeek(meals: MealsPerWeekResponse) {
        this.mealsPerWeek.next(meals);
    }

    setRecommendedMeals(recommendedMeals: MealPreference[]) {
        this.saveRecommendedMealsToLocal(recommendedMeals);
        this.recommendedMeals.next(recommendedMeals);
    }

    setMealSlots(mealSlots: MealSlot[]) {
        this.saveMealSlotsToLocal(mealSlots);
        this.mealSlots.next(mealSlots);
    }
}
