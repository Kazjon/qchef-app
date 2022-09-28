import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/services/data/data.service";
import { combineLatest } from "rxjs";
import { take } from "rxjs/operators";
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

        combineLatest(
            this.dataService.mealSlotsObservable,
            this.dataService.weekStartDateObservable
        )
            .pipe(take(3))
            .subscribe(([mealSlots, weekStartDate]) => {
                this.checkData(mealSlots, weekStartDate);
                this.checkIfWeekIsComplete(mealSlots, weekStartDate);
            });
    }

    private checkData(data, weekStartDate) {
        if (
            weekStartDate == undefined ||
            (isNaN(weekStartDate.getTime()) && data.length <= 0)
        ) {
            this.firebaseService.logout().then(() => {
                this.router.navigateByUrl("splash");
            });
        } else if (data.length <= 0 || data[0].recipe == undefined) {
            this.router.navigateByUrl("mealselection/summary", {
                replaceUrl: true,
            });
        } else {
            /** Side store: filter out meals stored in the side store as being reviewed */
            data = data.filter(
                (meal) => !this.sideStoreService.getMealSlot(meal, true)
            );
            this.mealSlots = data;
        }
    }

    private checkIfWeekIsComplete(mealSlots, weekStartDate: Date) {
        let reviewedMeal = 0;
        mealSlots.forEach((mealSlot) => {
            if (mealSlot.reviewed == true) {
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
}
