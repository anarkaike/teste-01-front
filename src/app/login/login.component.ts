import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '@/_services';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
        // redirect to initial page if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/customers']);
        }
    }

    ngOnInit() {
        this.loginForm =new FormGroup({
            email: new FormControl(),
            password: new FormControl(),
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/customers';
    }

    get f() { return this.loginForm.controls; } // convenience getter for easy access to form fields

    onSubmit() {
        this.submitted = true;
        this.alertService.clear(); // reset alerts on submit
        if (this.loginForm.invalid) { // stop here if form is invalid
            return;
        }

        this.loading = true;
        this.authenticationService.login($('#email').val(), $('#password').val())
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
