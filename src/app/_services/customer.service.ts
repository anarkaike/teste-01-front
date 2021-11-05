import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Customer } from '@/_models/customer';

@Injectable({ providedIn: 'root' })
export class CustomerService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get(`${config.apiUrl}/customers`);
    }

    get(id: number) {
        return this.http.get(`${config.apiUrl}/customers/${id}`);
    }

    insert(customer) {
        return this.http.post(`${config.apiUrl}/customers`, customer);
    }

    update(customer) {
        return this.http.put(`${config.apiUrl}/customers/${customer.id}`, customer);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/customers/${id}`);
    }
}