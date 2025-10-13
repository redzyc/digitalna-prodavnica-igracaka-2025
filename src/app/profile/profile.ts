import { Component, signal } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {
  protected currentUser = signal<UserModel | null>(null);

  constructor(private router: Router) {
    try {
      const user = UserService.getActiveUser();
      this.currentUser.set(user ?? null);
    } catch (e) {
      alert('No active user!');
      this.router.navigateByUrl('/login');
    }
  }

  protected formatDate(iso: string) {
    return new Date(iso).toLocaleString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
