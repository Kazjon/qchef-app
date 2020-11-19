import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { DataService } from '../../../../services/data/data.service';
import { mealPreferenceQuestions } from '../../../../../assets/data/mealpreferencequestions';
import { MealPreference } from '../../../../core/objects/MealPreference';
import { MealPreferenceQuestion, MealPreferenceQuestionOption } from '../../../../core/objects/MealPreferenceQuestion';
import { MealPreferenceResponse } from 'src/app/core/objects/MealPreferenceResponse';
import { IngredientmodalComponent } from '../../../../core/components/ingredientmodal/ingredientmodal.component';
import { GuidemodalComponent } from '../../../../core/components/guidemodal/guidemodal.component';
import { IonSlides, ModalController, AlertController, IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataHandlingService } from 'src/app/services/datahandling/datahandling.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-onboarding-surprisepreferences',
    templateUrl: './onboarding-surprisepreferences.component.html',
    styleUrls: ['./onboarding-surprisepreferences.component.scss'],
})
export class OnboardingSurprisePreferencesComponent implements OnInit {
    @ViewChild('scroller', { static: false }) scroller: IonContent;
    @ViewChild('surpriseSlides', { static: false }) surpriseSlides: IonSlides;
    @Input() progressValue: any;
    @Input() imgSrc: string;
    @Input() isSelected: boolean = false;
    @Input() page: number = 1;
    activeSlide: number = 0;
    disableNext: boolean = false;
    isLoading: boolean = true;
    surprisePreferenceOptions: MealPreference[];
    preferenceQuestions: MealPreferenceQuestion[] = mealPreferenceQuestions;
    surprisePreferenceResponse: MealPreferenceResponse;
    percentage: any;
    totalProgressSubscription: Subscription;
    totalProgress: Object[];

    constructor(
        private dataService: DataService,
        private dataHandlingService: DataHandlingService,
        public modalController: ModalController,
        private router: Router,
        private alertController: AlertController,
        private firebaseService: FirebaseService
    ) { }

