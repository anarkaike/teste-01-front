import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { User } from '@/_models';
import { AlertService, AuthenticationService } from '@/_services';
import { UserService } from "@/_services/user.service";

@Component({ templateUrl: 'users.component.html' })
export class UsersComponent implements OnInit {
    crudFormUser: FormGroup;
    currentUser: User;
    users = [];
    loading = false;
    submitted = false;
    returnUrl: string;
    editedUser;
    editedUser_name;
    editedUser_email;
    editedUser_password;

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
        this.editedUser = false;
    }

    ngOnInit() {
        this.loadAllUsers();
        this.crudFormUser =new FormGroup({
            id: new FormControl(),
            name: new FormControl(),
            email: new FormControl(),
            password: new FormControl(),
        });
    }

    deleteUser(id: number) {
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllUsers());
    }

    private loadAllUsers() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users['data'] );
    }

    getUser(id: number) {
        this.userService.get(id)
            .pipe(first())
            .subscribe(user => { console.log('CUSTOMER',user['data']); this.editedUser = user['data'];  } ,
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

        var user = {
            name: this.get('name'),
            email: this.get('email'),
            password: this.get('password'),
        };
        if (this.get('action') == 'edit') {
            user['id'] = this.get('id');
            this.update(user);
        } else {
            this.insert(user);
        }

    }

    insert(user) {
        this.userService.register(user)
            .pipe(first())
            .subscribe(
                data => {
                    this.loadAllUsers();
                    this.crudFormUser.reset();
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    update(user) {
        this.userService.update(user)
            .pipe(first())
            .subscribe(
                data => {
                    this.loadAllUsers();
                    this.crudFormUser.reset();
                    this.editedUser = false;
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}