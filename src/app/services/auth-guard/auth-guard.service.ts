import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuardService {

	constructor(public router: Router, public firebaseService: FirebaseService) { }

	canActivate(): Promise<boolean> {

		return new Promise((resolve) => {

			this.firebaseService.isUserAuthenticated()
			.then((user) => {
				if (user) {
					resolve(true);
				}
				else {
					this.router.navigateByUrl('login');
					resolve(false);
				}
			})
			.catch(() => {
				this.router.navigateByUrl('login');
				resolve(false);
			});

		});

	}
}
