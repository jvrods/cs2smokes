import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MapDetailComponent } from './components/map-detail/map-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'map/:id', component: MapDetailComponent },
    { path: '**', redirectTo: '' }
];
