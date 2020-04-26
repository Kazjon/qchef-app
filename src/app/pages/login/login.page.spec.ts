import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginPage } from './login.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('LoginPage', () => {
    let component: LoginPage;
    let fixture: ComponentFixture<LoginPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LoginPage],
            imports: [IonicModule.forRoot(), RouterTestingModule, FormsModule, ReactiveFormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.ngOnInit();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('form is invalid when empty', () => {
        expect(component.loginForm.valid).toBeFalsy();
    });

    it('email field is initially invalid', () => {
        let email = component.loginForm.controls['email'];
        expect(email.valid).toBeFalsy();
    });

    it('email field validator should initially throw "field required" error', () => {
        let email = component.loginForm.controls['email'];
        let errors = email.errors || {};
        expect(errors['required']).toBeTruthy();
    });

    it('email field validator should throw "pattern invalid" error when pattern is wrong', () => {
        let email = component.loginForm.controls['email'];
        email.setValue("test");
        let errors = email.errors || {};
        expect(errors['pattern']).toBeTruthy();
    });

    it('password field is initially invalid', () => {
        let password = component.loginForm.controls['password'];
        expect(password.valid).toBeFalsy();
    });

    it('password field validator should initially throw "field required" error', () => {
        let password = component.loginForm.controls['password'];
        let errors = password.errors || {};
        expect(errors['required']).toBeTruthy();
    });

    it('password field validator should throw "length invalid" error when pw length is too short', () => {
        let password = component.loginForm.controls['password'];
        password.setValue("1");
        let errors = password.errors || {};
        expect(errors["minlength"]).toBeDefined();
    });

    it('form should submit successfully', () => {
        let email = component.loginForm.controls['email'];
        let password = component.loginForm.controls['password'];
        email.setValue("test@test.com");
        password.setValue("12345678");
        component.login();
        expect(component.formSubmitted).toBeTruthy();
    });


});
