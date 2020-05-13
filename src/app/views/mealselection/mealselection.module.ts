import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MealSelectionSelectMealComponent } from './pages/mealselection-selectmeal/mealselection-selectmeal.component';
import { RecipeModalComponent } from 'src/app/core/components/recipemodal/recipemodal.component';
import { MealSlotComponent } from '../../core/components/mealslot/mealslot.component';
import { MealSelectionSummaryComponent } from './pages/mealselection-summary/mealselection-summary.component';


const routes: Routes = [
    {
        path: '', component: MealSelectionSelectMealComponent,
    },
    {
        path: 'meal/:mealslot', component: MealSelectionSelectMealComponent,
    },
    {
        path: 'summary', component: MealSelectionSummaryComponent
    },
    {
        path: 'meal/:mealslot/change', component: MealSelectionSelectMealComponent
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
        MealSelectionSelectMealComponent,
        MealSelectionSummaryComponent,
        RecipeModalComponent,
        MealSlotComponent
    ],
    entryComponents: [
        RecipeModalComponent
    ]
})
export class MealSelectionModule { }
