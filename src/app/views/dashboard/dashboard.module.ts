import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RecipesPage } from './pages/recipes/recipes.component';
import { ShoppingListPage } from './pages/shoppinglist/shoppinglist.component';
import { ReviewsPage } from './pages/reviews/reviews.component';
import { DashboardPage } from './pages/dashboard/dashboard.component';


const routes: Routes = [
    {
        path: '',
        component: DashboardPage,
        children: [
            {
                path: 'recipes',
                children: [
                    {
                        path: '',
                        component: RecipesPage
                    }
                ]
            },
            {
                path: 'shoppinglist',
                children: [
                    {
                        path: '',
                        component: ShoppingListPage
                    }
                ]
            },
            {
                path: 'reviews',
                children: [
                    {
                        path: '',
                        component: ReviewsPage
                    }
                ]
            },
            {
                path: '',
                redirectTo: 'recipes',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        RecipesPage,
        ShoppingListPage,
        ReviewsPage,
        DashboardPage
    ]
})
export class DashboardModule { }
