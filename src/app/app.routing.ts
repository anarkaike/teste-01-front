import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { UsersComponent } from './users';
import { CustomersComponent } from './customers';
import { PlansComponent } from './plans';
import { AuthGuard } from './_helpers';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard] }, // Initial Page
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'plans', component: PlansComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);