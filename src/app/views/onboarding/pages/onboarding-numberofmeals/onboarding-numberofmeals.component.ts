import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MealsPerWeekResponse } from  '../../../../core/objects/MealsPerWeekResponse';
import { DataService } from 'src/app/services/data/data.service';

@Component({
    selector: 'app-onboarding-numberofmeals',
    templateUrl: './onboarding-numberofmeals.component.html',
    styleUrls: ['./onboarding-numberofmeals.component.scss'],
})
export class OnboardingNumberOfMealsComponent implements OnInit {
    mealsPerWeekResponse: MealsPerWeekResponse;

    constructor(private router: Router, private dataService: DataService) { }

    ngOnInit() {
        this.setMealsPerWeekResponse(3);
    }

    next() {
        this.dataService.setMealsPerWeek(this.mealsPerWeekResponse);
        this.router.navigateByUrl("/onboarding/complete");
    }

    setMealsPerWeekResponse(meals: number) {
        this.mealsPerWeekResponse = {
            mealsPerWeek: meals
        }
    }

}
