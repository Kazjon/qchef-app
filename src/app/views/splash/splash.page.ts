import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';

@Component({
	selector: 'app-splash',
	templateUrl: './splash.page.html',
	styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
	imgSrc: String;

	constructor(private firebaseService: FirebaseService, private router: Router,  private dataService: DataService) {
		this.imgSrc = "../../../assets/images/splash.svg"
	}

	ngOnInit() {
		this.checkUserAuthentication();
	}

	checkUserAuthentication() {

		let timeout = setTimeout(() => {
			this.firebaseService.isUserAuthenticated()
				.then(() => {

					let stage = this.dataService.getOnboardingStage();
					let localMealSlotsString = localStorage.getItem("localMealSlots");

					if (stage == "begin" || localMealSlotsString == undefined && localMealSlotsString == "undefined") {
						this.router.navigateByUrl('onboarding', { replaceUrl: true });
					}
					else {
						this.router.navigateByUrl('dashboard/recipes', { replaceUrl: true });
					}

				})
				.catch(() => {
					this.router.navigateByUrl('login', { replaceUrl: true });
				});
			clearTimeout(timeout);
		}, 1500);

	}

}
