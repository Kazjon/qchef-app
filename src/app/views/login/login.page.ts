import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { DataHandlingService } from 'src/app/services/datahandling/datahandling.service';
import { MealSlot } from 'src/app/core/objects/MealSlot';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    loginForm: FormGroup;
    formSubmitted: boolean = false;
    formDisabled: boolean = false;
    errorMessage: string = undefined;
    loginStates = {
        loading: "loading",
        ready: "ready",
        error: "error"
    }
    state: string = undefined;

    constructor(
        private formBuilder: FormBuilder,
        private firebaseService: FirebaseService,
        private router: Router,
        private dataService: DataService,
        private dataHandlingService: DataHandlingService) { }

    ngOnInit() {

        this.loginForm = this.formBuilder.group({
            email: ['', [
                Validators.required,
                Validators.pattern("[^ @]*@[^ @]*")
            ]],
            password: ['', [
                Validators.required,
                Validators.minLength(6)
            ]]
        });

        this.state = this.loginStates.ready;

        let idToken = localStorage.getItem('idToken');
        if (idToken != undefined) {
            this.router.navigateByUrl('dashboard/recipes', { replaceUrl: true });
        }

    }

    login() {

        if (this.loginForm.valid) {

            this.state = this.loginStates.loading;
            this.disableForm();

            this.firebaseService.loginWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
                .then((res) => {
                    const firebaseResp = <any>res;
                    if(firebaseResp && firebaseResp.user && firebaseResp.user.uid){
                        localStorage.setItem('userID', firebaseResp.user.uid)
                    }
                    this.firebaseService.getUserIDToken()
                        .then((res) => {
                            this.dataService.getCustomTokenFromServer(res).subscribe((customToken) => {
                                this.dataService.initAuthToken(customToken['token']);
                                localStorage.setItem('idToken', customToken['token']);
                                localStorage.setItem('loginDate',new Date().toUTCString());
                                this.state = this.loginStates.ready;
                                this.getSelectedMealPlan();
                            });
                        })
                })
                .catch((error) => {
                    this.state = this.loginStates.error;
                    this.enableForm();
                    this.errorMessage = error.message;
                });
        }

    }

    private getSelectedMealPlan() {
        this.dataService.getSelectedMealPlanFromServer().subscribe((res) => {

            this.dataHandlingService.handleMealSlotData(res)
                .then((res: MealSlot[]) => {
                    if (res) {
                        this.dataService.setMealSlots(res);
                        this.router.navigateByUrl('splash');
                    } else {
                        this.router.navigateByUrl('onboarding', { replaceUrl: true });
                    }
                    this.enableForm();
                });
        },
            (exception) => {
                // need to check if server return 'Unable to authenticate'
                if (exception && exception.error && typeof (exception.error) == "string") {
                    const strRes = <string>exception.error;
                    if (strRes.includes('Unable to authenticate')) {
                        this.state = this.loginStates.error;
                        this.enableForm();
                        this.errorMessage = "Internal server error";
                        this.firebaseService.logoutUserFromApp().then(() => {
                            //this.router.navigateByUrl('login');
                            
                        });
                    }
                }

                this.router.navigateByUrl('onboarding', { replaceUrl: true });
            });

    }

    private disableForm() {
        this.loginForm.disable();
        this.formDisabled = true;
    }

    private enableForm() {
        this.loginForm.enable();
        this.formDisabled = false;
    }
}
