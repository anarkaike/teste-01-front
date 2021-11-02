﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '@/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get(`${config.apiUrl}/users`);
    }

    get(id: number) {
        return this.http.get(`${config.apiUrl}/users/${id}`);
    }

    register(user: User) {
        return this.http.post(`${config.apiUrl}/register`, user);
    }

    update(user: User) {
        return this.http.put(`${config.apiUrl}/users`, user);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/${id}`);
    }
}