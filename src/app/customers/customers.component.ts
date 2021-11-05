import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { User } from '@/_models';
import { AlertService, AuthenticationService, CustomerService, PlanService } from '@/_services';

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

    deleteCustomer(id: number) {
        if (confirm('Deseja realmente deletar este cliente?')) {
            this.alertService.clear(); // reset alerts on submit
            this.customerService.delete(id)
                .pipe(first())
                .subscribe(
                    () => this.reset(),
                    error => {
                        this.alertService.error(error);
                        this.loading = false;
                    }
                );
        }
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
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    getPlansInForm(cbSelector) {
        var ids = []
        $(cbSelector+ '[type=checkbox]:checked').each(function(){
            ids.push($(this).val());
        });
        return ids;
    }

    setPlansInForm(cbSelector, values) {
        $('.plans').prop('checked', false);
        for ( const plan_id in this.editedCustomer.plans ) {
            $('#plan_' + plan_id).prop('checked', true);
        }
    }

    get f() { return this.crudFormCustomer.controls; } // convenience getter for easy access to form fields

    onSubmit() {
        this.submitted = true;
        this.loading = true;
        this.alertService.clear(); // reset alerts on submit

        var customer = {
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            state: $('#state').val(),
            city: $('#city').val(),
            birthday: $('#birthday').val(),
            plans: this.getPlansInForm('.plans'),
        };
        if ($('#action').val() == 'edit') {
            customer['id'] = $('#id').val();
            this.update(customer);
        } else {
            this.insert(customer);
        }

    }

    private insert(customer) {
        this.customerService.insert(customer)
            .pipe(first())
            .subscribe(
                data => this.reset(),
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private update(customer) {
        this.customerService.update(customer)
            .pipe(first())
            .subscribe(
                data => this.reset()
                ,error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private reset() {
        this.loadAllCustomers();
        this.crudFormCustomer.reset();
        this.editedCustomer = this.loading = false;
        $('.plans').prop('checked', false);
    }
}