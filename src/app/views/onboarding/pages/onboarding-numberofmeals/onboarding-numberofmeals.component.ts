import { Component, OnInit, Input } from '@angular/core';
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
    percentage: any;
    numberOfMeals: number = 0;

    @Input() progressValue: any;
    @Input() iconMinus: string;
    @Input() iconPlus: string;

    constructor(private router: Router, private dataService: DataService) { }

    ngOnInit() {
        this.setMealsPerWeekResponse(3);
        this.progressValue = this.dataService.getProgressStage();
        this.percentage = (this.progressValue * 100).toFixed(0);
        this.iconMinus = '../../../assets/images/icon-minus.svg';
        this.iconPlus = '../../../assets/images/icon-plus.svg';
    }

    next() {
        this.setMealsPerWeekResponse(this.numberOfMeals);
        this.dataService.setMealsPerWeek(this.mealsPerWeekResponse);
        this.router.navigateByUrl("/onboarding/complete");
    }

    setMealsPerWeekResponse(meals: number) {
        this.mealsPerWeekResponse = {
            mealsPerWeek: meals
        }
    }

    setNumberOfMeals(type: string) {
        if (type == 'minus') {
            if (this.numberOfMeals > 0)
                --this.numberOfMeals; 
        } else if (type == 'plus') {
            ++this.numberOfMeals;
        }
    }
}
