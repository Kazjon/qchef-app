import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IngredientPreference } from 'src/app/core/objects/IngredientPreference';
import { IngredientPreferenceQuestion, IngredientPreferenceQuestionOption } from 'src/app/core/objects/IngredientPreferenceQuestion';
import { ingredientPreferenceQuestions } from '../../../../../assets/data/ingredientpreferencequestions';
import { GuidemodalComponent } from '../../../../core/components/guidemodal/guidemodal.component';
import { IonSlides, AlertController, IonContent, ModalController } from '@ionic/angular';
import { IngredientPreferenceResponse } from 'src/app/core/objects/IngredientPreferenceResponse';
import { DataService } from 'src/app/services/data/data.service';
import { Router } from '@angular/router';
import { DataHandlingService } from 'src/app/services/datahandling/datahandling.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-onboarding-ingredientpreferences',
    templateUrl: './onboarding-ingredientpreferences.component.html',
    styleUrls: ['./onboarding-ingredientpreferences.component.scss'],
})
export class OnboardingIngredientPreferencesComponent implements OnInit {
    @ViewChild('scroller', { static: false }) scroller: IonContent;
    @ViewChild('ingredientSlides', { static: false }) ingredientSlides: IonSlides;
    @Input() progressValue: any;
    @Input() page: number = 1;
    activeSlide: number = 0;
    disableNext: boolean = false;
    isLoading: boolean = true;
    ingredientPreferenceOptions: IngredientPreference[];
    preferenceQuestions: IngredientPreferenceQuestion[] = ingredientPreferenceQuestions;
    ingredientPreferenceResponse: IngredientPreferenceResponse;
    percentage: any;
    totalProgressSubscription: Subscription;
    totalProgress: Object[];

    constructor(
        private dataService: DataService, 
        private router: Router, 
        private dataHandlingService: DataHandlingService, 
        private alertController: AlertController, 
        private firebaseService: FirebaseService,
        public modalController: ModalController,
    ) { }

    ngOnInit() {

        let uid = localStorage.getItem("userID");
        this.surprisePreferenceStartPopup();
        
        this.ingredientPreferenceResponse = {
            userID: uid,
            taste_ratings: {},
            familiarity_ratings: {}
        }

        this.dataService.getIngredientsFromServer().subscribe((res) => {
            this.dataHandlingService.handleIngredientPreferenceData(res)
                .then((organisedData: IngredientPreference[]) => {
                    this.ingredientPreferenceOptions = organisedData;
                    this.isLoading = false;
                });
        },
        (error) => {
            if (error.error.text.includes('Authentication error')) {
                this.showLogoutUserPop();
            }
        });
        //this.progressValue = this.dataService.getProgressStage();
        //this.percentage = this.progressValue;

        this.totalProgressSubscription = this.dataService.totalProgressObservable.subscribe((res) => {
            this.totalProgress = res;
        });
    }

    prevStage() {
        this.progressValue = this.dataService.getProgressMark('mealPreference');
        this.percentage = this.progressValue;
    }

    imageLoaded(ingredient: IngredientPreference) {
        ingredient.loaded = true;
    }

