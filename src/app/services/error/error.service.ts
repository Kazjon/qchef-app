import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {

    constructor(private alertController: AlertController) { }

    async showGenericError(message: string) {

        const alert = await this.alertController.create({
            header: 'Oh no!',
            message: "Oh no! Looks like something went wrong. Please close the app and try again.",
            buttons: [
                {
                    text: 'OK',
                }
            ]
        });

        await alert.present();
    }


}
