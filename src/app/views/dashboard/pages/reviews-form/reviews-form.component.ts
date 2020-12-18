import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Plugins, CameraResultType, CameraSource, LocalNotificationScheduleResult } from '@capacitor/core';
import { ActionSheetController, ModalController, AlertController } from '@ionic/angular';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { DataService } from 'src/app/services/data/data.service';
import { MealSlot } from 'src/app/core/objects/MealSlot';
import { IncompleteReviewModalComponent } from 'src/app/core/components/incompletereviewmodal/incompletereviewmodal.component';
import { RecipeReviewResponse } from 'src/app/core/objects/RecipeReviewResponse';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
// import { ExitReviewModalComponent } from 'src/app/core/components/exitreviewmodal/exitreviewmodal.component';

@Component({
    selector: 'app-reviews-form',
    templateUrl: './reviews-form.component.html',
    styleUrls: ['./reviews-form.component.scss'],
})
export class ReviewsFormComponent implements OnInit {
    id: any;
    mealTitle: string;
    mealSlots: MealSlot[];
    reviewForm: FormGroup;
    formSubmitted: boolean = false;
    formDisabled: boolean = false;
    errorMessage: string = undefined;
    // disableMenuBtn: boolean = true;
    photoBase64: string = null;
    taste = {
        option1Selected: false,
        option2Selected: false,
        option3Selected: false
    }
    enjoy = {
        option1Selected: false,
        option2Selected: false,
        option3Selected: false
    }
    tryAgain = {
        option1Selected: false,
        option2Selected: false,
        option3Selected: false
    }


    photo: SafeResourceUrl;
    buttonLabel: string = 'ADD PHOTO';

    constructor(
        public actionSheetController: ActionSheetController,
        private dataService: DataService,
        private formBuilder: FormBuilder,
        private modalController: ModalController,
        private sanitizer: DomSanitizer,
        private route: ActivatedRoute,
        private router: Router,
        private alertController: AlertController,
        private firebaseService: FirebaseService) {
    }

    ngOnInit() {
        this.dataService.getMealSlotsFromLocal();
        this.dataService.getWeekStartDateFromLocal();

        combineLatest(
            this.dataService.mealSlotsObservable
        ).pipe(
            take(2)
        )
            .subscribe(([mealSlots]) => {
                this.checkData(mealSlots);
            });

        this.route.paramMap.subscribe(paramMap => {
            this.id = paramMap.get('id');
        })

        this.getMealTitle();

        this.reviewForm = this.formBuilder.group({
            reason: ['', [
                Validators.required
            ]],
            feeling: ['', [
                Validators.required
            ]],
            taste: ['', [
                Validators.required
            ]],
            enjoy: ['', [
                Validators.required
            ]],
            tryAgain: ['', [
                Validators.required
            ]]
        });

    }

    private checkData(data) {
        if (data.length <= 0 || data[0].recipe == undefined) {
            this.router.navigateByUrl('mealselection/meal/1', { replaceUrl: true });
        }
        else {
            this.mealSlots = data;
        }
    }

    private getMealTitle() {
        this.mealSlots.forEach(element => {
            if (element.recipe.id == this.id)
                this.mealTitle = element.recipe.title;
        });

    }

    updateTaste(optionSelected) {

        this.taste.option1Selected = false;
        this.taste.option2Selected = false;
        this.taste.option3Selected = false;

        switch(optionSelected) {
            case "0":
                this.taste.option1Selected = true;
                break;
            case "1":
                this.taste.option2Selected = true;
                break;
            case "2":
                this.taste.option3Selected = true;
                break;
            default:
                break;

        }
    }

    updateEnjoy(optionSelected) {

        this.enjoy.option1Selected = false;
        this.enjoy.option2Selected = false;
        this.enjoy.option3Selected = false;

        switch(optionSelected) {
            case "0":
                this.enjoy.option1Selected = true;
                break;
            case "1":
                this.enjoy.option2Selected = true;
                break;
            case "2":
                this.enjoy.option3Selected = true;
                break;
            default:
                break;

        }
    }

    updateTryAgain(optionSelected) {

        this.tryAgain.option1Selected = false;
        this.tryAgain.option2Selected = false;
        this.tryAgain.option3Selected = false;

        switch(optionSelected) {
            case "0":
                this.tryAgain.option1Selected = true;
                break;
            case "1":
                this.tryAgain.option2Selected = true;
                break;
            case "2":
                this.tryAgain.option3Selected = true;
                break;
            default:
                break;

        }
    }

    submitReview() {

        this.formSubmitted = true;
        console.log(this.id);

        let recipeReviewResponse: RecipeReviewResponse = {
            cook_ratings: {},
            taste_ratings: {},
            familiarity_ratings: {},
            why_response: {},
            how_response: {},
            image: {}
        };

        recipeReviewResponse.cook_ratings[this.id] = parseInt(this.reviewForm.controls.tryAgain.value);
        recipeReviewResponse.taste_ratings[this.id] = parseInt(this.reviewForm.controls.enjoy.value);
        recipeReviewResponse.familiarity_ratings[this.id] = parseInt(this.reviewForm.controls.taste.value);
        recipeReviewResponse.why_response[this.id] = this.reviewForm.controls.reason.value;
        recipeReviewResponse.how_response[this.id] = this.reviewForm.controls.feeling.value;
        recipeReviewResponse.image[this.id] = this.photoBase64;

        console.log(recipeReviewResponse);

        // taste = familiarity_rating
        // enjoy = taste_rating
        // tryAgain = cook_rating
        // reason = why
        // feeling = how

        this.dataService.postRecipeReviewToServer(recipeReviewResponse)
            .subscribe((res) => {
                console.log(res);
                this.mealSlots.forEach(element => {
                    if (element.recipe.id == this.id)
                        element.reviewed = true;
                        this.dataService.saveMealSlotsToLocal(this.mealSlots);
                        this.dataService.setTotalMealsNotReviewed();
                        this.router.navigateByUrl('dashboard/reviews', { replaceUrl: true });
                        this.formSubmitted = false;
                });
            },
            (error) => {
                if (error.error.text.includes('Authentication error')) {
                    this.showLogoutUserPop();
                }
            });

    }

    async takePhoto(type: string) {
        let source: any;
        if (type == 'camera') {
            source = CameraSource.Camera
        } else if (type == 'photo') {
            source = CameraSource.Photos
        }

        const image = await Plugins.Camera.getPhoto({
            quality: 100,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: source
        });

        console.log(image);
        this.photoBase64 = image.dataUrl;
        this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
        if (this.photo) {
            this.buttonLabel = 'REPLACE IMAGE';
        }
        /*Object.keys(this.reviewForm.controls).forEach(key => {
            let abstractControl: AbstractControl = this.reviewForm.get('photo');
            if (this.photo) {
                abstractControl.setValue(this.photo)
            }
        })*/
    }

    async updatePhotoFrom() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Albums',
            cssClass: 'my-custom-class',
            buttons: [{
                text: 'Camera',
                handler: () => {
                    this.takePhoto('camera');
                }
            }, {
                text: 'Gallery',
                handler: () => {
                    this.takePhoto('photo');
                }
            }, {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }]
        });
        await actionSheet.present();
    }


    async openSubmissionInvalidModal() {
        const modal = await this.modalController.create({
            component: IncompleteReviewModalComponent,
            cssClass: 'submit-invalid-modal'
        });
        return await modal.present();
    }

    // async openExitReviewModal() {

    //   const modal = await this.modalController.create({
    //       component: ExitReviewModalComponent,
    //       cssClass: 'exit-review-modal',
    //   });

    //   return await modal.present();
    // }

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
}
