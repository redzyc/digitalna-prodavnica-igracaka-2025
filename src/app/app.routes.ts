import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Singup } from './singup/singup';
import {Profile} from './profile/profile';
import { Details } from './details/details';
import { Basket } from './basket/basket';
export const routes: Routes = [
    { path: '', title: 'Home', component: Home },
    {path: 'login', title: 'Login', component: Login},
    {path: 'singup',title: 'Singup', component: Singup},
    {path:'profile',title:'Profile',component: Profile},
    {path:'cart',title:'My Basket', component:Basket},
    {path:'details/:id',title: 'Details',component: Details},
    {path: '**', redirectTo: '' } 

];

