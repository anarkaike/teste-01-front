import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '@/_models';
import { Plan } from '@/_models/plan';
import {AlertService, AuthenticationService, UserService} from '@/_services';
import { PlanService } from '@/_services/plan.service';

@Component({ templateUrl: 'plans.component.html' })
export class PlansComponent implements OnInit {
    crudForm: FormGroup;
    currentUser: User;
    plans = [];
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private planService: PlanService,
        private alertService: AlertService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;

    }

    ngOnInit() {

        this.loadAllPlans();

        this.crudForm = this.formBuilder.group({
            name: ['', Validators.required],
            price: ['', Validators.required],
        });

    }

    // convenience getter for easy access to form fields
    get f() { return this.crudForm.controls; }

    deletePlan(id: number) {
        this.planService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllPlans());
    }

    private loadAllPlans() {
        this.planService.getAll()
            .pipe(first())
            .subscribe(plans => this.plans = plans['data'] );
    }

    onSubmit() {

        this.submitted = true;

        // stop here if form is invalid
        if (this.crudForm.invalid) {
            return;
        }

        this.alertService.clear(); // reset alerts on submit


        this.planService.insert({ name: this.f.name.value, price: this.f.price.value })
            .pipe(first())
            .subscribe(
            data => {
                console.log('data', data);
                //this.router.navigate([this.returnUrl]);
                this.loadAllPlans();
                this.crudForm.reset();
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }
}