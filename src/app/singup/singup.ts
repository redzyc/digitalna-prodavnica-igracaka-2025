import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-singup',
  imports: [ReactiveFormsModule],
  templateUrl: './singup.html',
  styleUrl: './singup.css'
})
export class Singup {
protected form: FormGroup

  constructor(private formBuilder: FormBuilder,protected router: Router) {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['',Validators.required],
      repeat: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      toy: ['', Validators.required]
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


