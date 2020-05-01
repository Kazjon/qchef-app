import { Component, OnInit } from '@angular/core';

// Camera
import { Plugins, CameraResultType, CameraSource, LocalNotificationScheduleResult } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Sharing
const { Share } = Plugins;

// Local Notifications
const { LocalNotifications } = Plugins;

// Firebase
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

@Component({
    selector: 'app-plugintester',
    templateUrl: './plugintester.page.html',
    styleUrls: ['./plugintester.page.scss'],
})
export class PlugintesterPage implements OnInit {
    photo: SafeResourceUrl;
    scheduledNotifications: LocalNotificationScheduleResult;
    userEmail: string = 'siobhan@theprojectfactory.com';
    userPass: string = 'poopsy';
    isLoading: boolean = false;
    isLoggedIn: boolean = false;

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.testFirebaseAnalytics();
    }

    testFirebaseAnalytics() {

        firebase.analytics().setAnalyticsCollectionEnabled(true);

        firebase.analytics().logEvent("page_view", { page: "Plugin Tester!" });

        //Plugins.CapacitorFirebaseAnalytics.logEvent({ name: 'page_view',  parameters: {}});

    }

    async takePhoto() {
        const image = await Plugins.Camera.getPhoto({
            quality: 100,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Camera
        });

        this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    }

    async shareStuff() {

        let shareRet = await Share.share({
            title: 'See cool stuff',
            text: 'Really awesome thing you need to see right meow',
            url: 'http://ionicframework.com/',
            dialogTitle: 'Share with buddies'
        });

    }

    askNotificationPermission() {
        LocalNotifications.requestPermission().then(this.setLocalNotification.bind(this))
    }

    async setLocalNotification(res) {

        console.log(res);

        if (res.granted) {
            const notifs = await LocalNotifications.schedule({
                notifications: [
                    {
                        title: "Shib's ultra fab local notification",
                        body: "Just testin' yo",
                        id: 1,
                        schedule: { at: new Date(Date.now() + 1000 * 5) },
                        sound: null,
                        attachments: null,
                        actionTypeId: "",
                        extra: null
                    }
                ]
            });

            this.scheduledNotifications = notifs;
            console.log('scheduled notifications', notifs);
        }

    }

    loginFirebaseUser() {

        this.isLoading = true;

        firebase.auth().signInWithEmailAndPassword(this.userEmail, this.userPass)
            .catch((error) => {
                console.log(error);
                this.isLoading = false;
            }).then((res) => {
                console.log(res);
                this.isLoading = false;
                this.isLoggedIn = true;
                firebase.analytics().logEvent("login", { });
            });
    }

    getFirestoreData() {
        firebase.firestore().collection('recipes').get()
            .then((query) => {
                query.forEach((doc) => {
                    console.log(doc.data());
                });

            });

    }


}