    ngOnInit() {
        this.imgSrc = "../../../assets/images/icon-ingredient.svg";
        let uid = localStorage.getItem("userID");
        this.surprisePreferenceStartPopup();
        
        this.surprisePreferenceResponse = {
            userID: uid,
            surprise_ratings: {},
            taste_ratings: {},
            familiarity_ratings: {}
        }

        let meals;
        meals = this.dataService.getSurprisePreferencesFromLocal()

        this.totalProgressSubscription = this.dataService.totalProgressObservable.subscribe((res) => {
            this.totalProgress = res;
        });

        this.surprisePreferenceOptions = meals;
        this.isLoading = false;

        /*this.dataHandlingService.handleMealPreferenceData(meals)
            .then((organisedData: MealPreference[]) => {
                this.surprisePreferenceOptions = organisedData;
                this.isLoading = false;
        });*/

        //this.progressValue = this.dataService.getProgressStage();
        //this.percentage = this.progressValue;

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

        this.surprisePreferenceOptions[mealIndex].questions[questionIndex].disabled = true;

        // Set answer to selected
        this.deselectAllAnswers(mealIndex, questionIndex);
        this.surprisePreferenceOptions[mealIndex].questions[questionIndex].options[optionIndex].selected = true;

        // Set meal preference answer
        this.setMealPreferenceAnswer(mealID, question, option);

        // Show the next question
        /*let timeout = setTimeout(() => {
            this.showNextQuestion(questionIndex, mealIndex);
            clearTimeout(timeout);
        }, 300);*/

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
                    (this.totalProgress[2] as any).progress = 100;
                    (this.totalProgress[2] as any).count = 10;
                    this.dataService.updateTotalProgress(this.totalProgress);
                    this.savePreferences();
                }
                else {
                    this.progressValue = this.dataService.getProgressStage();
                    this.percentage = this.progressValue;
                    this.surpriseSlides.slideNext();
                    this.calculateProgress();
                }
            });
        }

    }

    showNextMeal(mealIndex: number) {

        this.disableNext = true;

        let totalQuestionsAnswered = 0;

        for (let i = 0; i < this.surprisePreferenceOptions[mealIndex].questions.length; i++) {

            for (let p = 0; p < this.surprisePreferenceOptions[mealIndex].questions[i].options.length; p++) {
                if (this.surprisePreferenceOptions[mealIndex].questions[i].options[p].selected) {
                    totalQuestionsAnswered = totalQuestionsAnswered + 1;
                }
            }
        }

        if (totalQuestionsAnswered === 3) {
            this.surpriseSlides.isEnd().then((isEnd) => {
                if (isEnd) {
                    (this.totalProgress[2] as any).progress = 100;
                    (this.totalProgress[2] as any).count = 10;
                    this.dataService.updateTotalProgress(this.totalProgress);
                    this.savePreferences();
                }
                else {
                    this.progressValue = this.dataService.getProgressStage();
                    this.percentage = this.progressValue;
                    this.surpriseSlides.slideNext();
                    this.scroller.scrollToTop(500);
                    this.disableNext = false;
                    this.calculateProgress();
                }
            });
        }

    }

    showPrevMeal() {
        this.surpriseSlides.slidePrev();
        this.activeSlide = this.activeSlide - 1;
    }

    backToPrevQuestion(questionIndex: number, mealIndex: number) {
        let prev: number;

        if (questionIndex > 0) {
            prev = questionIndex - 1;
            this.surprisePreferenceOptions[mealIndex].questions[questionIndex].active = false;
            this.surprisePreferenceOptions[mealIndex].questions[prev].active = true;
        }
        else {
            this.surprisePreferenceOptions[mealIndex - 1].questions[2].disabled = false;
            this.progressValue = this.dataService.getProgressStage();
            this.percentage = this.progressValue;
            this.surpriseSlides.slidePrev();
            this.calculateProgress();
        }
    }

    private calculateProgress() {
        this.surpriseSlides.getActiveIndex().then((activeIndex) => {
            this.activeSlide = activeIndex;
            let percentage = (activeIndex / this.surprisePreferenceOptions.length) * 100;
            (this.totalProgress[2] as any).progress = percentage;
            (this.totalProgress[2] as any).count = activeIndex;
            this.dataService.updateTotalProgress(this.totalProgress);
        });
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

    async surprisePreferenceStartPopup() {

        const modal = await this.modalController.create({
            component: GuidemodalComponent,
            cssClass: 'guide-modal small',
            componentProps: {
                'title': 'Almost done!',
                'description': ['We\’re now going to show you just a few more recipes to calibrate our algorithm based on what you\’ve said so far.', 'Then you’ll be ready to make a meal plan!']
            }

        });
        return await modal.present();
    }

    private savePreferences() {

        this.scroller.scrollToTop(500);
        this.disableNext = false;
        this.isLoading = true;

        this.dataService.postSurpriseMealRatingsToServer(this.surprisePreferenceResponse)
            .subscribe((res) => {
                this.isLoading = false;
                this.goToNumberOfMeals();
            },
            (error) => {
                if (error.error.text.includes('Authentication error')) {
                    this.showLogoutUserPop();
                }
            });
    }

    private goToNumberOfMeals() {
        this.router.navigateByUrl("/onboarding/numberofmeals");
    }

    async showLogoutUserPop() {

        const alert = await this.alertController.create({
            header: 'Oh no!',
            message: 'Your session has expired! Please log back in.',
            buttons: [
                {
                    text: 'Okay',
                    handler: () => {
                        this.firebaseService.logout()
                            .then(() => {
                                this.router.navigateByUrl('splash');
                            })
                    }
                }
            ]
        });

        await alert.present();
    }

    ngOnDestroy() {
        this.totalProgressSubscription.unsubscribe();
     }

}
