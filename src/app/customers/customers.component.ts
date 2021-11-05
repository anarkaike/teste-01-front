import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { User } from '@/_models';
import { Customer } from '@/_models/customer';
import {AlertService, AuthenticationService, UserService} from '@/_services';
import { CustomerService } from '@/_services/customer.service';

@Component({ templateUrl: 'customers.component.html' })
export class CustomersComponent implements OnInit {
    crudFormCustomer: FormGroup;
    currentUser: User;
    customers = [];
    loading = false;
    submitted = false;
    returnUrl: string;
    editedCustomer;
    editedCustomer_name;

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private customerService: CustomerService,
        private alertService: AlertService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
        this.editedCustomer = false;
    }

    ngOnInit() {
        this.loadAllCustomers();
        this.crudFormCustomer =new FormGroup({
            id: new FormControl(),
            name: new FormControl(),
            email: new FormControl(),
            phone: new FormControl(),
            state: new FormControl(),
            city: new FormControl(),
            birthday: new FormControl(),
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

    getCustomer(id: number) {
        this.customerService.get(id)
            .pipe(first())
            .subscribe(customer => { console.log('CUSTOMER',customer['data']); this.editedCustomer = customer['data'];  } ,
                error => {
                    //this.alertService.error(error);
                    //this.loading = false;
                });
    }

    get(name) {
        return window.document.getElementById(name)['value'];
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
                    this.crudFormCustomer.reset();
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
                    this.crudFormCustomer.reset();
                    this.editedCustomer = false;
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}