import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardPage implements OnInit {
	imgSrcRoot = '../../../../../assets/images/'
	notReviewedNum: number;
	totalMealsNotReviewedSubscription: Subscription;

	@Input() recipe = this.imgSrcRoot + 'icon-recipes.svg';
	@Input() shoppingList = this.imgSrcRoot + 'icon-shopping-list.svg';
	@Input() reviews = this.imgSrcRoot + 'icon-review.svg';

	constructor(private dataService: DataService) {
		this.notReviewedNum = 0
	}

	ngOnInit() {		
	}

	ionViewWillEnter() {
		this.dataService.setTotalMealsNotReviewed();

		this.totalMealsNotReviewedSubscription = this.dataService.totalMealsNotReviewedObservable.subscribe((res) => {
			this.notReviewedNum = res;
		});
	}

}
