import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { DataService } from '../../../../services/data/data.service';
import { mealPreferenceQuestions } from '../../../../../assets/data/mealpreferencequestions';
import { MealPreference } from '../../../../core/objects/MealPreference';
import { MealPreferenceQuestion, MealPreferenceQuestionOption } from '../../../../core/objects/MealPreferenceQuestion';
import { MealPreferenceResponse } from 'src/app/core/objects/MealPreferenceResponse';
import { IngredientmodalComponent } from '../../../../core/components/ingredientmodal/ingredientmodal.component';
import { IonSlides, ModalController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { DataHandlingService } from 'src/app/services/datahandling/datahandling.service';

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
    isLoading: boolean = true;
    mealPreferenceOptions: MealPreference[];
    preferenceQuestions: MealPreferenceQuestion[] = mealPreferenceQuestions;
    mealPreferenceResponse: MealPreferenceResponse;
    percentage: any;
    mealRatingsToServerResponse: any;

    constructor(
        private dataService: DataService,
        private dataHandlingService: DataHandlingService,
        public modalController: ModalController,
        private router: Router
    ) { }

    ngOnInit() {
        this.imgSrc = "../../../assets/images/icon-ingredient.svg";

        let uid = localStorage.getItem("userID");

        this.mealPreferenceResponse = {
            userID: uid,
            cook_ratings: {},
            taste_ratings: {},
            familiarity_ratings: {}
        }

        this.dataService.getMealsFromServer()
            .subscribe((res) => {
                this.dataHandlingService.handleMealPreferenceData(res)
                    .then((organisedData: MealPreference[]) => {
                        this.mealPreferenceOptions = organisedData;
                        this.isLoading = false;
                    });
            });
        this.progressValue = this.dataService.getProgressStage();
        this.percentage = this.progressValue;

    }

    ionViewDidEnter() {
        // this.mealSlides.lockSwipes(true);
    }

    imageLoaded(meal: MealPreference) {
        console.log("loaded!");
        meal.loaded = true;
    }

    prevStage() {
        this.progressValue = this.dataService.getProgressMark('intro');
        this.percentage = this.progressValue;
    }

    selectPreference(mealID: string, question: MealPreferenceQuestion, option: MealPreferenceQuestionOption, optionIndex: number, questionIndex: number, mealIndex: number) {

        // Set answer to selected
        this.deselectAllAnswers(mealIndex, questionIndex);
        this.mealPreferenceOptions[mealIndex].questions[questionIndex].options[optionIndex].selected = true;

        // Set meal preference answer
        this.setMealPreferenceAnswer(mealID, question, option);

        // Show the next question
        let timeout = setTimeout(() => {
            this.showNextQuestion(questionIndex, mealIndex);
            clearTimeout(timeout);
        }, 300);

    }

    private deselectAllAnswers(mealIndex: number, questionIndex: number) {
        this.mealPreferenceOptions[mealIndex].questions[questionIndex].options.forEach((option) => {
            option.selected = false;
        });
    }

    private setMealPreferenceAnswer(mealID: string, question: MealPreferenceQuestion, option: MealPreferenceQuestionOption) {
        this.mealPreferenceResponse[question.id][mealID] = option.id;
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
                    this.savePreferences();
                }
                else {
                    this.progressValue = this.dataService.getProgressStage();
                    this.percentage = this.progressValue;
                    this.mealSlides.slideNext();
                }
            });
        }

    }

    backToPrevQuestion(questionIndex: number, mealIndex: number) {
        let prev: number;

        if (questionIndex > 0) {
            prev = questionIndex - 1;
            this.mealPreferenceOptions[mealIndex].questions[questionIndex].active = false;
            this.mealPreferenceOptions[mealIndex].questions[prev].active = true;
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

    setPagerNum() {
        this.mealSlides.getActiveIndex().then(
            (index)=>{
                this.page = ++index;
        });
    }

    private savePreferences() {
        this.dataService.postMealRatingsToServer(this.mealPreferenceResponse)
            .subscribe((res) => {
                this.dataHandlingService.handleMealPreferenceData(res)
                .then((organisedData: MealPreference[]) => {
                    this.dataService.saveSurprisePreferencesToLocal(organisedData);
                });

                this.goToIngredients();
            });
    }

    private goToIngredients() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                mealRatingsToServerResponse: this.mealRatingsToServerResponse
            }
        };
        this.router.navigateByUrl("/onboarding/ingredientpreferences", navigationExtras);
    }

}
