import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { DataService } from '../../../../services/data/data.service';
import { mealPreferenceQuestions } from '../../../../../assets/data/mealpreferencequestions';
import { MealPreference } from '../../../../core/objects/MealPreference';
import { MealPreferenceQuestion, MealPreferenceQuestionOption } from '../../../../core/objects/MealPreferenceQuestion';
import { MealPreferenceResponse } from 'src/app/core/objects/MealPreferenceResponse';
import { IngredientmodalComponent } from '../../../../core/components/ingredientmodal/ingredientmodal.component';
import { IonSlides, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataHandlingService } from 'src/app/services/datahandling/datahandling.service';

@Component({
    selector: 'app-onboarding-surprisepreferences',
    templateUrl: './onboarding-surprisepreferences.component.html',
    styleUrls: ['./onboarding-surprisepreferences.component.scss'],
})
export class OnboardingSurprisePreferencesComponent implements OnInit {
    @ViewChild('surpriseSlides', { static: false }) surpriseSlides: IonSlides;
    @Input() progressValue: any;
    @Input() imgSrc: string;
    @Input() isSelected: boolean = false;
    @Input() page: number = 1;
    isLoading: boolean = true;
    surprisePreferenceOptions: MealPreference[];
    preferenceQuestions: MealPreferenceQuestion[] = mealPreferenceQuestions;
    surprisePreferenceResponse: MealPreferenceResponse;
    percentage: any;

    constructor(
        private dataService: DataService,
        private dataHandlingService: DataHandlingService,
        public modalController: ModalController,
        private router: Router
    ) { }

    ngOnInit() {
        this.imgSrc = "../../../assets/images/icon-ingredient.svg";

        let uid = localStorage.getItem("userID");

        this.surprisePreferenceResponse = {
            userID: uid,
            cook_ratings: {},
            taste_ratings: {},
            familiarity_ratings: {}
        }

        let meals;
        meals = this.dataService.getSurprisePreferencesFromLocal()

        this.dataHandlingService.handleMealPreferenceData(meals)
            .then((organisedData: MealPreference[]) => {
                this.surprisePreferenceOptions = organisedData;
                this.isLoading = false;
        });

        this.progressValue = this.dataService.getProgressStage();
        this.percentage = this.progressValue;

    }

    imageLoaded(meal: MealPreference) {
        console.log("loaded!");
        meal.loaded = true;
    }

    prevStage() {
        this.progressValue = this.dataService.getProgressMark('surprisePreference');
        this.percentage = this.progressValue;
    }

    selectPreference(mealID: string, question: MealPreferenceQuestion, option: MealPreferenceQuestionOption, optionIndex: number, questionIndex: number, mealIndex: number) {

        // Set answer to selected
        this.deselectAllAnswers(mealIndex, questionIndex);
        this.surprisePreferenceOptions[mealIndex].questions[questionIndex].options[optionIndex].selected = true;

        // Set meal preference answer
        this.setMealPreferenceAnswer(mealID, question, option);

        // Show the next question
        let timeout = setTimeout(() => {
            this.showNextQuestion(questionIndex, mealIndex);
            clearTimeout(timeout);
        }, 300);

    }

    setPagerNum() {
        this.surpriseSlides.getActiveIndex().then(
            (index)=>{
                this.page = ++index;
        });
    }

    private deselectAllAnswers(mealIndex: number, questionIndex: number) {
        this.surprisePreferenceOptions[mealIndex].questions[questionIndex].options.forEach((option) => {
            option.selected = false;
        });
    }

    private setMealPreferenceAnswer(mealID: string, question: MealPreferenceQuestion, option: MealPreferenceQuestionOption) {
        this.surprisePreferenceResponse[question.id][mealID] = option.id;
    }

    private showNextQuestion(questionIndex: number, mealIndex: number) {

        let next = questionIndex + 1;

        if (next < this.surprisePreferenceOptions[mealIndex].questions.length) {
            this.surprisePreferenceOptions[mealIndex].questions[questionIndex].active = false;
            this.surprisePreferenceOptions[mealIndex].questions[next].active = true;
        }
        else {
            this.surpriseSlides.isEnd().then((isEnd) => {
                if (isEnd) {
                    this.savePreferences();
                }
                else {
                    this.progressValue = this.dataService.getProgressStage();
                    this.percentage = this.progressValue;
                    this.surpriseSlides.slideNext();
                }
            });
        }

    }

    backToPrevQuestion(questionIndex: number, mealIndex: number) {
        let prev: number;

        if (questionIndex > 0) {
            prev = questionIndex - 1;
            this.surprisePreferenceOptions[mealIndex].questions[questionIndex].active = false;
            this.surprisePreferenceOptions[mealIndex].questions[prev].active = true;
        }
    }

    async openIngredients(recipe: MealPreference) {

        const modal = await this.modalController.create({
            component: IngredientmodalComponent,
            cssClass: 'ingredient-modal',
            componentProps: {
                'recipe': recipe,
            }
        });
        return await modal.present();

    }

    private savePreferences() {
        this.dataService.postSurpriseMealRatingsToServer(this.surprisePreferenceResponse)
            .subscribe((res) => {
                console.log(res);
                this.goToNumberOfMeals();
            });
    }

    private goToNumberOfMeals() {
        this.router.navigateByUrl("/onboarding/numberofmeals");
    }

}
