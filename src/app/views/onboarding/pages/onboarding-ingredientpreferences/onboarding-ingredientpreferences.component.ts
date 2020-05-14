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
    }

    prevStage() {
        this.progressValue = this.dataService.getProgressMark('mealPreference');
    }

    selectPreference(ingredientID: number, questionID: number, preference: string, questionIndex: number, ingredientIndex: number) {

        let preferenceResponse = this.getIngredientPreferenceResponse(ingredientID);

        if (Object.entries(preferenceResponse).length > 0) {
            preferenceResponse[questionID] = preference;
        }
        else {
            this.addIngredientPreferenceResponse(ingredientID, questionID, preference);
        }

        this.showNextQuestion(questionIndex, ingredientIndex);

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
                    this.goToNumberOfMeals();
                }
                else {
                    this.ingredientSlides.slideNext();
                }
            });
        }

    }

    private goToNumberOfMeals() {
        this.router.navigateByUrl("/onboarding/numberofmeals");
    }

}
