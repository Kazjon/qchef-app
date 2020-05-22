import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardPage implements OnInit {
  imgSrcRoot = '../../../../../assets/images/'
  @Input() recipe = this.imgSrcRoot + 'icon-recipes.svg';
  @Input() recipeInactive = this.imgSrcRoot + 'icon-recipes-inactive.svg';
  @Input() shoppingList = this.imgSrcRoot + 'icon-shopping-list.svg';
  @Input() shoppingListInactive = this.imgSrcRoot + 'icon-shopping-list-inactive.svg';
  @Input() reviews = this.imgSrcRoot + 'icon-review.svg';
  @Input() reviewsInactive = this.imgSrcRoot + 'icon-review-inactive.svg';

  @Input() isRecipesActive: boolean = false;
  @Input() isShoppingListActive: boolean = false;
  @Input() isReviewsActive: boolean = false;

  constructor() { 
    this.isRecipesActive = true;
  }

  ngOnInit() {}

  changeTabs(tabName: string) {
    
    switch(tabName) {
      case 'recipes': 
          this.isRecipesActive = true;
          this.isShoppingListActive = false;
          this.isReviewsActive = false;
          break;
      case 'shoppinglist': 
          this.isRecipesActive = false;
          this.isShoppingListActive = true;
          this.isReviewsActive = false;
          break;
      case 'reviews': 
          this.isRecipesActive = false;
          this.isShoppingListActive = false;
          this.isReviewsActive = true;
          break;
    }
  }
}
