import { Component } from '@angular/core';
import { EmailValidator, Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  protected form: FormGroup

  constructor(private formBuilder: FormBuilder,protected router: Router) {
    this.form = this.formBuilder.group({
      email: ['user@example.com', [Validators.required, Validators.email]],
      password: ['user123',Validators.required]
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      alert('Form is not valid')
      return
    }

    try{
      UserService.login(this.form.value.email, this.form.value.password)
      this.router.navigate(['/profile'])
    }catch(e){
      alert('Check your credentials!')
    }
    console.log(this.form.valid);
    console.log(this.form.value);
  }

}
