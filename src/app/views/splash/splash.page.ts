import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { DataHandlingService } from 'src/app/services/datahandling/datahandling.service';
import { MealSlot } from 'src/app/core/objects/MealSlot';
import { MenuController } from '@ionic/angular';

@Component({
	selector: 'app-splash',
	templateUrl: './splash.page.html',
	styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
	imgSrc: String;

	constructor(
		private firebaseService: FirebaseService, 
		private router: Router, 
		private dataService: DataService, 
		private dataHandlingService: DataHandlingService,
		private menu: MenuController
	) {
		this.imgSrc = "../../../assets/images/splash.svg"
	}

	ngOnInit() {
	}

	ionViewWillEnter() {
		this.checkUserAuthentication();
	}

	checkUserAuthentication() {
			console.log('checkUserAuthentication')
	 
			this.firebaseService.isUserAuthenticated()
				.then((res) => {
					console.log('isUserAuthenticated ', res)
					this.getSelectedMealPlan();
				})
				.catch((e) => {
					console.log(e);
					// if(this.menu) {
						this.menu.close();
					// }
					this.router.navigateByUrl('login', { replaceUrl: true });
				});
	}

	private getSelectedMealPlan() {
		this.dataService.getSelectedMealPlanFromServer().subscribe((res) => {
			this.dataHandlingService.handleMealSlotData(res)
				.then((res: MealSlot[]) => {
					this.dataService.setMealSlots(res);
					let timeout = setTimeout(() => { 
						this.router.navigateByUrl('dashboard/recipes', { replaceUrl: true });
						clearTimeout(timeout);
					}, 1500);
				});
		},
			(exception) => {
				// need to check if server return 'Unable to authenticate'
				if (exception && exception.error && typeof (exception.error) == "string") {
					const strRes = <string>exception.error;
					if (strRes.includes('Unable to authenticate')) {
					 
						this.firebaseService.logoutUserFromApp().then(() => {
							this.router.navigateByUrl('login', { replaceUrl: true });

						});
					}
				}
			});

	}

}
