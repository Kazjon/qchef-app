import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IngredientPreference } from 'src/app/core/objects/IngredientPreference';
import { IngredientPreferenceQuestion } from 'src/app/core/objects/IngredientPreferenceQuestion';
import { ingredientPreferenceQuestions } from '../../../../../assets/data/ingredientpreferencequestions';
import { IonSlides } from '@ionic/angular';
import { IngredientPreferenceResponse } from 'src/app/core/objects/IngredientPreferenceResponse';
import { DataService } from 'src/app/services/data/data.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-onboarding-ingredientpreferences',
    templateUrl: './onboarding-ingredientpreferences.component.html',
    styleUrls: ['./onboarding-ingredientpreferences.component.scss'],
})
export class OnboardingIngredientPreferencesComponent implements OnInit {
    @ViewChild('ingredientSlides', { static: false }) ingredientSlides: IonSlides;
    @Input() progressValue: any;
    @Input() page: number = 1;

    percentage: any
    currentIngredientIndex: number = 0;
    currentIngredientID: number;
    currentQuestionID: number;
    currentIngredient: any;

    currentQuestion: any;
    currentQuestionIndex: number;

    ingredientPreferenceOptions: IngredientPreference[];
    preferenceQuestions: IngredientPreferenceQuestion[] = ingredientPreferenceQuestions;
    ingredientPreferenceResponses: IngredientPreferenceResponse[] = [];

    constructor(private dataService: DataService, private router: Router) { }

    ngOnInit() {

        this.dataService.getIngredientsFromServer().subscribe((res) => {
            this.ingredientPreferenceOptions = res;
            this.addIngredientPreferenceQuestionsToIngredients();
        });
        this.progressValue = this.dataService.getProgressStage();
        this.percentage = (this.progressValue * 100).toFixed(0);
    }

    prevStage() {
        this.progressValue = this.dataService.getProgressMark('mealPreference');
        this.percentage = (this.progressValue * 100).toFixed(0);
    }

    findCurrentIngredient(id: number) {
        return this.ingredientPreferenceOptions.find((element: any) => element.id == id )
    }

    findCurrentQuestion() {
        return this.currentIngredient.questions.find((element: any) => element.active == true)
    }

    onSlideChange() {

        this.ingredientSlides.getActiveIndex().then((index)=> {
            this.page = index + 1;
            this.currentIngredientIndex = index;
            this.currentIngredientID = this.ingredientPreferenceOptions[this.currentIngredientIndex].id;
            this.currentIngredient = this.findCurrentIngredient(this.currentIngredientID);
            this.currentQuestion = this.findCurrentQuestion();

        })
        .then(() => {
            //this.markAsSelected();
        });
    }

    selectPreference(ingredientID: number, questionID: number, preference, questionIndex: number, ingredientIndex: number, optionIndex: number) {

        this.ingredientPreferenceOptions[ingredientIndex].questions[questionIndex].options.forEach((option) => {
            option.selected = false;
        });
        this.ingredientPreferenceOptions[ingredientIndex].questions[questionIndex].options[optionIndex].selected = true;

        let preferenceResponse = this.getIngredientPreferenceResponse(ingredientID);
        this.currentQuestionID = questionID;
        this.currentQuestionIndex = questionIndex;

        if(this.ingredientPreferenceOptions[ingredientIndex].questions.length == questionIndex + 1) {
            let preference = this.ingredientPreferenceResponses[this.currentIngredientIndex]

            if (preference[this.currentQuestionID] == undefined) {
                this.progressValue = this.dataService.getProgressStage();
                this.percentage = (this.progressValue * 100).toFixed(0);
            }
        }

        if (Object.entries(preferenceResponse).length > 0) {
            preferenceResponse[questionID] = preference.title;
        }
        else {
            this.addIngredientPreferenceResponse(ingredientID, questionID, preference.title);
        }

        let timeout = setTimeout(() => {
            this.showNextQuestion(questionIndex, ingredientIndex);
            clearTimeout(timeout);
        }, 300);

    }

    private addIngredientPreferenceQuestionsToIngredients() {
        this.ingredientPreferenceOptions.forEach((ingredient) => {
            let questions = JSON.stringify(this.preferenceQuestions);
            ingredient.questions = JSON.parse(questions);
        });
    }

    private getIngredientPreferenceResponse(ingredientID) {

        let response = {};

        for (let i = 0; i < this.ingredientPreferenceResponses.length; i++) {

            if (ingredientID == this.ingredientPreferenceResponses[i].ingredientID) {
                response = this.ingredientPreferenceResponses[i];
                break;
            }

        }

        return response;

    }

    private addIngredientPreferenceResponse(ingredientID: number, questionID: number, preference: string) {

        let response: IngredientPreferenceResponse = {
            ingredientID: ingredientID
        };

        response[questionID] = preference;

        this.ingredientPreferenceResponses.push(response);

    }

    private showNextQuestion(questionIndex: number, mealIndex: number) {

        let next = questionIndex + 1;

        if (next < this.ingredientPreferenceOptions[mealIndex].questions.length) {
            this.ingredientPreferenceOptions[mealIndex].questions[questionIndex].active = false;
            this.ingredientPreferenceOptions[mealIndex].questions[next].active = true;
        }
        else {
            this.ingredientSlides.isEnd().then((isEnd) => {
                if (isEnd) {
                    this.currentIngredient = this.findCurrentIngredient(this.currentIngredientID);
                    this.currentQuestion = this.findCurrentQuestion();
                    this.currentQuestionID = this.currentQuestion.id;

                    //this.markAsSelected();
                    this.goToNumberOfMeals();
                }
                else {
                    this.ingredientSlides.slideNext();
                }
            });
        }

    }

    /*markAsSelected(){
        this.ingredientPreferenceResponses.forEach(element => {
            if(element.ingredientID == this.currentIngredientID) {
                for(let i = 0; i < this.currentQuestion.options.length; i++) {
                    if (element[this.currentQuestionID] == this.currentQuestion.options[i]) {
                        document.getElementById('ingredient-'+this.currentIngredientID+''+this.currentQuestionIndex+''+i).classList.add('selected');
                    } else {
                        document.getElementById('ingredient-'+this.currentIngredientID+''+this.currentQuestionIndex+''+i).classList.remove('selected');
                    }
                }
            }
        });
    }*/

    backToPrevQuestion(currentQuestionIndex: number) {
        let prev: number;

        let questions = this.ingredientPreferenceOptions[this.currentIngredientIndex].questions;
        this.currentIngredientID = this.ingredientPreferenceOptions[this.currentIngredientIndex].id;

        if (currentQuestionIndex > 0) {
            prev = currentQuestionIndex - 1;
            questions[currentQuestionIndex].active = false;
            questions[prev].active = true;
            this.currentQuestionIndex = prev;
        }
        this.currentIngredient = this.findCurrentIngredient(this.currentIngredientID);
        this.currentQuestion = this.findCurrentQuestion();
        this.currentQuestionID = this.currentQuestion.id;

        //this.markAsSelected();
    }

    private goToNumberOfMeals() {
        this.router.navigateByUrl("/onboarding/numberofmeals");
    }

    goBack() {
        this.router.navigateByUrl("/onboarding/mealpreferences");
    }

}
