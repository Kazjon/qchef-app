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

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    localStorage.setItem("userID", user.uid);
                    resolve(user);
                }
                else {
                    reject(false);
                }
            });

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
            .then(function(idToken) {
                localStorage.setItem("idToken", idToken);
                resolve(idToken);
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
                })
                .catch(() => {
                    reject(false);
                });
        }

        return new Promise(resolver);

    }

}
