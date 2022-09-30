import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { DataService } from "../../../../services/data/data.service";
import { mealPreferenceQuestions } from "../../../../../assets/data/mealpreferencequestions";
import { MealPreference } from "../../../../core/objects/MealPreference";
import { MealPreferenceQuestion, MealPreferenceQuestionOption } from "../../../../core/objects/MealPreferenceQuestion";
import { MealPreferenceResponse } from "src/app/core/objects/MealPreferenceResponse";
import { IngredientmodalComponent } from "../../../../core/components/ingredientmodal/ingredientmodal.component";
import { GuidemodalComponent } from "../../../../core/components/guidemodal/guidemodal.component";
import { IonSlides, ModalController, AlertController, IonContent } from "@ionic/angular";
import { Router, NavigationExtras } from "@angular/router";
import { DataHandlingService } from "src/app/services/datahandling/datahandling.service";
import { FirebaseService } from "src/app/services/firebase/firebase.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-onboarding-mealpreferences",
  templateUrl: "./onboarding-mealpreferences.component.html",
  styleUrls: ["./onboarding-mealpreferences.component.scss"],
})
export class OnboardingMealPreferencesComponent implements OnInit {
  @ViewChild("scroller", { static: false }) scroller: IonContent;
  @ViewChild("mealSlides", { static: false }) mealSlides: IonSlides;
  @Input() progressValue: any;
  @Input() imgSrc: string;
  @Input() isSelected: boolean = false;
  @Input() page: number = 1;
  activeSlide: number = 0;
  disableNext: boolean = false;
  isLoading: boolean = true;
  mealPreferenceOptions: MealPreference[];
  preferenceQuestions: MealPreferenceQuestion[] = mealPreferenceQuestions;
  mealPreferenceResponse: MealPreferenceResponse;
  percentage: any;
  mealRatingsToServerResponse: any;
  totalProgressSubscription: Subscription;
  totalProgress: Object[];
  showAllIngredients: boolean = false;
  isExpand: boolean = false;
  selectedAnswerNum: number = 0;
  imgSrcLoading: string = "../../../assets/images/splash.svg";

  constructor(
    private dataService: DataService,
    private dataHandlingService: DataHandlingService,
    public modalController: ModalController,
    private router: Router,
    private alertController: AlertController,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.imgSrc = "../../../assets/images/icon-ingredient.svg";
    let uid = localStorage.getItem("userID");
    this.surprisePreferenceStartPopup();

    this.mealPreferenceResponse = {
      //userID: uid,
      surprise_ratings: {},
      taste_ratings: {},
      familiarity_ratings: {},
    };

    this.totalProgressSubscription = this.dataService.totalProgressObservable.subscribe((res) => {
      this.totalProgress = res;
    });

    this.dataService.getMealsFromServer().subscribe(
      (res) => {
        this.dataHandlingService.handleMealPreferenceData(res).then((organisedData: MealPreference[]) => {
          this.mealPreferenceOptions = organisedData;
          let timeout = setTimeout(() => {
            this.isLoading = false;
            clearTimeout(timeout);
          }, 500);
        });
      },
      (exception) => {
        // need to check if server return 'Unable to authenticate'
        if (exception && exception.error && typeof exception.error == "string") {
          const strRes = <string>exception.error;
          if (strRes.includes("Unable to authenticate")) {
            this.showLogoutUserPop();
          }
        }
      }
    );
    //this.progressValue = this.dataService.getProgressStage();
    // this.percentage = this.progressValue;
  }

  imageLoaded(meal: MealPreference) {
    meal.loaded = true;
  }

  prevStage() {
    this.progressValue = this.dataService.getProgressMark("intro");
    this.percentage = this.progressValue;
  }

