import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-onboarding-complete',
    templateUrl: './onboarding-complete.component.html',
    styleUrls: ['./onboarding-complete.component.scss'],
})
export class OnboardingCompleteComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {

        // here we'll pull down their meal options for the week

        let timeout = setTimeout(() => {
            this.router.navigateByUrl("/mealselection/meal/1");
            clearTimeout(timeout);
        }, 1000);


    }

}
