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

@Component({
    selector: 'app-onboarding-complete',
    templateUrl: './onboarding-complete.component.html',
    styleUrls: ['./onboarding-complete.component.scss'],
})
export class OnboardingCompleteComponent implements OnInit {
    mealsPerWeekSubscription: Subscription;
    mealsPerWeek: MealsPerWeekResponse;
    mealSlots: MealSlot[] = [];
    imgSrc: string;

    constructor(private router: Router, private dataService: DataService, private dataHandlingService: DataHandlingService, private alertController: AlertController, private firebaseService: FirebaseService) {
        this.imgSrc = "../../../assets/images/splash.svg";
    }

    ngOnInit() {

        // Get how many meals per week the user has selected
        this.mealsPerWeekSubscription = this.dataService.mealsPerWeekObservable.subscribe((res) => {

            this.mealsPerWeek = res;

            // Pull down all recommended meals from the server then create meal slots
            this.dataService.getMealPlanSelectionFromServer(this.mealsPerWeek).subscribe((res) => {
                this.dataHandlingService.handleMealPreferenceData(res)
                    .then((organisedData: MealPreference[]) => {
                        this.dataService.setRecommendedMeals(organisedData);
                    });
                this.createMealSlots();
            },
            (error) => {
                if (error.error.text.includes('Authentication error')) {
                    this.showLogoutUserPop();
                }
            });

        });

    }

    private createMealSlots() {

        for (let i = 0; i < this.mealsPerWeek.number_of_recipes; i++) {
            let mealSlot: MealSlot = {
                id: (i + 1),
                selected: false,
                reviewed: false,
                active: false
            }
            this.mealSlots.push(mealSlot);
        }

        this.dataService.setMealSlots(this.mealSlots);

        this.goToMealSelection();

    }

    private goToMealSelection() {
        let arbitraryTimeout = setTimeout(() => {
            this.router.navigateByUrl("/mealselection/summary");
            //this.router.navigateByUrl("/mealselection/meal/1");
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