  selectPreference(
    mealID: string,
    question: MealPreferenceQuestion,
    option: MealPreferenceQuestionOption,
    optionIndex: number,
    questionIndex: number,
    mealIndex: number
  ) {
    this.mealPreferenceOptions[mealIndex].questions[questionIndex].disabled = true;

    // Set answer to selected
    this.deselectAllAnswers(mealIndex, questionIndex);
    this.mealPreferenceOptions[mealIndex].questions[questionIndex].options[optionIndex].selected = true;
    this.getSelectedAnswerNum(mealIndex);
    // Set meal preference answer
    this.setMealPreferenceAnswer(mealID, question, option);

    // Show the next question
    /*let timeout = setTimeout(() => {
            this.showNextQuestion(questionIndex, mealIndex);
            clearTimeout(timeout);
        }, 300);*/
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
    } else {
      this.mealSlides.isEnd().then((isEnd) => {
        if (isEnd) {
          (this.totalProgress[0] as any).progress = 100;
          (this.totalProgress[0] as any).count = 20;
          this.dataService.updateTotalProgress(this.totalProgress);
          this.savePreferences();
        } else {
          this.progressValue = this.dataService.getProgressStage();
          this.percentage = this.progressValue;
          this.mealSlides.slideNext();
          this.calculateProgress();
        }
      });
    }
  }

  getSelectedAnswerNum(mealIndex: number) {
    this.selectedAnswerNum = 0;
    for (let i = 0; i < this.mealPreferenceOptions[mealIndex].questions.length; i++) {
      for (let p = 0; p < this.mealPreferenceOptions[mealIndex].questions[i].options.length; p++) {
        if (this.mealPreferenceOptions[mealIndex].questions[i].options[p].selected) {
          this.selectedAnswerNum++;
        }
      }
    }
  }

  showNextMeal(mealIndex: number) {
    this.showAllIngredients = false;
    this.isExpand = false;
    this.disableNext = true;

    this.getSelectedAnswerNum(mealIndex);

    if (this.selectedAnswerNum === 3) {
      this.mealSlides.isEnd().then((isEnd) => {
        if (isEnd) {
          (this.totalProgress[0] as any).progress = 100;
          (this.totalProgress[0] as any).count = 20;
          this.dataService.updateTotalProgress(this.totalProgress);
          this.savePreferences();
        } else {
          this.progressValue = this.dataService.getProgressStage();
          this.percentage = this.progressValue;
          this.mealSlides.slideNext();
          this.selectedAnswerNum = 0;
          this.scroller.scrollToTop(500);
          this.disableNext = false;
          this.calculateProgress();
          this.getSelectedAnswerNum(this.activeSlide + 1);
        }
      });
    } else {
      this.disableNext = false;
    }
  }

  showPrevMeal() {
    this.mealSlides.slidePrev();
    this.activeSlide = this.activeSlide - 1;
    this.getSelectedAnswerNum(this.activeSlide);
  }

  backToPrevQuestion(questionIndex: number, mealIndex: number) {
    let prev: number;

    if (questionIndex > 0) {
      prev = questionIndex - 1;
      this.mealPreferenceOptions[mealIndex].questions[questionIndex].active = false;
      this.mealPreferenceOptions[mealIndex].questions[prev].active = true;
      this.mealPreferenceOptions[mealIndex].questions[prev].disabled = false;
    } else {
      this.mealPreferenceOptions[mealIndex - 1].questions[2].disabled = false;
      this.progressValue = this.dataService.getProgressStage();
      this.percentage = this.progressValue;
      this.mealSlides.slidePrev();
      this.calculateProgress();
    }
  }

  private calculateProgress() {
    this.mealSlides.getActiveIndex().then((activeIndex) => {
      this.activeSlide = activeIndex;
      let percentage = (activeIndex / this.mealPreferenceOptions.length) * 100;
      (this.totalProgress[0] as any).progress = percentage;
      (this.totalProgress[0] as any).count = activeIndex;
      this.dataService.updateTotalProgress(this.totalProgress);
    });
  }

  async openIngredients(recipe: MealPreference) {
    this.showAllIngredients = true;
    this.isExpand = true;
  }

  async surprisePreferenceStartPopup() {
    const modal = await this.modalController.create({
      component: GuidemodalComponent,
      cssClass: "guide-modal",
      componentProps: {
        title: "Let’s get started!",
        description: [
          "To get a better idea of what you like, we’d like to get your thoughts on some recipes.",
          "We'll ask you whether you know how it would taste, whether you think you'd enjoy it, and whether the ingredients are what you'd expect.",
        ],
      },
    });
    return await modal.present();
  }

  setPagerNum() {
    this.mealSlides.getActiveIndex().then((index) => {
      this.page = ++index;
    });
  }

  private savePreferences() {
    this.scroller.scrollToTop(500);
    this.disableNext = false;
    this.isLoading = true;

    this.dataService.postMealRatingsToServer(this.mealPreferenceResponse).subscribe(
      (res) => {
        /*this.dataHandlingService.handleMealPreferenceData(res)
                .then((organisedData: MealPreference[]) => {
                    this.dataService.saveSurprisePreferencesToLocal(organisedData);
                });*/

        this.isLoading = false;
        this.goToIngredients();
      },
      (exception) => {
        // need to check if server return 'Unable to authenticate'
        if (exception && exception.error && typeof exception.error == "string") {
          const strRes = <string>exception.error;
          if (strRes.includes("Unable to authenticate")) {
            this.showLogoutUserPop();
          }
        }
      }
    );
  }

  private goToIngredients() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        mealRatingsToServerResponse: this.mealRatingsToServerResponse,
      },
    };
    this.router.navigateByUrl("/onboarding/ingredientpreferences", navigationExtras);
  }

  async showLogoutUserPop() {
    const alert = await this.alertController.create({
      header: "Oh no!",
      message: "Your session has expired! Please log back in.",
      buttons: [
        {
          text: "Okay",
          handler: () => {
            this.firebaseService.logoutUserFromApp().then(() => {
              this.router.navigateByUrl("login", { replaceUrl: true });
            });
          },
        },
      ],
    });

    await alert.present();
  }

  ngOnDestroy() {
    this.totalProgressSubscription.unsubscribe();
  }
}
