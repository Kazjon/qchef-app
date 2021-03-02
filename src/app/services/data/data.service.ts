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
import { RecipeReviewResponse } from 'src/app/core/objects/RecipeReviewResponse';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private totalStages:number = 94;
    private baseURL:string = "https://q-chef-backend-api-server.web.app";
    httpOptions = {};
    private progressSections = [
        {
            section: "meals",
            progress: 0,
            total: 20,
            count: 0
        },
        {
            section: "ingredients",
            progress: 0,
            total: 30,
            count: 0
        },
        {
            section: "surprise",
            progress: 0,
            total: 10,
            count: 0
        }
    ];

    totalProgress = new BehaviorSubject<Object[]>(this.progressSections);
    totalProgressObservable = this.totalProgress.asObservable();

    mealsPerWeek = new BehaviorSubject<MealsPerWeekResponse>({ userID: undefined, number_of_recipes: 3 });
    mealsPerWeekObservable = this.mealsPerWeek.asObservable();

    private preferenceProgress = new BehaviorSubject<ProgressStage>({ stage: 0 });
    preferenceProgressObservable = this.preferenceProgress.asObservable();

    recommendedMeals = new BehaviorSubject<MealPreference[]>([]);
    recommendedMealsObservable = this.recommendedMeals.asObservable();

    mealSlots = new BehaviorSubject<MealSlot[]>([]);
    mealSlotsObservable = this.mealSlots.asObservable();

    weekStartDate = new BehaviorSubject<Date>(undefined);
    weekStartDateObservable = this.weekStartDate.asObservable();

    totalMealsNotReviewed = new BehaviorSubject<number>(0);
    totalMealsNotReviewedObservable = this.totalMealsNotReviewed.asObservable();

    actionLog = new BehaviorSubject<any>([]);
    actionLogObservable = this.actionLog.asObservable();

    constructor(private http: HttpClient, private dataHandlingService: DataHandlingService) { }

    logAction(recipeID: string, action: string) {

        let log = [];

        let time = new Date();

        log.push(time.getTime());
        log.push(recipeID);
        log.push(action);

        let actionLogUpdate = this.actionLog.getValue();

        actionLogUpdate.push(log);

        this.actionLog.next(actionLogUpdate);

        console.log(this.actionLog.getValue());

    }

    initAuthToken(idToken) {

        console.log("token!");

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
        console.log(numberOfMeals);
        //return this.http.get<MealPreference[]>('assets/data/mealpreferences.json');
        return this.http.post<MealPreference[]>(this.baseURL + '/get_meal_plan_selection', numberOfMeals, this.httpOptions);
    }

    getSelectedMealPlanFromServer(): Observable<MealPreference[]> {
        let uid = localStorage.getItem("userID");
        let userID = { userID: uid }
        return this.http.post<MealPreference[]>(this.baseURL + '/retrieve_meal_plan', userID, this.httpOptions);
    }
    
    /*getMealPlanFromServer(): Observable<Object> {
        //let uid = localStorage.getItem("userID");
        //let userID = { userID: uid }
        return this.http.post<Object>(this.baseURL + '/get_meal_plan_selection', userID, this.httpOptions);
    }*/

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

    postRecipeReviewToServer(recipeReviewResponse: RecipeReviewResponse): Observable<RecipeReviewResponse> {
        // review_recipe
        return this.http.post<RecipeReviewResponse>(this.baseURL + '/review_recipe', recipeReviewResponse, this.httpOptions);
    }

    getRecommendedMealsFromLocal() {

        let recommendedMeals: MealPreference[];
        let localRecommendedMealsString = localStorage.getItem("localRecommendedMeals");

        if (localRecommendedMealsString != undefined) {
            recommendedMeals = JSON.parse(localRecommendedMealsString);
            this.setRecommendedMeals(recommendedMeals);
            return true;
        }
        else {
            return false;
        }

    }


    getMealSlotsFromLocal() {

        let mealSlots: MealSlot[] = [];
        let localMealSlotsString = localStorage.getItem("localMealSlots");

        if (localMealSlotsString != undefined && localMealSlotsString != "undefined") {
            mealSlots = JSON.parse(localMealSlotsString);
            this.setMealSlots(mealSlots);
        }
        else {
            /*this.getMealPlanSelectionFromServer(mealsPerWeek).subscribe((res) => {
                this.dataHandlingService.handleMealSlotData(res)
                    .then((organisedData: MealSlot[]) => {
                        mealSlots = organisedData;
                        this.setMealSlots(mealSlots);
                    });
            },);*/

            this.getSelectedMealPlanFromServer().subscribe((res) => {
                this.dataHandlingService.handleMealSlotData(res)
                    .then((res: MealSlot[]) => {
                        mealSlots = res;
                        if (mealSlots) {
                            this.setMealSlots(mealSlots);
                        } else {
                            for (let i = 0; i < 3; i++) {
                                let mealSlot: MealSlot = {
                                    id: (i + 1),
                                    selected: false,
                                    reviewed: false,
                                    active: false
                                }
                                mealSlots.push(mealSlot);                
                            }
                
                            this.setMealSlots(mealSlots);
                        }
                    });
            },
            (error) => {
                console.log(error);
            });

        }
    }

    /*getMealsPerWeekFromLocal() {

        let mealsPerWeek: MealsPerWeekResponse;
        let localMealsPerWeekString = localStorage.getItem("localMealsPerWeek");

        if (localMealsPerWeekString != undefined) {
            mealsPerWeek = JSON.parse(localMealsPerWeekString);
        }
        else {
            mealsPerWeek = { userID: "", number_of_recipes: 3 };
        }

        this.setMealsPerWeek(mealsPerWeek);

    }*/

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
        this.saveMealsPerWeekToLocal(meals);
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

    setTotalMealsNotReviewed() {
        let total = this.getNotReviewedMealNum();
        this.totalMealsNotReviewed.next(total);
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
        return notReviewed;
    }

    saveMealsPerWeekToLocal(mealsPerWeek: MealsPerWeekResponse) {
        localStorage.setItem("mealsPerWeek", JSON.stringify(mealsPerWeek));
    }

    getMealsPerWeekFromLocal() {
        let mealsPerWeekString = localStorage.getItem("mealsPerWeek");
        let mealsPerWeek = JSON.parse(mealsPerWeekString);
        return mealsPerWeek;
    }

    saveSurprisePreferencesToLocal(surprisePreferences: MealPreference[]) {
        let surprisePreferencesString = JSON.stringify(surprisePreferences);
        localStorage.setItem("localSurprisePreferences", surprisePreferencesString);
    }

    setOnboardingStage(stage: string) {
        localStorage.setItem("onboardingStage", stage);
    }

    getOnboardingStage() {
        let stage = localStorage.getItem("onboardingStage");
        return stage;
    }

    updateTotalProgress(progress: Object[]) {
        this.totalProgress.next(progress);
    }
}
