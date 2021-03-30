import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
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
    registerForm: FormGroup;
    formSubmitted: boolean = false;
    formDisabled: boolean = false;
    errorMessage: string = undefined;
    loginStates = {
        loading: "loading",
        ready: "ready",
        error: "error"
    }
    state: string = undefined;
    switchToRegisterForm: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private firebaseService: FirebaseService,
        private router: Router,
        private dataService: DataService,
        private dataHandlingService: DataHandlingService) { }

    ngOnInit() {

        this.createLoginForm();
        
        this.state = this.loginStates.ready;

        let idToken = localStorage.getItem('idToken');
        if (idToken != undefined) {
            this.router.navigateByUrl('dashboard/recipes', { replaceUrl: true });
        }
    }

    segmentChanged(ev: any) {
        this.state = this.loginStates.ready;
        this.enableForm();
        this.errorMessage = "";
        console.log('Segment changed', ev);
        this.switchToRegisterForm = !this.switchToRegisterForm;
        if (this.switchToRegisterForm) {
            this.createRegisterForm()
        }
    }

    private createLoginForm() {
        this.loginForm = this.formBuilder.group({
            email: ['', [
                Validators.required,
                Validators.pattern("[^ @]*@[^ @]*")
            ]],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
            ]]
        });
    }

    private createRegisterForm() {
        this.registerForm = this.formBuilder.group({
            email: ['', [
                Validators.required,
                Validators.pattern("[^ @]*@[^ @]*")
            ]],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
            ]],
            confirmPassword: [''],
        }, {validator: [this.checkPasswords]});
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
        } else {
            this.getErrorMessage(this.loginForm);
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

    checkPasswords(group: FormGroup) {
        let fieldsMatch = null;
        let field1 = group.get('password').value;
        let field2 = group.get('confirmPassword').value;
        (field1 === field2) ? fieldsMatch = true : fieldsMatch = { notSame: true }
        return fieldsMatch;
    }

    register() {
        if (this.registerForm.valid) {
            this.firebaseService.createUserWithEmailAndPassword(this.registerForm.value.email, this.registerForm.value.password)
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
        } else {
            this.getErrorMessage(this.registerForm);
        }
    }

    private getErrorMessage(group: FormGroup) {
        Object.keys(group.controls).forEach(key => {
            const controlErrors: ValidationErrors = group.get(key).errors;
            if (controlErrors != null) {
                this.state = this.loginStates.error;
                this.enableForm();
                switch(key) {
                    case 'email': this.errorMessage = "Please enter a valid email address.";
                        break;
                    case 'password': 
                        if(controlErrors.minlength || controlErrors.required) {
                            this.errorMessage = "Password must be at least 8 characters long";
                        } else {
                            this.errorMessage = "Password must contain uppercase letters and characters";
                        }
                        break;
                    case 'notSame': this.errorMessage = "Passwords do not match";
                        break;
                }
            } else {
                if(group.hasError('notSame')) {
                    this.state = this.loginStates.error;
                    this.enableForm();
                    this.errorMessage = "Passwords not match";
                }
            }
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
