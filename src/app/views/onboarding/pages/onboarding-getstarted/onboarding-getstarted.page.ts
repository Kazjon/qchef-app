import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-onboarding-getstarted',
	templateUrl: './onboarding-getstarted.page.html',
	styleUrls: ['./onboarding-getstarted.page.scss'],
})
export class OnboardingGetStartedPage implements OnInit {

	constructor(private router: Router) { }

	ngOnInit() {
	}

	getStarted() {
		this.router.navigateByUrl('/onboarding/preferences');
	}

}
