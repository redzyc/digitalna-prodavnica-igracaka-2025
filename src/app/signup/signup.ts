import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ToyService } from '../../services/toy.service';
import { ToyModel } from '../../models/toy.model';

@Component({
  selector: 'app-signp',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup {
  protected form: FormGroup;
  protected toys = signal<string[]>([]);

  constructor(private formBuilder: FormBuilder, protected router: Router) {
    ToyService.getToys()
      .then(rsp => this.toys.set(rsp.data.map((toy: ToyModel) => toy.name)))
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
      UserService.signup(formValue);
      this.router.navigateByUrl('/login');
    } catch (e) {
      console.error(e);
      alert('Data missing');
    }
  }
}
