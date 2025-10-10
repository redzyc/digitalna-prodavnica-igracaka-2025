import { Component, signal } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  protected currentUser = signal<UserModel | null>(null);
  constructor(private router: Router) {
    try{
      const user = UserService.getActiveUser();
      this.currentUser.set(user ?? null);
    } catch(e) {
      alert('No active user!')
    }
}
}
