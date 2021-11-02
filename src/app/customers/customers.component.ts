import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { AuthenticationService } from '@/_services';
import { CustomerService } from '@/_services/customer.service';

@Component({ templateUrl: 'customers.component.html' })
export class CustomersComponent implements OnInit {
    currentUser: User;
    customers = [];

    constructor(
        private authenticationService: AuthenticationService,
        private customerService: CustomerService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    deleteUser(id: number) {
        this.customerService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllUsers());
    }

    private loadAllUsers() {
        this.customerService.getAll()
            .pipe(first())
            .subscribe(customers => this.customers = customers['data'] );
    }
}