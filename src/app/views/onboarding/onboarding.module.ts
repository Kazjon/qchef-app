import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingGetStartedPage } from './pages/onboarding-getstarted/onboarding-getstarted.page';
import { OnboardingPreferencesComponent } from './pages/onboarding-preferences/onboarding-preferences.component';
import { OnboardingMealPreferencesComponent } from './pages/onboarding-mealpreferences/onboarding-mealpreferences.component';
import { OnboardingIngredientPreferencesComponent } from './pages/onboarding-ingredientpreferences/onboarding-ingredientpreferences.component';
import { OnboardingNumberOfMealsComponent } from './pages/onboarding-numberofmeals/onboarding-numberofmeals.component';
import { OnboardingCompleteComponent } from './pages/onboarding-complete/onboarding-complete.component';
import { OnboardingLoadingScreenComponent } from './pages/onboarding-loadingscreen/onboarding-loadingscreen.component';
import { OnboardingSurprisePreferencesComponent } from './pages/onboarding-surprisepreferences/onboarding-surprisepreferences.component';
import { IngredientmodalComponent } from '../../core/components/ingredientmodal/ingredientmodal.component';
import { GuidemodalComponent } from '../../core/components/guidemodal/guidemodal.component';
import { OnboardingProgressComponent } from '../../core/components/onboarding-progress/onboarding-progress.component';
import { SharedComponentsModule } from '../../core/components/shared.module';

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
    },
    {
        path: 'ingredientpreferences', component: OnboardingIngredientPreferencesComponent
    },
    {
        path: 'loadingscreen', component: OnboardingLoadingScreenComponent
    },
    {
        path: 'surprisepreferences', component: OnboardingSurprisePreferencesComponent
    },
    {
        path: 'numberofmeals', component: OnboardingNumberOfMealsComponent
    },
    {
        path: 'complete', component: OnboardingCompleteComponent
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
        OnboardingMealPreferencesComponent,
        OnboardingIngredientPreferencesComponent,
        OnboardingNumberOfMealsComponent,
        OnboardingCompleteComponent,
        OnboardingLoadingScreenComponent,
        GuidemodalComponent,
        OnboardingSurprisePreferencesComponent,
        OnboardingProgressComponent
    ],
    entryComponents: [
        GuidemodalComponent
    ]
})
export class OnboardingModule { }
