import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MealSelectionSelectMealComponent } from './pages/mealselection-selectmeal/mealselection-selectmeal.component';
import { MealSlotComponent } from '../../core/components/mealslot/mealslot.component';
import { MealSelectionSummaryComponent } from './pages/mealselection-summary/mealselection-summary.component';
import { AuthGuardService as AuthGuard } from '../../services/auth-guard/auth-guard.service';


const routes: Routes = [
    {
        path: '', component: MealSelectionSelectMealComponent,
		canActivate: [AuthGuard]
    },
    {
        path: 'meal/:mealslot', component: MealSelectionSelectMealComponent,
		canActivate: [AuthGuard]
    },
    {
        path: 'summary', component: MealSelectionSummaryComponent,
		canActivate: [AuthGuard]
    },
    {
        path: 'meal/:mealslot/change', component: MealSelectionSelectMealComponent,
		canActivate: [AuthGuard]
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
        MealSlotComponent
    ],
    entryComponents: [
    ]
})
export class MealSelectionModule { }
