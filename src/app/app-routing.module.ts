import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './services/auth-guard/auth-guard.service';

const routes: Routes = [
	{
		path: 'home',
		loadChildren: () => import('./views/home/home.module').then(m => m.HomePageModule),
		canActivate: [AuthGuard]
	},
	{
		path: 'plugintester',
		loadChildren: () => import('./views/plugintester/plugintester.module').then(m => m.PlugintesterPageModule)
	},
	{
		path: 'login',
		loadChildren: () => import('./views/login/login.module').then(m => m.LoginPageModule)
	},
	{
		path: 'splash',
		loadChildren: () => import('./views/splash/splash.module').then(m => m.SplashPageModule)
	},
	{
		path: 'onboarding',
		loadChildren: () => import('./views/onboarding/onboarding.module').then(m => m.OnboardingModule),
		canActivate: [AuthGuard]
	},
	{
		path: 'mealselection',
		loadChildren: () => import('./views/mealselection/mealselection.module').then(m => m.MealSelectionModule),
		canActivate: [AuthGuard]
	},
	{
		path: 'dashboard',
		loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule),
		canActivate: [AuthGuard]
	},
	{ 	path: '**',
		redirectTo: 'splash',
		pathMatch: 'full'
	},
	{ 	path: '',
		redirectTo: 'splash',
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
