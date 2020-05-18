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
    @Input() isSelected: boolean = false;
    @Input() page: number = 1;

    mealPreferenceOptions: MealPreference[];
    preferenceQuestions: MealPreferenceQuestion[] = mealPreferenceQuestions;
    mealPreferenceResponses: MealPreferenceResponse[] = [];
    currentMealIndex: number = 0;
    currentQuestionIndex: number;
    currentMealID: number;
    currentQuestionID: number;
    currentPreference: string;
    currentMeal: any;
    currentQuestion: any;
    currentOptionIndex: number;

    percentage: any;

    constructor(private dataService: DataService, private router: Router) { }

    ngOnInit() {
        this.imgSrc = "../../../assets/images/icon-ingredient.svg"

        this.dataService.getMealsFromServer()
            .subscribe((res) => {
                this.mealPreferenceOptions = res;
                this.addMealPreferenceQuestionsToMeals();
            });
        this.progressValue = this.dataService.getProgressStage();
        this.percentage = (this.progressValue * 100).toFixed(0);

    }

    ionViewWillEnter() {

    }

    findCurrentMeal(id: number) {
        return this.mealPreferenceOptions.find((element: any) => element.id == id )
    }

    findCurrentQuestion() {
        return this.currentMeal.questions.find((element: any) => element.active == true)
    }

    onSlideChange() {
        this.mealSlides.getActiveIndex().then((index)=> {
            this.page = index + 1;
            this.currentMealIndex = index;
            this.currentMealID = this.mealPreferenceOptions[this.currentMealIndex].id;
            this.currentMeal = this.findCurrentMeal(this.currentMealID);
            this.currentQuestion = this.findCurrentQuestion();
        })
        .then(() => {
           // this.markAsSelected();
        });
    }

    prevStage() {
        this.progressValue = this.dataService.getProgressMark('intro');
        this.percentage = (this.progressValue * 100).toFixed(0);
    }

    selectPreference(mealID: number, questionID: number, preference, optionIndex: number, questionIndex: number, mealIndex: number) {

        this.mealPreferenceOptions[mealIndex].questions[questionIndex].options.forEach((option) => {
            option.selected = false;
        });
        this.mealPreferenceOptions[mealIndex].questions[questionIndex].options[optionIndex].selected = true;

        let preferenceResponse = this.getMealPreferenceResponse(mealID);
        this.currentQuestionID = questionID;
        this.currentQuestionIndex = questionIndex;
        this.currentOptionIndex = optionIndex;

        if (this.mealPreferenceOptions[mealIndex].questions.length == questionIndex + 1) {
            let preference = this.mealPreferenceResponses[this.currentMealIndex]

            if (preference[this.currentQuestionID] == undefined) {
                this.progressValue = this.dataService.getProgressStage();
                this.percentage = (this.progressValue * 100).toFixed(0);
            }
        }

        if (Object.entries(preferenceResponse).length > 0) {
            preferenceResponse[questionID] = preference;
        }
        else {
            this.addMealPreferenceResponse(mealID, questionID, preference.title);
        }

        let timeout = setTimeout(() => {
            this.showNextQuestion(questionIndex, mealIndex);
            clearTimeout(timeout);
        }, 300);

    }

    getCurrentQuestion(meal: any) {
        return meal.questions.find((element: any) => element.active == true)
    }

    /*markAsSelected(){
        this.mealPreferenceResponses.forEach(element => {
            if(element.recipeID == this.currentMealID) {
                for(let i = 0; i < this.currentQuestion.options.length; i++) {
                    if (element[this.currentQuestionID] == this.currentQuestion.options[i]) {
                        document.getElementById('option-'+this.currentMealID+''+this.currentQuestionIndex+''+i).classList.add('selected');
                    } else {
                        document.getElementById('option-'+this.currentMealID+''+this.currentQuestionIndex+''+i).classList.remove('selected');
                    }
                }
            }
        });
    }*/

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
        if (next < this.mealPreferenceOptions[mealIndex].questions.length) {
            this.mealPreferenceOptions[mealIndex].questions[questionIndex].active = false;
            this.mealPreferenceOptions[mealIndex].questions[next].active = true;
        }
        else {
            this.mealSlides.isEnd().then((isEnd) => {
                if (isEnd) {
                    this.currentMeal = this.findCurrentMeal(this.currentMealID);
                    this.currentQuestion = this.findCurrentQuestion();
                    this.currentQuestionID = this.currentQuestion.id;

                   // this.markAsSelected();
                    this.goToIngredients();
                }
                else {
                    this.mealSlides.slideNext();
                }
            });
        }

    }

    backToPrevQuestion(currentQuestionIndex: number) {
        let prev: number;
        let questions = this.mealPreferenceOptions[this.currentMealIndex].questions;
        this.currentMealID = this.mealPreferenceOptions[this.currentMealIndex].id;

        if (currentQuestionIndex > 0) {
            prev = currentQuestionIndex - 1;
            questions[currentQuestionIndex].active = false;
            questions[prev].active = true;
            this.currentQuestionIndex = prev;
        }
        this.currentMeal = this.findCurrentMeal(this.currentMealID);
        this.currentQuestion = this.findCurrentQuestion();
        this.currentQuestionID = this.currentQuestion.id;

        //this.markAsSelected();
    }

    private goToIngredients() {
        this.router.navigateByUrl("/onboarding/ingredientpreferences");
    }

}
