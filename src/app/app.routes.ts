import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Login } from './login/login';
import { Singup } from './singup/singup';
import {Profile} from './profile/profile';
import { Details } from './details/details';
import { Reservation } from './reservation/reservation';
export const routes: Routes = [
    { path: '', title: 'Home', component: Home },
    {path: 'login', title: 'Login', component: Login},
    {path: 'singup',title: 'Singup', component: Singup},
    {path: 'about',title: 'About', component: About},
    {path: 'profile', title: 'User Profile',component: Profile},
    {path:'details/:id/book',title:'Reservation', component:Reservation},
    {path:'details/:id',title: 'Details',component: Details},
    {path: '**', redirectTo: '' } //vraca do home-a ako se ubaci nesto sto ne postoji

];

