import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Plugins, CameraResultType, CameraSource, LocalNotificationScheduleResult } from "@capacitor/core";
import { ActionSheetController, ModalController, AlertController } from "@ionic/angular";
import { combineLatest } from "rxjs";
import { take } from "rxjs/operators";
import { DataService } from "src/app/services/data/data.service";
import { MealSlot } from "src/app/core/objects/MealSlot";
import { IncompleteReviewModalComponent } from "src/app/core/components/incompletereviewmodal/incompletereviewmodal.component";
import { RecipeReviewResponse } from "src/app/core/objects/RecipeReviewResponse";
import { FirebaseService } from "src/app/services/firebase/firebase.service";
import { SideStoreDataService } from "../../../../services/data/side-store.service";
// import { ExitReviewModalComponent } from 'src/app/core/components/exitreviewmodal/exitreviewmodal.component';

@Component({
   selector: "app-reviews-form",
   templateUrl: "./reviews-form.component.html",
   styleUrls: ["./reviews-form.component.scss"],
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
      option3Selected: false,
   };
   enjoy = {
      option1Selected: false,
      option2Selected: false,
      option3Selected: false,
   };
   tryAgain = {
      option1Selected: false,
      option2Selected: false,
      option3Selected: false,
   };

   photo: SafeResourceUrl;
   buttonLabel: string = "ADD PHOTO";

   constructor(
      public actionSheetController: ActionSheetController,
      private dataService: DataService,
      private formBuilder: FormBuilder,
      private modalController: ModalController,
      private sanitizer: DomSanitizer,
      private route: ActivatedRoute,
      private router: Router,
      private alertController: AlertController,
      private firebaseService: FirebaseService,
      private sideStoreService: SideStoreDataService
   ) {}

   ngOnInit() {
      this.dataService.getMealSlotsFromLocal();
      this.dataService.getWeekStartDateFromLocal();

      combineLatest(this.dataService.mealSlotsObservable)
         .pipe(take(2))
         .subscribe(([mealSlots]) => {
            this.checkData(mealSlots);
         });

      this.route.paramMap.subscribe((paramMap) => {
         this.id = paramMap.get("id");
      });

      this.getMealTitle();

      this.reviewForm = this.formBuilder.group({
         reason: ["", [Validators.required]],
         feeling: ["", [Validators.required]],
         taste: ["", [Validators.required]],
         enjoy: ["", [Validators.required]],
         tryAgain: ["", [Validators.required]],
      });
   }

   ionViewWillEnter() {
      console.log("WILL ENTER");
      this.formSubmitted = false;
   }

   private checkData(data) {
      if (data.length <= 0 || data[0].recipe == undefined) {
         this.router.navigateByUrl("mealselection/meal/1", { replaceUrl: true });
      } else {
         this.mealSlots = data;
      }
   }

   private getMealTitle() {
      this.mealSlots.forEach((element) => {
         if (element.recipe.id == this.id) this.mealTitle = element.recipe.title;
      });
   }

   updateTaste(optionSelected) {
      this.taste.option1Selected = false;
      this.taste.option2Selected = false;
      this.taste.option3Selected = false;

      switch (optionSelected) {
         case "0":
            this.taste.option1Selected = true;
            this.reviewForm.controls.taste.setValue("0");
            break;
         case "1":
            this.taste.option2Selected = true;
            this.reviewForm.controls.taste.setValue("1");
            break;
         case "2":
            this.taste.option3Selected = true;
            this.reviewForm.controls.taste.setValue("2");
            break;
         default:
            break;
      }
   }

   updateEnjoy(optionSelected) {
      this.enjoy.option1Selected = false;
      this.enjoy.option2Selected = false;
      this.enjoy.option3Selected = false;

      switch (optionSelected) {
         case "0":
            this.enjoy.option1Selected = true;
            this.reviewForm.controls.enjoy.setValue("0");
            break;
         case "1":
            this.enjoy.option2Selected = true;
            this.reviewForm.controls.enjoy.setValue("1");
            break;
         case "2":
            this.enjoy.option3Selected = true;
            this.reviewForm.controls.enjoy.setValue("2");
            break;
         default:
            break;
      }
   }

   updateTryAgain(optionSelected) {
      this.tryAgain.option1Selected = false;
      this.tryAgain.option2Selected = false;
      this.tryAgain.option3Selected = false;

      switch (optionSelected) {
         case "0":
            this.tryAgain.option1Selected = true;
            this.reviewForm.controls.tryAgain.setValue("0");
            break;
         case "1":
            this.tryAgain.option2Selected = true;
            this.reviewForm.controls.tryAgain.setValue("1");
            break;
         case "2":
            this.tryAgain.option3Selected = true;
            this.reviewForm.controls.tryAgain.setValue("2");
            break;
         default:
            break;
      }
   }

   submitReview() {
      this.formSubmitted = true;

      let recipeReviewResponse: RecipeReviewResponse = {
         cook_ratings: {},
         taste_ratings: {},
         familiarity_ratings: {},
         why_response: {},
         how_response: {},
         image: {},
      };

      recipeReviewResponse.cook_ratings[this.id] = parseInt(this.reviewForm.controls.tryAgain.value);
      recipeReviewResponse.taste_ratings[this.id] = parseInt(this.reviewForm.controls.enjoy.value);
      recipeReviewResponse.familiarity_ratings[this.id] = parseInt(this.reviewForm.controls.taste.value);
      recipeReviewResponse.why_response[this.id] = this.reviewForm.controls.reason.value;
      recipeReviewResponse.how_response[this.id] = this.reviewForm.controls.feeling.value;
      recipeReviewResponse.image[this.id] = this.photoBase64;

      // taste = familiarity_rating
      // enjoy = taste_rating
      // tryAgain = cook_rating
      // reason = why
      // feeling = how

      const subscription = this.dataService.postRecipeReviewToServer(recipeReviewResponse).subscribe(
         (res) => {
            this.mealSlots.forEach((element) => {
               if (element.recipe.id == this.id) element.reviewed = true;
               this.dataService.saveMealSlotsToLocal(this.mealSlots);
               this.dataService.setTotalMealsNotReviewed();
               this.router.navigateByUrl("dashboard/reviews", { replaceUrl: true });
               this.formSubmitted = false;

               /** Side Store: also store reviewed status */
               if (element.recipe.id == this.id) {
                  this.sideStoreService.saveMealReview(element);
               }
            });

            this.dataService.clearReviewSubscription();
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

      this.dataService.saveReviewSubscription(subscription);
   }

   async takePhoto(type: string) {
      let source: any;
      if (type == "camera") {
         source = CameraSource.Camera;
      } else if (type == "photo") {
         source = CameraSource.Photos;
      }

      const image = await Plugins.Camera.getPhoto({
         quality: 100,
         allowEditing: false,
         resultType: CameraResultType.DataUrl,
         source: source,
      });

      // Check and resize the image
      function getImageDimensions(file) {
         return new Promise(function (resolved, rejected) {
            var i = new Image();
            i.onload = function () {
               resolved({ w: i.width, h: i.height });
            };
            i.src = file;
         });
      }

      function resizeViaCanvas(dataURI, originalDimensions: any) {
         const quality = 0.7;
         const maxDimension = 800;
         let finalWidth: number;
         let finalHeight: number;
         if (originalDimensions.w > originalDimensions.h) {
            finalWidth = maxDimension;
            finalHeight = (finalWidth / dimensions.w) * dimensions.h;
         } else {
            finalHeight = maxDimension;
            finalWidth = (finalHeight / dimensions.h) * dimensions.w;
         }

         return new Promise(function (resolve, reject) {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            var img = document.createElement("img");
            img.onload = async function () {
               canvas.width = finalWidth;
               canvas.height = finalHeight;
               await ctx!.drawImage(img, 0, 0, finalWidth, finalHeight);
               var dataURI = await canvas.toDataURL("image/jpeg", quality);
               resolve(dataURI);
            };
            img.src = dataURI;
         });
      }

      // Resize the image and set quality level
      var dimensions: any = await getImageDimensions(image.dataUrl);
      var resized: any = await resizeViaCanvas(image.dataUrl, dimensions);

      // Set and finish
      this.photoBase64 = image.dataUrl;
      //this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
      this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(resized);
      if (this.photo) {
         this.buttonLabel = "REPLACE IMAGE";
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
         header: "Albums",
         cssClass: "my-custom-class",
         buttons: [
            {
               text: "Camera",
               handler: () => {
                  this.takePhoto("camera");
               },
            },
            {
               text: "Gallery",
               handler: () => {
                  this.takePhoto("photo");
               },
            },
            {
               text: "Cancel",
               role: "cancel",
               handler: () => {
                  console.log("Cancel clicked");
               },
            },
         ],
      });
      await actionSheet.present();
   }

   async openSubmissionInvalidModal() {
      const modal = await this.modalController.create({
         component: IncompleteReviewModalComponent,
         cssClass: "submit-invalid-modal",
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
}
