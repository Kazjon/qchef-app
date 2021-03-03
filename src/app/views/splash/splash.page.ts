import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { DataHandlingService } from 'src/app/services/datahandling/datahandling.service';
import { MealSlot } from 'src/app/core/objects/MealSlot';

@Component({
	selector: 'app-splash',
	templateUrl: './splash.page.html',
	styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
	imgSrc: String;

	constructor(private firebaseService: FirebaseService, private router: Router,  private dataService: DataService, private dataHandlingService: DataHandlingService) {
		this.imgSrc = "../../../assets/images/splash.svg"
	}

	ngOnInit() {
		this.checkUserAuthentication();
	}

	checkUserAuthentication() {

		let timeout = setTimeout(() => {
			this.firebaseService.isUserAuthenticated()
				.then(() => {
					this.getSelectedMealPlan();
					this.router.navigateByUrl('dashboard/recipes', { replaceUrl: true });
				})
				.catch(() => {
					this.router.navigateByUrl('login', { replaceUrl: true });
				});
			clearTimeout(timeout);
		}, 1500);

	}

	private getSelectedMealPlan() {
        this.dataService.getSelectedMealPlanFromServer().subscribe((res) => {
            this.dataHandlingService.handleMealSlotData(res)
                .then((res: MealSlot[]) => {
                    this.dataService.setMealSlots(res);
                });
        },
        (error) => {
			console.log(error);
			this.router.navigateByUrl('login', { replaceUrl: true });
        });

    }

}
