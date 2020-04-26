import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-splash',
	templateUrl: './splash.page.html',
	styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

	constructor(private firebaseService: FirebaseService, private router: Router) { }

	ngOnInit() {
		this.checkUserAuthentication();
	}

	checkUserAuthentication() {
		this.firebaseService.checkIfUserAuthenticated()
			.then(() => {
				this.router.navigateByUrl('home', { replaceUrl: true });
			})
			.catch(() => {
				this.router.navigateByUrl('login', { replaceUrl: true });
			});
	}

}
