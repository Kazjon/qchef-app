import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardPage implements OnInit {
  imgSrcRoot = '../../../../../assets/images/'
  @Input() recipe = this.imgSrcRoot + 'icon-recipes.svg';
  @Input() shoppingList = this.imgSrcRoot + 'icon-shopping-list.svg';
  @Input() reviews = this.imgSrcRoot + 'icon-review.svg';

  constructor() { 
  }

  ngOnInit() {}

}
