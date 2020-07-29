import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { MealPreference } from '../../core/objects/MealPreference';
import { IngredientPreference } from 'src/app/core/objects/IngredientPreference';
import { MealPlanSelectionResponse } from 'src/app/core/objects/MealPlanSelectionResponse';
import { MealsPerWeekResponse } from 'src/app/core/objects/MealsPerWeekResponse';
import { ProgressStage } from 'src/app/core/objects/ProgressStage';
import { MealSlot } from 'src/app/core/objects/MealSlot';
import { MealPreferenceResponse } from 'src/app/core/objects/MealPreferenceResponse';
import { IngredientPreferenceResponse } from 'src/app/core/objects/IngredientPreferenceResponse';
import { DataHandlingService } from '../datahandling/datahandling.service';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private totalStages:number = 94;
    private baseURL:string = "https://q-chef-backend-api-server.web.app";
    httpOptions = {};

    mealsPerWeek = new BehaviorSubject<MealsPerWeekResponse>({ userID: "", number_of_recipes: 3 });
    mealsPerWeekObservable = this.mealsPerWeek.asObservable();

    private preferenceProgress = new BehaviorSubject<ProgressStage>({ stage: 0 });
    preferenceProgressObservable = this.preferenceProgress.asObservable();

    recommendedMeals = new BehaviorSubject<MealPreference[]>([]);
    recommendedMealsObservable = this.recommendedMeals.asObservable();

    mealSlots = new BehaviorSubject<MealSlot[]>([]);
    mealSlotsObservable = this.mealSlots.asObservable();

    weekStartDate = new BehaviorSubject<Date>(undefined);
    weekStartDateObservable = this.weekStartDate.asObservable();

    constructor(private http: HttpClient, private dataHandlingService: DataHandlingService) { }

    initAuthToken(idToken) {

        console.log(idToken);

        this.httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'Bearer ' + idToken
            })
        };
    }

    getMealsFromServer(): Observable<MealPreference[]> {
        console.log((this.httpOptions as any).headers);
        //return this.http.get<MealPreference[]>('assets/data/mealpreferences.json');
        return this.http.get<MealPreference[]>(this.baseURL + '/onboarding_recipe_rating', this.httpOptions);
    }

    getIngredientsFromServer(): Observable<IngredientPreference[]> {
        //return this.http.get<IngredientPreference[]>('assets/data/ingredientpreferences.json');
        return this.http.get<IngredientPreference[]>(this.baseURL + '/onboarding_ingredient_rating', this.httpOptions);
    }

    getMealPlanSelectionFromServer(numberOfMeals: MealsPerWeekResponse): Observable<MealPreference[]> {
        //return this.http.get<MealPreference[]>('assets/data/mealpreferences.json');
        return this.http.post<MealPreference[]>(this.baseURL + '/get_meal_plan_selection', numberOfMeals, this.httpOptions);
    }

    getMealPlanFromServer(): Observable<Object> {
        let userID = { userID: "9999" }
        return this.http.post<Object>(this.baseURL + '/get_meal_plan_selection', userID, this.httpOptions);
    }

    postMealRatingsToServer(mealPreferenceResponse: MealPreferenceResponse): Observable<MealPreferenceResponse> {
        return this.http.post<MealPreferenceResponse>(this.baseURL + '/onboarding_recipe_rating', mealPreferenceResponse, this.httpOptions);
    }

    postIngredientRatingsToServer(ingredientPreferenceResponse: IngredientPreferenceResponse): Observable<IngredientPreferenceResponse> {
        return this.http.post<IngredientPreferenceResponse>(this.baseURL + '/onboarding_ingredient_rating', ingredientPreferenceResponse, this.httpOptions);
    }

    postMealPlanSelectionToServer(mealPlanSelectionResponse: MealPlanSelectionResponse): Observable<MealPlanSelectionResponse> {
        return this.http.post<MealPlanSelectionResponse>(this.baseURL + '/save_meal_plan', mealPlanSelectionResponse, this.httpOptions)
    }

    postSurpriseMealRatingsToServer(mealPreferenceResponse: MealPreferenceResponse): Observable<MealPreferenceResponse> {
        return this.http.post<MealPreferenceResponse>(this.baseURL + '/validation_recipe_rating', mealPreferenceResponse, this.httpOptions);
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

        if (localMealSlotsString != undefined && localMealSlotsString != "undefined") {
            mealSlots = JSON.parse(localMealSlotsString);
            this.setMealSlots(mealSlots);
        }
        else {
            this.getMealPlanFromServer().subscribe((res) => {
                this.dataHandlingService.handleMealSlotData(res)
                    .then((organisedData: MealSlot[]) => {
                        mealSlots = organisedData;
                        this.setMealSlots(mealSlots);
                    });
            });
        }

    }

    getMealsPerWeekFromLocal() {

        let mealsPerWeek: MealsPerWeekResponse;
        let localMealsPerWeekString = localStorage.getItem("localMealsPerWeek");

        if (localMealsPerWeekString != undefined) {
            mealsPerWeek = JSON.parse(localMealsPerWeekString);
        }
        else {
            mealsPerWeek = { userID: "", number_of_recipes: 3 };
        }

        this.setMealsPerWeek(mealsPerWeek);

    }

    getSurprisePreferencesFromLocal() {

        let surprisePreferences: MealPreference[];
        let localSurprisePreferencesString = localStorage.getItem("localSurprisePreferences");

        if (localSurprisePreferencesString != undefined) {
            surprisePreferences = JSON.parse(localSurprisePreferencesString);
        }
        else {
            surprisePreferences = [];
        }

        return surprisePreferences;
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
        let progressPercentage = (Math.round((progressStage.stage/this.totalStages) * 10000) / 100).toFixed(0);
        return progressPercentage;
    }

    getProgressMark(markLabel: string) {
        let mark:number;
        switch(markLabel) {
            case "intro": mark = 1; break;
            case "mealPreference": mark = 31; break;
            case "ingredientPreference": mark = 61; break;
            case "surprisePreference": mark = 91; break;
        }
        this.setProgressStage({ stage: mark })

        return (Math.round((mark/this.totalStages) * 10000) / 100).toFixed(2);
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
        console.log("set meal slots");
        this.saveMealSlotsToLocal(mealSlots);
        this.mealSlots.next(mealSlots);
    }

    setWeekStartDate(date: Date) {
        this.saveWeekStartDateToLocal(date);
        this.weekStartDate.next(date);
    }

    getNotReviewedMealNum() {
        let mealSlots: MealSlot[];
        let notReviewed: number = 0;
        let localMealSlotsString = localStorage.getItem("localMealSlots");

        if (localMealSlotsString != undefined) {
            mealSlots = JSON.parse(localMealSlotsString);
        }
        else {
            mealSlots = [];
        }

        mealSlots.forEach(element => {
            if (element.reviewed == false) {
                notReviewed++;
            }
        });
        return notReviewed
    }

    saveSurprisePreferencesToLocal(surprisePreferences: MealPreference[]) {
        let surprisePreferencesString = JSON.stringify(surprisePreferences);
        localStorage.setItem("localSurprisePreferences", surprisePreferencesString);
    }
}