    selectPreference(ingredientID: string, question: IngredientPreferenceQuestion, option: IngredientPreferenceQuestionOption, optionIndex: number, questionIndex: number, ingredientIndex: number) {

        this.ingredientPreferenceOptions[ingredientIndex].questions[questionIndex].disabled = true;

        // Set answer to selected
        this.deselectAllAnswers(ingredientIndex, questionIndex);
        this.ingredientPreferenceOptions[ingredientIndex].questions[questionIndex].options[optionIndex].selected = true;

        // Set ingredient preference answer
        this.setIngredientPreferenceAnswer(ingredientID, question, option);

        // Show the next question
        /*let timeout = setTimeout(() => {
            this.showNextQuestion(questionIndex, ingredientIndex);
            clearTimeout(timeout);
        }, 300);*/

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
                    (this.totalProgress[1] as any).progress = 100;
                    (this.totalProgress[1] as any).count = 30;
                    this.dataService.updateTotalProgress(this.totalProgress);
                    this.savePreferences();
                }
                else {
                    this.progressValue = this.dataService.getProgressStage();
                    this.percentage = this.progressValue;
                    this.ingredientSlides.slideNext();
                    this.calculateProgress();
                }
            });
        }

    }

    showNextIngredient(mealIndex: number) {

        this.disableNext = true;

        let totalQuestionsAnswered = 0;

        for (let i = 0; i < this.ingredientPreferenceOptions[mealIndex].questions.length; i++) {

            for (let p = 0; p < this.ingredientPreferenceOptions[mealIndex].questions[i].options.length; p++) {
                if (this.ingredientPreferenceOptions[mealIndex].questions[i].options[p].selected) {
                    totalQuestionsAnswered = totalQuestionsAnswered + 1;
                }
            }
        }

        if (totalQuestionsAnswered === 2) {
            this.ingredientSlides.isEnd().then((isEnd) => {
                if (isEnd) {
                    (this.totalProgress[1] as any).progress = 100;
                    (this.totalProgress[1] as any).count = 30;
                    this.dataService.updateTotalProgress(this.totalProgress);
                    this.savePreferences();
                }
                else {
                    this.progressValue = this.dataService.getProgressStage();
                    this.percentage = this.progressValue;
                    this.ingredientSlides.slideNext();
                    this.scroller.scrollToTop(500);
                    this.disableNext = false;
                    this.calculateProgress();
                }
            });
        }

    }

    showPrevIngredient() {
        this.ingredientSlides.slidePrev();
        this.activeSlide = this.activeSlide - 1;
    }


    backToPrevQuestion(questionIndex: number, ingredientIndex: number) {
        let prev: number;

        if (questionIndex > 0) {
            prev = questionIndex - 1;
            this.ingredientPreferenceOptions[ingredientIndex].questions[questionIndex].active = false;
            this.ingredientPreferenceOptions[ingredientIndex].questions[prev].active = true;
        }
        else {
            this.ingredientPreferenceOptions[ingredientIndex - 1].questions[2].disabled = false;
            this.progressValue = this.dataService.getProgressStage();
            this.percentage = this.progressValue;
            this.ingredientSlides.slidePrev();
            this.calculateProgress();
        }
    }

    private calculateProgress() {
        this.ingredientSlides.getActiveIndex().then((activeIndex) => {
            this.activeSlide = activeIndex;
            let percentage = (activeIndex / this.ingredientPreferenceOptions.length) * 100;
            (this.totalProgress[1] as any).progress = percentage;
            (this.totalProgress[1] as any).count = activeIndex;
            this.dataService.updateTotalProgress(this.totalProgress);
        });
    }

    setPagerNum() {
        this.ingredientSlides.getActiveIndex().then(
            (index)=>{
                this.page = ++index;
        });
    }

    private savePreferences() {
        localStorage.setItem("ingredientPrefs", JSON.stringify(this.ingredientPreferenceResponse));
        this.disableNext = false;
        this.goToLoadingScreen();
        /*this.dataService.postIngredientRatingsToServer(this.ingredientPreferenceResponse)
            .subscribe((res) => {
                console.log('post ingredirent', res);
                this.goToLoadingScreen();
            });*/
    }

    async surprisePreferenceStartPopup() {

        const modal = await this.modalController.create({
            component: GuidemodalComponent,
            cssClass: 'guide-modal',
            componentProps: {
                'title': 'Nice work!',
                'description': ['On the next page we\'re going to show you some ingredients.', 'We\'ll ask if you\'re familiar with each one, then how much you like it.', 'If there\'s something you\'ve never eaten, don\'t worry: just answer as well as you can.']
            }
        });
        return await modal.present();
    }

    private goToLoadingScreen() {
        this.router.navigateByUrl("/onboarding/loadingscreen");
    }

    goBack() {
        this.router.navigateByUrl("/onboarding/mealpreferences");
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
