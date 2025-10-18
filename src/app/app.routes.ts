import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import {Profile} from './profile/profile';
import { Details } from './details/details';
import { Basket } from './basket/basket';
import { Signup } from './signup/signup';
import { Welcome } from './welcome/welcome';
export const routes: Routes = [
    { path: '', title: 'Welcome', component: Welcome },
    { path: 'home', title: 'Home', component: Home },
    {path: 'login', title: 'Login', component: Login},
    {path: 'signup',title: 'Signup', component: Signup},
    {path:'profile',title:'Profile',component: Profile},
    {path:'cart',title:'My Basket', component:Basket},
    {path:'details/:id',title: 'Details',component: Details},
    {path: '**', redirectTo: '' } 

];

