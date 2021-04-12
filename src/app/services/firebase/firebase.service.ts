import { Injectable } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import { DataService } from '../data/data.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    constructor(
        private http: HttpClient, 
        private dataService: DataService,
        private menu: MenuController,
        private router: Router
    ) { }
 
    isUserAuthenticated() {

        let resolver = (resolve, reject) => {
            const token = localStorage.getItem("idToken");

            if (token != undefined) {
                // check login date
                if (localStorage.getItem('loginDate')) {
                    var loginDate = new Date(localStorage.getItem('loginDate'));
                    var currentDate = new Date();
                   
                    const diffDays = this.dataService.datediff(loginDate, currentDate);

                    if (diffDays > 3 && diffDays < 14) {
                        // get new token
                        // call server, need new token 
                        // server get uid, sign in with custom token
                        this.dataService.postExtendSessionToServer(token).subscribe(res => {
                            const customToken = res['customtoken'];
                            if (customToken) {


                                // front end get custom token, talk to firebase, get IdToken
                                firebase.auth().signInWithCustomToken(customToken).then(res => {
                                    this.getUserIDToken()
                                        .then((res) => {

                                            // call sessionLogin again
                                            this.dataService.getCustomTokenFromServer(res).subscribe((customToken) => {
                                                console.log(customToken);
                                                this.dataService.initAuthToken(customToken['token']);
                                                localStorage.setItem('idToken',  customToken['token']);
                                                localStorage.setItem('loginDate', new Date().toUTCString());
                                            });
                                        })
                                })
                            }
                        })
                    }
                    else if(diffDays >= 14){
                        // user logged out
                        this.logoutUserFromApp();
                    }
                }
                resolve(localStorage.getItem("userID"));
            }
            else {
                reject(false);
            }
        }

        return new Promise(resolver);


    }


    loginWithEmailAndPassword(email, password) {

        let resolver = (resolve, reject) => {

            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });

        }

        return new Promise(resolver);

    }

    createUserWithEmailAndPassword(email, password) {
        let resolver = (resolve, reject) => {

            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });

        }

        return new Promise(resolver);

    }

    getUserIDToken() {

        let resolver = (resolve, reject) => {
            firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
                .then(function (idToken) {
                    resolve(idToken);
                }).catch(function (error) {
                    reject(error);
                });
        }

        return new Promise(resolver);

    }

    sendPasswordResetEmail(email){
        let resolver = (resolve, reject) => {
            firebase.auth().sendPasswordResetEmail(email).then(function() {
                // Email sent.
                resolve(true);
            }).catch(function(error) {
                reject(error);
            });	
        }

        return new Promise(resolver);
    }

    logout() {

        let resolver = (resolve, reject) => {
            firebase.auth().signOut()
                .then(() => {
                    resolve(true);
                    this.menu.close();
                    this.router.navigateByUrl('splash');
                })
                .catch(() => {
                    reject(false);
                });
        }

        return new Promise(resolver);

    }

    logoutUserFromApp() {
        let resolver = (resolve, reject) => {
            localStorage.removeItem('idToken');
            localStorage.removeItem("userID");
            localStorage.removeItem("onboardingStage");
            localStorage.removeItem("localMealSlots");
            localStorage.removeItem("localWeekStartDate");
            localStorage.removeItem("loginDate");

            this.logout();
        }
        return new Promise(resolver);
    }

}
