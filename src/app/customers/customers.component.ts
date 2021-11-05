import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { User } from '@/_models';
import { AlertService, AuthenticationService, UserService } from '@/_services';
import { Customer } from '@/_models/customer';
import { CustomerService } from '@/_services/customer.service';
import { PlanService } from '@/_services/plan.service';

import jQueryFactory = require('jquery');
const jQuery = jQueryFactory(window, true);

@Component({ templateUrl: 'customers.component.html' })
export class CustomersComponent implements OnInit {
    crudFormCustomer: FormGroup;
    currentUser: User;
    customers = [];
    plans = [];
    loading = false;
    submitted = false;
    returnUrl: string;
    editedCustomer;
    editedCustomer_name;

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private customerService: CustomerService,
        private planService: PlanService,
        private alertService: AlertService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
        this.editedCustomer = false;
    }

    ngOnInit() {
        this.loadAllCustomers();
        this.loadAllPlans();
        this.crudFormCustomer =new FormGroup({
            id: new FormControl(),
            name: new FormControl(),
            email: new FormControl(),
            phone: new FormControl(),
            state: new FormControl(),
            city: new FormControl(),
            birthday: new FormControl(),
            plans: new FormControl(),
        });


    }

    // convenience getter for easy access to form fields
    get f() { return this.crudFormCustomer.controls; }

    deleteCustomer(id: number) {
        this.customerService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllCustomers());
    }

    private loadAllCustomers() {
        this.customerService.getAll()
            .pipe(first())
            .subscribe(customers => this.customers = customers['data'] );
    }

    private loadAllPlans() {
        this.planService.getAll()
            .pipe(first())
            .subscribe(plans => this.plans = plans['data'] );
    }

    getCustomer(id: number) {
        this.customerService.get(id)
            .pipe(first())
            .subscribe(
                customer => {
                    this.editedCustomer = customer['data'];
                    this.setPlansInForm('.plans', customer['data']['plans']);
                },
                error => {
                    //this.alertService.error(error);
                    //this.loading = false;
                });
    }

    get(name) {
        return window.document.getElementById(name)['value'];
    }

    getPlansInForm(cbSelector) {
        var array = []
        var checkboxes = document.querySelectorAll(cbSelector+ '[type=checkbox]:checked')

        for (var i = 0; i < checkboxes['length']; i++) {
            array.push(checkboxes[i]['value'])
        }
        return array;
    }

    setPlansInForm(cbSelector, values) {
        $('.plans').prop('checked', false);
        for ( const plan_id in this.editedCustomer.plans ) {
            $('#plan_' + plan_id).prop('checked', true);
        }
    }

    onSubmit() {
        this.submitted = true;
        this.loading = true;
        this.alertService.clear(); // reset alerts on submit

        var customer = {
            name: this.get('name'),
            email: this.get('email'),
            phone: this.get('phone'),
            state: this.get('state'),
            city: this.get('city'),
            birthday: this.get('birthday'),
            plans: this.getPlansInForm('.plans'),
        };
        if (this.get('action') == 'edit') {
            customer['id'] = this.get('id');
            this.update(customer);
        } else {
            this.insert(customer);
        }

    }

    insert(customer) {
        this.customerService.insert(customer)
            .pipe(first())
            .subscribe(
                data => {
                    this.loadAllCustomers();
                    this.reset();
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    update(customer) {
        this.customerService.update(customer)
            .pipe(first())
            .subscribe(
                data => {
                    this.loadAllCustomers();
                    this.reset();
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    reset() {
        this.crudFormCustomer.reset();
        this.editedCustomer = false;
        $('.plans').prop('checked', false);
    }
}