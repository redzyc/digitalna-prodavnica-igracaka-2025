import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  protected form: FormGroup;

  constructor(private formBuilder: FormBuilder, protected router: Router) {
    this.form = this.formBuilder.group({
      email: ['user@example.com', [Validators.required, Validators.email]],
      password: ['user123', Validators.required]
    });
  }

  protected onSubmit() {
    if (!this.form.valid) {
      alert('Form is not valid');
      return;
    }

    try {
      UserService.login(this.form.value.email, this.form.value.password);
      const url = sessionStorage.getItem('ref') ?? '/home';
      sessionStorage.removeItem('ref');
      this.router.navigateByUrl(url);
    } catch (e) {
      alert('Check your login params!');
    }
  }
  protected goToSingUp() {
    this.router.navigateByUrl(`/singup`);
  }
}
