import { Component, signal } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToyService } from '../../services/toy.service';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { ToyModel } from '../../models/toy.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
  FormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatDividerModule,
  MatOption
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {
   protected currentUser = signal<UserModel | null>(UserService.getActiveUser());
   toys: ToyModel[] = [];

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(private router: Router, private snackBar: MatSnackBar) {
    try {
      const user = UserService.getActiveUser();
      this.currentUser.set(user ?? null);
    } catch (e) {
      alert('No active user!');
      this.router.navigateByUrl('/login');
    }
     ToyService.getToys()
      .then((rsp) => this.toys = (rsp.data))
      .catch((err) => console.error('Error loading toys', err));
  }
  saveProfile() {
    try {
      // Ovdje bi mogao da pozoveš UserService.updateUser ili direktno localStorage
      this.snackBar.open('Profile updated successfully!', 'Close', { duration: 2500 });
    } catch (e) {
      this.snackBar.open('Failed to update profile!', 'Close', { duration: 2500 });
    }
  }

  editProfile() {
    // Logika za edit profila
    alert('Edit profile clicked!');
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    // Ovde ide poziv servisa za promenu lozinke
    UserService.changePassword(this.currentPassword, this.newPassword)
      .then(() => alert('Password changed successfully!'))
      .catch(err => alert('Failed to change password: ' + err));
  }
}
