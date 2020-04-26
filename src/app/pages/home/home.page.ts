import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    constructor(private router: Router, private firebaseService: FirebaseService) { }

    goTo(route) {
        this.router.navigateByUrl(route);
    }

    logout() {
        this.firebaseService.logout()
            .then(() => {
                this.router.navigateByUrl('splash');
            })
            .catch(() => {
                //
            });
    }

}
