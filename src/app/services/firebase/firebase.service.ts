import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import { DataService } from '../data/data.service';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    constructor(private http: HttpClient, private dataService: DataService) { }

    /*getStuff(access) {

        let headers = new HttpHeaders({
            'Authorization': 'Bearer ' + access,
            'Content-Type': 'application/json'
        });

        return this.http.get("https://neura-ca-stage.theprojectfactory.com/vasat/api/Patient?patientId=778891", {headers});

    }*/

    isUserAuthenticated() {

        let resolver = (resolve, reject) => {
            const token = this.dataService.getCookie("idToken");

            if (token != undefined) {
                // check login date
                if (localStorage.getItem('loginDate')) {
                    var loginDate = new Date(localStorage.getItem('loginDate'));
                    var currentDate = new Date();
                    let diffDate = new Date(currentDate.getTime() - loginDate.getTime());
                    const diffDays = diffDate.getUTCDate() - 1;
                    if (diffDays > 3) {
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
                                                this.dataService.createCookie('idToken', customToken['token'], 14);
                                                localStorage.setItem('loginDate', new Date().toUTCString());
                                            });
                                        })
                                })
                            }
                        })


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

    logout() {

        let resolver = (resolve, reject) => {
            firebase.auth().signOut()
                .then(() => {
                    resolve(true);
                })
                .catch(() => {
                    reject(false);
                });
        }

        return new Promise(resolver);

    }

    logoutUserFromApp() {

        let resolver = (resolve, reject) => {
            this.dataService.removeCookie('idToken');
            localStorage.removeItem("userID");
            localStorage.removeItem("onboardingStage");
            localStorage.removeItem("localMealSlots");
            localStorage.removeItem("localWeekStartDate");

            this.logout();
        }
        return new Promise(resolver);
    }

}
