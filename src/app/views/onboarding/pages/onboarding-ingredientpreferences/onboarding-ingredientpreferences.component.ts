import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IngredientPreference } from 'src/app/core/objects/IngredientPreference';
import { IngredientPreferenceQuestion, IngredientPreferenceQuestionOption } from 'src/app/core/objects/IngredientPreferenceQuestion';
import { ingredientPreferenceQuestions } from '../../../../../assets/data/ingredientpreferencequestions';
import { IonSlides } from '@ionic/angular';
import { IngredientPreferenceResponse } from 'src/app/core/objects/IngredientPreferenceResponse';
import { DataService } from 'src/app/services/data/data.service';
import { Router } from '@angular/router';
import { DataHandlingService } from 'src/app/services/datahandling/datahandling.service';

@Component({
    selector: 'app-onboarding-ingredientpreferences',
    templateUrl: './onboarding-ingredientpreferences.component.html',
    styleUrls: ['./onboarding-ingredientpreferences.component.scss'],
})
export class OnboardingIngredientPreferencesComponent implements OnInit {
    @ViewChild('ingredientSlides', { static: false }) ingredientSlides: IonSlides;
    @Input() progressValue: any;
    @Input() page: number = 1;
    isLoading: boolean = true;
    ingredientPreferenceOptions: IngredientPreference[];
    preferenceQuestions: IngredientPreferenceQuestion[] = ingredientPreferenceQuestions;
    ingredientPreferenceResponse: IngredientPreferenceResponse;
    percentage: any;

    constructor(private dataService: DataService, private router: Router, private dataHandlingService: DataHandlingService) { }

    ngOnInit() {

        this.ingredientPreferenceResponse = {
            userID: "9999",
            taste_ratings: {},
            familiarity_ratings: {}
        }

        this.dataService.getIngredientsFromServer().subscribe((res) => {
            this.dataHandlingService.handleIngredientPreferenceData(res)
                .then((organisedData: IngredientPreference[]) => {
                    this.ingredientPreferenceOptions = organisedData;
                    this.isLoading = false;
                });
        });
        this.progressValue = this.dataService.getProgressStage();
        this.percentage = this.progressValue;
    }

    prevStage() {
        this.progressValue = this.dataService.getProgressMark('mealPreference');
        this.percentage = this.progressValue;
    }

    imageLoaded(ingredient: IngredientPreference) {
        ingredient.loaded = true;
    }

    selectPreference(ingredientID: string, question: IngredientPreferenceQuestion, option: IngredientPreferenceQuestionOption, optionIndex: number, questionIndex: number, ingredientIndex: number) {

        // Set answer to selected
        this.deselectAllAnswers(ingredientIndex, questionIndex);
        this.ingredientPreferenceOptions[ingredientIndex].questions[questionIndex].options[optionIndex].selected = true;

        // Set ingredient preference answer
        this.setIngredientPreferenceAnswer(ingredientID, question, option);

        // Show the next question
        let timeout = setTimeout(() => {
            this.showNextQuestion(questionIndex, ingredientIndex);
            clearTimeout(timeout);
        }, 300);

    }

    private deselectAllAnswers(ingredientIndex: number, questionIndex: number) {
        this.ingredientPreferenceOptions[ingredientIndex].questions[questionIndex].options.forEach((option) => {
            option.selected = false;
        });
    }

    private setIngredientPreferenceAnswer(ingredientID: string, question: IngredientPreferenceQuestion, option: IngredientPreferenceQuestionOption) {
        this.ingredientPreferenceResponse[question.id][ingredientID] = option.id;
    }

    private showNextQuestion(questionIndex: number, ingredientIndex: number) {

        let next = questionIndex + 1;

        if (next < this.ingredientPreferenceOptions[ingredientIndex].questions.length) {
            this.ingredientPreferenceOptions[ingredientIndex].questions[questionIndex].active = false;
            this.ingredientPreferenceOptions[ingredientIndex].questions[next].active = true;
        }
        else {
            this.ingredientSlides.isEnd().then((isEnd) => {
                if (isEnd) {
                    this.savePreferences();
                }
                else {
                    this.progressValue = this.dataService.getProgressStage();
                    this.percentage = this.progressValue;
                    this.ingredientSlides.slideNext();
                }
            });
        }

    }


    backToPrevQuestion(questionIndex: number, ingredientIndex: number) {
        let prev: number;

        if (questionIndex > 0) {
            prev = questionIndex - 1;
            this.ingredientPreferenceOptions[ingredientIndex].questions[questionIndex].active = false;
            this.ingredientPreferenceOptions[ingredientIndex].questions[prev].active = true;
        }
    }

    setPagerNum() {
        this.ingredientSlides.getActiveIndex().then(
            (index)=>{
                this.page = ++index;
        });
    }

    private savePreferences() {
        this.dataService.postIngredientRatingsToServer(this.ingredientPreferenceResponse)
            .subscribe((res) => {
                console.log('post ingredirent', res);
                this.goToLoadingScreen();
            });
    }

    private goToLoadingScreen() {
        this.router.navigateByUrl("/onboarding/loadingscreen");
    }

    goBack() {
        this.router.navigateByUrl("/onboarding/mealpreferences");
    }

}
