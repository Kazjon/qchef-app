import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MealSelectionSelectMealComponent } from './pages/mealselection-selectmeal/mealselection-selectmeal.component';


const routes: Routes = [
    {
        path: '', component: MealSelectionSelectMealComponent,
    },
    {
        path: 'meal/:mealslot', component: MealSelectionSelectMealComponent,
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
        MealSelectionSelectMealComponent
    ]
})
export class MealSelectionModule { }
