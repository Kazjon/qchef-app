import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { Subscription } from 'rxjs';
import { MealsPerWeekResponse } from 'src/app/core/objects/MealsPerWeekResponse';
import { MealSlot } from 'src/app/core/objects/MealSlot';
import { DataHandlingService } from 'src/app/services/datahandling/datahandling.service';
import { MealPreference } from 'src/app/core/objects/MealPreference';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { ErrorService } from 'src/app/services/error/error.service';

@Component({
    selector: 'app-onboarding-loadingscreen',
    templateUrl: './onboarding-loadingscreen.component.html',
    styleUrls: ['./onboarding-loadingscreen.component.scss'],
})
export class OnboardingLoadingScreenComponent implements OnInit {
    mealsPerWeekSubscription: Subscription;
    mealsPerWeek: MealsPerWeekResponse;
    mealSlots: MealSlot[] = [];
    imgSrc: string;

    constructor(
        private router: Router,
        private dataService: DataService,
        private dataHandlingService: DataHandlingService,
        private alertController: AlertController,
        private firebaseService: FirebaseService,
        private errorService: ErrorService) {
        this.imgSrc = "../../../assets/images/splash.svg";
    }

    ngOnInit() {
        //this.goToMealSelection();
        let ingredientPrefs = localStorage.getItem("ingredientPrefs");

        this.dataService.postIngredientRatingsToServer(JSON.parse(ingredientPrefs))
            .subscribe((res) => {
                console.log('post ingredirent', res);
                this.dataHandlingService.handleMealPreferenceData(res)
                .then((organisedData: MealPreference[]) => {
                    this.dataService.saveSurprisePreferencesToLocal(organisedData);
                    this.goToMealSelection();
                });

            },
            (error) => {
                console.log(error);
                if (error.error.text && error.error.text.includes('Authentication error')) {
                    this.showLogoutUserPop();
                }
                else {
                    this.errorService.showGenericError(error.statusText);
                }
            });
    }

    ionViewWillEnter() {
        console.log('loading');
    }

    private createMealSlots() {

        for (let i = 0; i < this.mealsPerWeek.number_of_recipes; i++) {
            let mealSlot: MealSlot = {
                id: (i + 1),
                selected: false,
                active: false,
                reviewed: false
            }
            this.mealSlots.push(mealSlot);
        }

        this.dataService.setMealSlots(this.mealSlots);

        this.goToMealSelection();

    }

    private goToMealSelection() {
        let arbitraryTimeout = setTimeout(() => {
            this.router.navigateByUrl("/onboarding/surprisepreferences");
            clearTimeout(arbitraryTimeout);
        }, 2000);
    }

    ngOnDestroy() {
        this.mealsPerWeekSubscription.unsubscribe();
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

}
