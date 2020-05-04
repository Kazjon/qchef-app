import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MealsPerWeekResponse } from  '../../../../core/objects/MealsPerWeekResponse';

@Component({
    selector: 'app-onboarding-numberofmeals',
    templateUrl: './onboarding-numberofmeals.component.html',
    styleUrls: ['./onboarding-numberofmeals.component.scss'],
})
export class OnboardingNumberOfMealsComponent implements OnInit {
    mealsPerWeekResponse: MealsPerWeekResponse;

    constructor(private router: Router) { }

    ngOnInit() { }

    next() {
        this.router.navigateByUrl("/onboarding/complete");
    }

}
