import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { User } from '@/_models';
import { AlertService, AuthenticationService, PlanService } from '@/_services';

@Component({ templateUrl: 'plans.component.html' })
export class PlansComponent implements OnInit {
    crudFormPlan: FormGroup;
    currentUser: User;
    plans = [];
    loading = false;
    submitted = false;
    returnUrl: string;
    editedPlan;

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
        this.crudFormPlan =new FormGroup({
            id: new FormControl(),
            name: new FormControl(),
            price: new FormControl(),
        });
    }

    deletePlan(id: number) {
        if (confirm('Deseja realmente deletar este plano?')) {
            this.planService.delete(id)
                .pipe(first())
                .subscribe(
                    () => this.reset(),
                    error => {
                        this.alertService.error(error);
                        this.loading = false;
                    });
        }
    }

    private loadAllPlans() {
        this.planService.getAll()
            .pipe(first())
            .subscribe(plans => this.plans = plans['data'] );
    }

    getPlan(id: number) {
        this.planService.get(id)
            .pipe(first())
            .subscribe(
                plan => {
                    this.editedPlan = plan['data'];
                } ,
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    get f() { return this.crudFormPlan.controls; } // convenience getter for easy access to form fields

    onSubmit() {
        this.submitted = true;
        this.loading = true;
        this.alertService.clear(); // reset alerts on submit

        var plan = {
            name: $('#name').val(),
            price: $('#price').val()
        };
        if ($('#action').val() == 'edit') {
            plan['id'] = $('#id').val();
            this.update(plan);
        } else {
            this.insert(plan);
        }
    }

    private insert(plan) {
        this.planService.insert(plan)
            .pipe(first())
            .subscribe(
                data => this.reset(),
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private update(plan) {
        this.planService.update(plan)
            .pipe(first())
            .subscribe(
                data => this.reset(),
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private reset() {
        this.loadAllPlans();
        this.crudFormPlan.reset();
        this.editedPlan = this.loading = false;
    }
}