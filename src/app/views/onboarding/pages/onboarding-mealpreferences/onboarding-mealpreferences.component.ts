import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { DataService } from '../../../../services/data/data.service';
import { mealPreferenceQuestions } from '../../../../../assets/data/mealpreferencequestions';
import { MealPreference } from '../../../../core/objects/MealPreference';
import { MealPreferenceQuestion } from '../../../../core/objects/MealPreferenceQuestion';
import { MealPreferenceResponse } from 'src/app/core/objects/MealPreferenceResponse';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-onboarding-mealpreferences',
    templateUrl: './onboarding-mealpreferences.component.html',
    styleUrls: ['./onboarding-mealpreferences.component.scss'],
})
export class OnboardingMealPreferencesComponent implements OnInit {
    @ViewChild('mealSlides', { static: false }) mealSlides: IonSlides;
    @Input() progressValue: any;
    @Input() imgSrc: string;
    @Input() ableToBack: boolean = false;
    @Input() isSelected: boolean = false;
    mealPreferenceOptions: MealPreference[];
    preferenceQuestions: MealPreferenceQuestion[] = mealPreferenceQuestions;
    mealPreferenceResponses: MealPreferenceResponse[] = [];
    currentMealIndex: number = 0;
    currentQuestionIndex: number = 0;
    constructor(private dataService: DataService, private router: Router) { }

    ngOnInit() {
        this.imgSrc = "../../../assets/images/icon-ingredient.svg"

        this.dataService.getMealsFromServer()
            .subscribe((res) => {
                this.mealPreferenceOptions = res;
                this.addMealPreferenceQuestionsToMeals();
            });
        this.progressValue = this.dataService.getProgressStage();
    }

    prevStage() {
        this.progressValue = this.dataService.getProgressMark('intro');
    }

    selectPreference(mealID: number, questionID: number, preference: string, questionIndex: number, mealIndex: number) {

        let preferenceResponse = this.getMealPreferenceResponse(mealID);
        this.isSelected = true;
        if (Object.entries(preferenceResponse).length > 0) {
            preferenceResponse[questionID] = preference;
        }
        else {
            this.addMealPreferenceResponse(mealID, questionID, preference);
        }

        this.showNextQuestion(questionIndex, mealIndex);

    }

    private addMealPreferenceQuestionsToMeals() {
        this.mealPreferenceOptions.forEach((meal) => {
            let questions = JSON.stringify(this.preferenceQuestions);
            meal.questions = JSON.parse(questions);
        });
    }

    private getMealPreferenceResponse(mealID: number) {

        let response = {};

        for (let i = 0; i < this.mealPreferenceResponses.length; i++) {

            if (mealID == this.mealPreferenceResponses[i].recipeID) {
                response = this.mealPreferenceResponses[i];
                break;
            }

        }

        return response;

    }

    private addMealPreferenceResponse(mealID: number, questionID: number, preference: string) {

        let response: MealPreferenceResponse = {
            recipeID: mealID
        };

        response[questionID] = preference;

        this.mealPreferenceResponses.push(response);

    }

    private showNextQuestion(questionIndex: number, mealIndex: number) {

        let next = questionIndex + 1;
        this.currentQuestionIndex = next;
        console.log('this.currentQuestionIndex', this.currentQuestionIndex)

        if (next < this.mealPreferenceOptions[mealIndex].questions.length) {
            this.mealPreferenceOptions[mealIndex].questions[questionIndex].active = false;
            this.mealPreferenceOptions[mealIndex].questions[next].active = true;
            this.ableToBack = true;
        }
        else {
            this.ableToBack = false;
            this.mealSlides.isEnd().then((isEnd) => {
                if (isEnd) {
                    this.goToIngredients();
                }
                else {
                    this.progressValue = this.dataService.getProgressStage();
                    this.mealSlides.slideNext();
                    this.currentMealIndex = mealIndex + 1;
                    console.log('this.currentQuestionIndex', this.currentMealIndex)

                }
            });
        }

    }

    private backToPrevQuestion() {
        let prev = this.currentQuestionIndex - 1;
        if (this.currentQuestionIndex > 0) {
            this.mealPreferenceOptions[this.currentMealIndex].questions[this.currentQuestionIndex].active = false;
            this.mealPreferenceOptions[this.currentMealIndex].questions[prev].active = true;
            this.ableToBack = true;
            if(this.currentQuestionIndex == 1) {
                this.ableToBack = false;
            }
            this.currentQuestionIndex = prev;
        }
    }

    private goToIngredients() {
        this.router.navigateByUrl("/onboarding/ingredientpreferences");
    }

}
