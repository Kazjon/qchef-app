import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { MealPreference } from '../../core/objects/MealPreference';
import { IngredientPreference } from 'src/app/core/objects/IngredientPreference';
import { MealPlanSelectionResponse } from 'src/app/core/objects/MealPlanSelectionResponse';
import { MealsPerWeekResponse } from 'src/app/core/objects/MealsPerWeekResponse';
import { ProgressStage } from 'src/app/core/objects/ProgressStage';
import { MealSlot } from 'src/app/core/objects/MealSlot';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private totalStages:number = 53;

    mealsPerWeek = new BehaviorSubject<MealsPerWeekResponse>({ mealsPerWeek: 3 });
    mealsPerWeekObservable = this.mealsPerWeek.asObservable();

    private preferenceProgress = new BehaviorSubject<ProgressStage>({ stage: 0 });
    preferenceProgressObservable = this.preferenceProgress.asObservable();

    recommendedMeals = new BehaviorSubject<MealPreference[]>([]);
    recommendedMealsObservable = this.recommendedMeals.asObservable();

    mealSlots = new BehaviorSubject<MealSlot[]>([]);
    mealSlotsObservable = this.mealSlots.asObservable();

    weekStartDate = new BehaviorSubject<Date>(undefined);
    weekStartDateObservable = this.weekStartDate.asObservable();

    constructor(private http: HttpClient) { }

    getMealsFromServer(): Observable<MealPreference[]> {
        return this.http.get<MealPreference[]>('assets/data/mealpreferences.json');
    }

    getIngredientsFromServer(): Observable<IngredientPreference[]> {
        return this.http.get<IngredientPreference[]>('assets/data/ingredientpreferences.json');
       //return this.http.get<IngredientPreference[]>('https://q-chef-test-back-end.herokuapp.com/onboarding_ingredient_rating');
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

    getWeekStartDateFromLocal() {

        let date: Date;
        let localWeekStartDateString = localStorage.getItem("localWeekStartDate");

        if (localWeekStartDateString != undefined) {
            date = new Date(localWeekStartDateString);
        }
        else {
            date = undefined;
        }

        this.setWeekStartDate(date);

    }

    getProgressStage() {
        let progressStage: ProgressStage;
        progressStage = {stage: ++this.preferenceProgress.value.stage};

        this.setProgressStage(progressStage);

        let progressPercentage = (Math.round((progressStage.stage/this.totalStages) * 100) / 100).toFixed(2);
        console.log(progressPercentage)
        return progressPercentage
    }

    getProgressMark(markLabel: string) {
        let mark:number;
        switch(markLabel) {
            case "intro": mark = 1; break;
            case "mealPreference": mark = 31; break;
            case "ingredientPreference": mark = 51; break;
        }
        this.setProgressStage({ stage: mark })

        return (Math.round((mark/this.totalStages) * 100) / 100).toFixed(2);
    }

    saveRecommendedMealsToLocal(recommendedMeals: MealPreference[]) {
        let recommendedMealsString = JSON.stringify(recommendedMeals);
        localStorage.setItem("localRecommendedMeals", recommendedMealsString);
    }

    saveMealSlotsToLocal(mealSlots: MealSlot[]) {
        let mealSlotsString = JSON.stringify(mealSlots);
        localStorage.setItem("localMealSlots", mealSlotsString);
    }

    saveWeekStartDateToLocal(date: Date) {
        let dateString = undefined;
        if (date != undefined) {
            dateString = date.toDateString();
        }
        localStorage.setItem("localWeekStartDate", dateString);
    }

    setMealsPerWeek(meals: MealsPerWeekResponse) {
        this.mealsPerWeek.next(meals);
    }

    setProgressStage(progressStage: ProgressStage){
        this.preferenceProgress.next(progressStage);
    }

    setRecommendedMeals(recommendedMeals: MealPreference[]) {
        this.saveRecommendedMealsToLocal(recommendedMeals);
        this.recommendedMeals.next(recommendedMeals);
    }

    setMealSlots(mealSlots: MealSlot[]) {
        this.saveMealSlotsToLocal(mealSlots);
        this.mealSlots.next(mealSlots);
    }

    setWeekStartDate(date: Date) {
        this.saveWeekStartDateToLocal(date);
        this.weekStartDate.next(date);
    }
}
