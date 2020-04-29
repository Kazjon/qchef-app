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
                    this.state = this.loginStates.ready;
                    this.router.navigateByUrl('home', { replaceUrl: true });
                })
                .catch((error) => {
                    this.state = this.loginStates.ready;
                    console.log(error);
                })
            this.formSubmitted = true;
        }

    }

    private disableForm() {
        this.loginForm.controls['email'].disable;
        this.loginForm.controls['password'].disable;
        this.loginForm.disable;
    }


}
