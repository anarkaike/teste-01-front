import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { AuthenticationService } from '@/_services';
import { PlanService } from '@/_services/plan.service';

@Component({ templateUrl: 'plans.component.html' })
export class PlansComponent implements OnInit {
    currentUser: User;
    plans = [];

    constructor(
        private authenticationService: AuthenticationService,
        private planService: PlanService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.loadAllPlans();
    }

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
}