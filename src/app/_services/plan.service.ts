﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Plan } from '@/_models/plan';

@Injectable({ providedIn: 'root' })
export class PlanService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get(`${config.apiUrl}/plans`);
    }

    get(id: number) {
        return this.http.get(`${config.apiUrl}/plans/${id}`);
    }

    insert(plan: Plan) {
        return this.http.post(`${config.apiUrl}/plans`, plan);
    }

    update(plan: Plan) {
        return this.http.put(`${config.apiUrl}/plans`, plan);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/plans/${id}`);
    }
}