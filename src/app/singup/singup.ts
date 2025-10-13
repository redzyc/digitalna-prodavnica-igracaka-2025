import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MainService } from '../../services/main.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './singup.html',
  styleUrls: ['./singup.css']
})
export class Singup {
  protected form: FormGroup;
  protected toys = signal<string[]>([]);

  constructor(private formBuilder: FormBuilder, protected router: Router) {
    MainService.getToys()
      .then(rsp => this.toys.set(rsp.data))
      .catch(err => console.error('Error loading toys', err));

    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      repeat: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      toy: ['', Validators.required]
    });
  }

  protected onSubmit() {
    if (!this.form.valid) {
      alert('Form is not valid');
      return;
    }

    if (this.form.value.password !== this.form.value.repeat) {
      alert('Passwords don\'t match!');
      return;
    }

    try {
      const formValue: any = { ...this.form.value };
      delete formValue.repeat;
      UserService.singup(formValue);
      this.router.navigateByUrl('/login');
    } catch (e) {
      console.error(e);
      alert('Data missing');
    }
  }
}
