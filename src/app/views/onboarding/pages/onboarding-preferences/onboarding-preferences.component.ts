import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../../services/data/data.service'

@Component({
    selector: 'app-onboarding-preferences',
    templateUrl: './onboarding-preferences.component.html',
    styleUrls: ['./onboarding-preferences.component.scss'],
})
export class OnboardingPreferencesComponent implements OnInit {
    @Input() progressValue: any;
    constructor(
        private router: Router,
        private dataService: DataService
    ) { }

    ngOnInit() {
        this.progressValue = this.dataService.getProgressStage();
    }

    next() {
        this.router.navigateByUrl('/onboarding/mealpreferences');
    }

}
