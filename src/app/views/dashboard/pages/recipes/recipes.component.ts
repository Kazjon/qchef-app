import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/services/data/data.service";
import { combineLatest } from "rxjs";
import { take } from "rxjs/operators";
import { ConfirmmodalComponent } from "../../../../core/components/confirmmodal/confirmmodal.component";
import { MealSlot } from "src/app/core/objects/MealSlot";
import { MealPreference } from "src/app/core/objects/MealPreference";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { RecipeModalComponent } from "src/app/core/components/recipemodal/recipemodal.component";
import { FirebaseService } from "src/app/services/firebase/firebase.service";
import { SideStoreDataService } from "src/app/services/data/side-store.service";

@Component({
  selector: "app-recipes",
  templateUrl: "./recipes.component.html",
  styleUrls: ["./recipes.component.scss"],
})
export class RecipesPage implements OnInit {
  mealSlots: MealSlot[];
  isLoading: boolean = true;
  isNewWeek: boolean = false;
  isCompleted: boolean = false;

  consideredRemovalMealSlot: MealSlot;

  constructor(
    private dataService: DataService,
    private firebaseService: FirebaseService,
    private router: Router,
    private modalController: ModalController,
    private sideStoreService: SideStoreDataService
  ) {}

  ngOnInit() {
    this.dataService.setOnboardingStage("dashboard");
    this.dataService.getMealSlotsFromLocal();
    this.dataService.getWeekStartDateFromLocal();
  }

  ionViewWillEnter() {
    this.dataService.getMealSlotsFromLocal();
    this.dataService.getWeekStartDateFromLocal();

    combineLatest(this.dataService.mealSlotsObservable, this.dataService.weekStartDateObservable)
      .pipe(take(3))
      .subscribe(([mealSlots, weekStartDate]) => {
        this.checkData(mealSlots, weekStartDate);
        this.checkIfWeekIsComplete(mealSlots, weekStartDate);
      });
  }

  private checkData(data, weekStartDate) {
    if (weekStartDate == undefined || (isNaN(weekStartDate.getTime()) && data.length <= 0)) {
      this.firebaseService.logout().then(() => {
        this.router.navigateByUrl("splash");
      });
    } else if (data.length <= 0 || data[0].recipe == undefined) {
      this.router.navigateByUrl("mealselection/summary", {
        replaceUrl: true,
      });
    } else {
      /** Side store: filter out meals stored in the side store as being reviewed */
      this.sideStoreService.saveMeals(data);
      data = data.filter((meal) => !this.sideStoreService.getMealSlot(meal, true));

      this.mealSlots = data;
    }
  }

  private checkIfWeekIsComplete(mealSlots, weekStartDate: Date) {
    let reviewedMeal = 0;
    mealSlots.forEach((mealSlot) => {
      /** Side store: filter out meals stored in the side store as being reviewed */
      const wasReviewedSideStore = this.sideStoreService.getMealSlot(mealSlot, true);

      if (mealSlot.reviewed == true || wasReviewedSideStore) {
        reviewedMeal++;
      }
    });

    if (mealSlots && reviewedMeal == mealSlots.length) {
      this.isCompleted = true;
      this.isLoading = false;
    } else {
      this.isCompleted = false;
      this.isLoading = false;
    }

    // console.log(weekStartDate);
    // let startDate = weekStartDate;

    // if (isNaN(weekStartDate.getTime())) {
    //     startDate = new Date();
    // }

    // let todayDate = new Date();

    // let daysBetweenDates = this.getDaysBetweenDates(startDate, todayDate);

    // if (daysBetweenDates >= 7) {
    //     this.isNewWeek = true;
    //     this.isLoading = false;
    // }
    // else {
    //     this.isNewWeek = false;
    //     this.isLoading = false;
    // }
  }

  private getDaysBetweenDates(dateOne: Date, dateTwo: Date) {
    let differenceInTime = dateTwo.getTime() - dateOne.getTime();
    let differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays;
  }

  startWeeklyFlow() {
    localStorage.removeItem("localMealSlots");
    localStorage.removeItem("localWeekStartDate");
    this.router.navigateByUrl("onboarding/numberofmeals", {
      replaceUrl: true,
    });
  }

  async openRecipe(recipe: MealPreference) {
    const modal = await this.modalController.create({
      component: RecipeModalComponent,
      cssClass: "recipe-modal",
      componentProps: {
        recipe: recipe,
        showReview: true,
      },
    });
    return await modal.present();
  }

  addMoreMeals() {
    console.log("Add more meals");
    this.router.navigateByUrl("onboarding/numberofmeals/add", {
      replaceUrl: true,
    });
    //get_meal_plan_selection
  }

  async removeMeal(mealSlot: MealSlot) {
    console.log("Meal Slot:", mealSlot);
    this.consideredRemovalMealSlot = mealSlot;

    const modal = await this.modalController.create({
      component: ConfirmmodalComponent,
      cssClass: "confirm-modal",
      componentProps: {
        title: "Remove Meal",
        description: ["Are you sure you wish to remove this meal from your meal plan?"],
        confirmCallback: this.confirmRemoveMeal.bind(this),
      },
    });
    return await modal.present();
  }

  confirmRemoveMeal() {
    console.log("Confrm removing", this.consideredRemovalMealSlot, this);
    this.dataService.removeMealSlot(this.consideredRemovalMealSlot);
  }

  //get_meal_plan_selection
  //save_meal_plan
}
