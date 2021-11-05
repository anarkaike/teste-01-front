import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService, AuthenticationService } from '@/_services';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // redirect to initial page if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/customers']);
        }
    }

    ngOnInit() {
        this.registerForm =new FormGroup({
            name: new FormControl(),
            email: new FormControl(),
            password: new FormControl(),
        });
    }

    get f() { return this.registerForm.controls; } // convenience getter for easy access to form fields

    onSubmit() {
        this.submitted = this.loading = true;
        this.alertService.clear(); // reset alerts on submit
        if (this.registerForm.invalid) { // stop here if form is invalid
            return;
        }

        var customer = {
            name: $('name').val(),
            email: $('email').val(),
            password: $('password').val(),
        };

        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success(data['message'], true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
