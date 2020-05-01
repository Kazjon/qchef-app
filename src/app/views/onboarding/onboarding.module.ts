import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingGetStartedPage } from './pages/onboarding-getstarted/onboarding-getstarted.page';
import { OnboardingPreferencesComponent } from './pages/onboarding-preferences/onboarding-preferences.component';
import { OnboardingMealPreferencesComponent } from './pages/onboarding-mealpreferences/onboarding-mealpreferences.component';


const routes: Routes = [
    {
        path: '', component: OnboardingGetStartedPage,
    },
    {
        path: 'getstarted', component: OnboardingGetStartedPage,
    },
    {
        path: 'preferences', component: OnboardingPreferencesComponent
    },
    {
        path: 'mealpreferences', component: OnboardingMealPreferencesComponent
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
        OnboardingGetStartedPage,
        OnboardingPreferencesComponent,
        OnboardingMealPreferencesComponent
    ]
})
export class OnboardingModule { }
