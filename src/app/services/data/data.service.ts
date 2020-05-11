import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { MealPreference } from '../../core/objects/MealPreference';
import { IngredientPreference } from 'src/app/core/objects/IngredientPreference';
import { MealPlanSelection } from 'src/app/core/objects/MealPlanSelection';
import { MealsPerWeekResponse } from 'src/app/core/objects/MealsPerWeekResponse';
import { ProgressStage } from 'src/app/core/objects/ProgressStage';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private totalStages:number = 53;

    private mealsPerWeek = new BehaviorSubject<MealsPerWeekResponse>({ mealsPerWeek: 3 });
    mealsPerWeekObservable = this.mealsPerWeek.asObservable();

    private preferenceProgress = new BehaviorSubject<ProgressStage>({ stage: 0 });
    preferenceProgressObservable = this.preferenceProgress.asObservable();

    constructor(private http: HttpClient) { }

    getMealsFromServer(): Observable<MealPreference[]> {
        return this.http.get<MealPreference[]>('assets/data/mealpreferences.json');
    }

    getIngredientsFromServer(): Observable<IngredientPreference[]> {
        return this.http.get<IngredientPreference[]>('assets/data/ingredientpreferences.json');
    }

    getMealPlansFromLocal() {

        let mealPlans: MealPlanSelection[];
        let localMealPlansString = localStorage.getItem("localMealPlans");

        if (localMealPlansString != undefined) {
            mealPlans = JSON.parse(localMealPlansString);
        }
        else {
            mealPlans = [];
        }

        return mealPlans;

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

    getProgressStage() {
        let progressStage: ProgressStage;
        progressStage = {stage: ++this.preferenceProgress.value.stage};

        this.setProgressStage(progressStage);

        let progressPercentage = (Math.round((progressStage.stage/this.totalStages) * 100) / 100).toFixed(2);
        console.log(progressPercentage)
        return progressPercentage
    }

    setProgressStage(progressStage: ProgressStage){
        this.preferenceProgress.next(progressStage);
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
}
