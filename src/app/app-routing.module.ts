import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './services/auth-guard/auth-guard.service';

const routes: Routes = [
	{
		path: 'home',
		loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
		canActivate: [AuthGuard]
	},
	{
		path: 'plugintester',
		loadChildren: () => import('./pages/plugintester/plugintester.module').then(m => m.PlugintesterPageModule)
	},
	{
		path: 'login',
		loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
	},
	{
		path: 'splash',
		loadChildren: () => import('./pages/splash/splash.module').then(m => m.SplashPageModule)
	},
	{ 	path: '**',
		redirectTo: 'splash',
		pathMatch: 'full'
	},
	{ 	path: '',
		redirectTo: 'splash',
		pathMatch: 'full'
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
