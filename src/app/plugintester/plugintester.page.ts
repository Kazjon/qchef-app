import { Component, OnInit } from '@angular/core';

// Camera
import { Plugins, CameraResultType, CameraSource, LocalNotificationScheduleResult } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Sharing
const { Share } = Plugins;

// Local Notifications
const { LocalNotifications } = Plugins;


@Component({
  selector: 'app-plugintester',
  templateUrl: './plugintester.page.html',
  styleUrls: ['./plugintester.page.scss'],
})
export class PlugintesterPage implements OnInit {
  photo:SafeResourceUrl;
  scheduledNotifications:LocalNotificationScheduleResult;

  constructor(private sanitizer:DomSanitizer) { }

  ngOnInit() {
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

}
