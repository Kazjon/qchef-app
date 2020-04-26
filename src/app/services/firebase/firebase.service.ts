import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    constructor() { }

    checkIfUserAuthenticated() {

        let resolver = (resolve, reject) => {

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
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
