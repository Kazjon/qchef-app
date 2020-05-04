import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    selector: 'app-onboarding-preferences',
    templateUrl: './onboarding-preferences.component.html',
    styleUrls: ['./onboarding-preferences.component.scss'],
})
export class OnboardingPreferencesComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() { }

    next() {
        this.router.navigateByUrl('/onboarding/mealpreferences');
    }

}
