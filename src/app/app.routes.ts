import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Login } from './login/login';
import { Singup } from './singup/singup';
import {Profile} from './profile/profile';
export const routes: Routes = [
    { path: '',component: Home },
    {path: 'login', component: Login},
    {path: 'singup', component: Singup},
    {path: 'about', component: About},
    {path: 'profile', component: Profile},
    {path: '**', redirectTo: '' } //vraca do home-a ako se ubaci nesto sto ne postoji

];

