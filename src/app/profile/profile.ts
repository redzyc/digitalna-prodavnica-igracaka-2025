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
import { MatSelectModule } from '@angular/material/select';
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
    MatDividerModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {
  protected currentUser = signal<UserModel | null>(null);
  protected toys = signal<string[]>([]);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(private router: Router, private snackBar: MatSnackBar) {
    try {
      // Uzmi trenutno aktivnog korisnika
      const user = UserService.getActiveUser();
      this.currentUser.set(user ?? null);
    } catch (e) {
      alert('No active user!');
      this.router.navigateByUrl('/login');
      return;
    }

    ToyService.getToys()
      .then(rsp => {
        const toyNames = rsp.data.map((toy: ToyModel) => toy.name);
        this.toys.set(toyNames);

        const user = this.currentUser();
        if (user && user.toy && !toyNames.includes(user.toy)) {
          user.toy = '';
        }
        this.currentUser.set({ ...user! });
      })
      .catch(err => console.error('Error loading toys', err));
  }

  saveProfile() {
    const user = this.currentUser();
    if (!user) return;

    try {

      UserService.updateUser(user); 
      this.snackBar.open('Profile updated successfully!', 'Close', { duration: 2500 });
    } catch (e) {
      console.error(e);
      this.snackBar.open('Failed to update profile!', 'Close', { duration: 2500 });
    }
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    UserService.changePassword(this.currentPassword, this.newPassword)
      .then(() => {
        this.snackBar.open('Password changed successfully!', 'Close', { duration: 2500 });
        // Resetuj polja
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      })
      .catch(err => {
        this.snackBar.open('Failed to change password: ' + err, 'Close', { duration: 3500 });
      });
  }
}
