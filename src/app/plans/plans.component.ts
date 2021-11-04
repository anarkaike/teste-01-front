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
    editedPlan;
    editedPlan_name;

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private planService: PlanService,
        private alertService: AlertService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
        this.editedPlan = false;

    }

    ngOnInit() {

        this.loadAllPlans();

        this.crudForm = this.formBuilder.group({
            id: [''],
            name: [''],
            price: [''],
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

    getPlan(id: number) {
        this.planService.get(id)
            .pipe(first())
            .subscribe(plan => { console.log('PLAN',plan['data']); this.editedPlan = plan['data']; this.crudForm.updateValueAndValidity(); this.crudForm.clearValidators(); } ,
                error => {
                    //this.alertService.error(error);
                    //this.loading = false;
                });
    }

    onSubmit() {
        this.submitted = true;
        this.loading = true;
        this.alertService.clear(); // reset alerts on submit

        var plan = {
            name: window.document.getElementById('name')['value'],
            price: window.document.getElementById('price')['value']
        };
        if (window.document.getElementById('action')['value'] == 'edit') {
            plan['id'] = window.document.getElementById('id')['value'];
            this.update(plan);
        } else {
            this.insert(plan);
        }

    }

    insert(plan) {
        this.planService.insert(plan)
            .pipe(first())
            .subscribe(
                data => {
                    this.loadAllPlans();
                    this.crudForm.reset();
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    update(plan) {
        this.planService.update(plan)
            .pipe(first())
            .subscribe(
                data => {
                    this.loadAllPlans();
                    this.crudForm.reset();
                    this.editedPlan = false;
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}