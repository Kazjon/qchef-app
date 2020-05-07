import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { Router } from '@angular/router';

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
        private router: Router) { }

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

    }

    login() {

        if (this.loginForm.valid) {

            this.state = this.loginStates.loading;
            this.disableForm();

            this.firebaseService.loginWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
                .then((res) => {
                    console.log(res);
                    this.state = this.loginStates.ready;
                    this.router.navigateByUrl('onboarding');
                })
                .catch((error) => {
                    this.state = this.loginStates.error;
                    this.enableForm();
                    this.errorMessage = error.message;
                });
        }

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
