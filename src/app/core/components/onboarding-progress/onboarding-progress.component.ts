import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data/data.service';

@Component({
    selector: 'onboarding-progress',
    templateUrl: './onboarding-progress.component.html',
    styleUrls: ['./onboarding-progress.component.scss'],
})
export class OnboardingProgressComponent implements OnInit {
    @Input() showOverall: boolean;
    totalProgressSubscription: Subscription;
    totalProgress: Object[];
    overallProgress: number = 0;

    constructor(private dataService: DataService) { }

    ngOnInit() {

        this.totalProgressSubscription = this.dataService.totalProgressObservable.subscribe((res) => {
            let totalItems = 0;
            let totalItemCount = 0;
            for (let i = 0; i < res.length; i++) {
                totalItems = totalItems + (res[i] as any).total;
                totalItemCount = totalItemCount + (res[i] as any).count;
            }

            let overallProgress = (totalItemCount / totalItems) * 100;
            this.overallProgress = Math.floor(overallProgress);
            this.totalProgress = res;
        });

    }

}
