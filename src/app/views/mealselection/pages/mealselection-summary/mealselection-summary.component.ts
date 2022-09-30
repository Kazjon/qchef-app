import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/services/data/data.service";
import { combineLatest, Subscription } from "rxjs";
import { take } from "rxjs/operators";
import { MealSlot } from "src/app/core/objects/MealSlot";
import { Router } from "@angular/router";
import { MealPlanSelectionResponse } from "src/app/core/objects/MealPlanSelectionResponse";
import { AlertController, ModalController } from "@ionic/angular";
import { FirebaseService } from "src/app/services/firebase/firebase.service";
import { MealPreference } from "src/app/core/objects/MealPreference";
import { IngredientmodalComponent } from "src/app/core/components/ingredientmodal/ingredientmodal.component";
import { SideStoreDataService } from "src/app/services/data/side-store.service";

@Component({
  selector: "app-mealselection-summary",
  templateUrl: "./mealselection-summary.component.html",
  styleUrls: ["./mealselection-summary.component.scss"],
})
export class MealSelectionSummaryComponent implements OnInit {
  isLoading: boolean = false;
  mealSlots: MealSlot[];
  actionLogSubscription: Subscription;
  actionLog: any;
  isAllMealSelected: boolean = false;
  imgSrc: string = "../../../assets/images/splash.svg";

  constructor(
    private dataService: DataService,
    private router: Router,
    private alertController: AlertController,
    private firebaseService: FirebaseService,
    public modalController: ModalController,
    private sideStoreService: SideStoreDataService
  ) {}

  ngOnInit() {
    this.actionLogSubscription = this.dataService.actionLogObservable.subscribe((res) => {
      this.actionLog = res;
    });

    combineLatest(this.dataService.mealSlotsObservable)
      .pipe(take(4))
      .subscribe(([mealSlots]) => {
        this.checkData(mealSlots);
      });
  }

  ionViewWillEnter() {
    this.isAllMealOptionSelected();
  }

  private checkData(mealSlots: MealSlot[]) {
    if (mealSlots.length <= 0) {
      this.dataService.getMealSlotsFromLocal();
    } else {
      this.initialiseMealSlots(mealSlots);
    }
  }

  private initialiseMealSlots(mealSlots: MealSlot[]) {
    this.mealSlots = mealSlots;
  }

  changeMeal(mealSlot: MealSlot) {
    this.router.navigateByUrl("/mealselection/meal/" + mealSlot.id + "/change");
  }

  setWeekStartDate() {
    this.isLoading = true;
    let todayDate = new Date();
    this.dataService.setWeekStartDate(todayDate);
    this.saveMealSelection();
  }

  resetSideStore() {
    this.sideStoreService.clearMealStates();
    this.sideStoreService.setSideStoreMealPlanStartDate();
  }

  private saveMealSelection() {
    let picked: string[] = [];

    this.sideStoreService.saveMeals(this.mealSlots); // Side Store

    for (let i = 0; i < this.mealSlots.length; i++) {
      picked.push(this.mealSlots[i].recipe.id);
    }

    let uid = localStorage.getItem("userID");

    let selectedMealPlan: MealPlanSelectionResponse = {
      userID: uid,
      picked: picked,
      //action_log: [[1531351699745026893, "60372", "scrolled"], [1531351760359533025, "27455", "clicked"]]
      action_log: this.actionLog,
    };

    this.dataService.postMealPlanSelectionToServer(selectedMealPlan).subscribe(
      (res) => {
        this.isLoading = false;
        this.goToNext();
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

  private isAllMealOptionSelected() {
    var selectedMealNum = 0;
    this.mealSlots.forEach((meal) => {
      if (meal.selected == true) selectedMealNum++;
    });

    this.isAllMealSelected = this.mealSlots.length == selectedMealNum;
  }

  private goToNext() {
    this.router.navigateByUrl("dashboard", { replaceUrl: true });
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

  async openIngredients(recipe: MealPreference) {
    const modal = await this.modalController.create({
      component: IngredientmodalComponent,
      cssClass: "ingredient-modal",
      componentProps: {
        recipe: recipe,
      },
    });
    return await modal.present();
  }
}
