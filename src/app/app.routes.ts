import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MapDetailComponent } from './components/map-detail/map-detail.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToAdmin = () => redirectLoggedInTo(['admin']);

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'map/:id', component: MapDetailComponent },
    {
        path: 'login',
        component: LoginComponent,
        ...canActivate(redirectLoggedInToAdmin)
    },
    {
        path: 'admin',
        component: AdminComponent,
        ...canActivate(redirectUnauthorizedToLogin)
    },
    { path: '**', redirectTo: '' }
];
