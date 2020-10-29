import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { combineLatest, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MealSlot } from 'src/app/core/objects/MealSlot';
import { Router } from '@angular/router';
import { MealPlanSelectionResponse } from 'src/app/core/objects/MealPlanSelectionResponse';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

@Component({
    selector: 'app-mealselection-summary',
    templateUrl: './mealselection-summary.component.html',
    styleUrls: ['./mealselection-summary.component.scss'],
})
export class MealSelectionSummaryComponent implements OnInit {
    mealSlots: MealSlot[];
    actionLogSubscription: Subscription;
    actionLog: any;

    constructor(private dataService: DataService, private router: Router, private alertController: AlertController, private firebaseService: FirebaseService) { }

    ngOnInit() {

        this.actionLogSubscription = this.dataService.actionLogObservable.subscribe((res) => {
            this.actionLog = res;
        });

        combineLatest(
            this.dataService.mealSlotsObservable,
        ).pipe(
            take(4)
        )
            .subscribe(([mealSlots]) => {
                console.log(mealSlots);
                this.checkData(mealSlots);
            });


    }

    private checkData(mealSlots: MealSlot[]) {

        if (mealSlots.length <= 0) {
            this.dataService.getMealSlotsFromLocal();
        }
        else {
            this.initialiseMealSlots(mealSlots);
        }

    }

    private initialiseMealSlots(mealSlots: MealSlot[]) {
        this.mealSlots = mealSlots;
        console.log(this.mealSlots);
    }

    changeMeal(mealSlot: MealSlot) {
        this.router.navigateByUrl('/mealselection/meal/' + mealSlot.id + '/change');
    }

    setWeekStartDate() {
        let todayDate = new Date();
        this.dataService.setWeekStartDate(todayDate);
        this.saveMealSelection();
    }

    private saveMealSelection() {

        let picked: string[] = [];

        for (let i = 0; i < this.mealSlots.length; i++) {
            picked.push(this.mealSlots[i].recipe.id);
        }

        let uid = localStorage.getItem("userID");

        let selectedMealPlan: MealPlanSelectionResponse = {
            userID: uid,
            picked: picked,
            //action_log: [[1531351699745026893, "60372", "scrolled"], [1531351760359533025, "27455", "clicked"]]
            action_log: this.actionLog
        }

        // TODO: Have a loading spinner here to show that something's happening
        this.dataService.postMealPlanSelectionToServer(selectedMealPlan)
            .subscribe((res) => {
                console.log(res);
                this.goToNext();
            },
                (error) => {
                    if (error.error.text.includes('Authentication error')) {
                        this.showLogoutUserPop();
                    }
                });

    }

    private goToNext() {
        this.router.navigateByUrl('dashboard', { replaceUrl: true });
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
