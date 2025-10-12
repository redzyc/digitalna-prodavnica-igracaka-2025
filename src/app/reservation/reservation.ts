import { Component, numberAttribute, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToyService } from '../../services/toy.service';
import { ToyModel } from '../../models/toy.model';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { producerNotifyConsumers } from '@angular/core/primitives/signals';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reservation',
  imports: [ReactiveFormsModule],
  templateUrl: './reservation.html',
  styleUrl: './reservation.css'
})
export class Reservation {
  protected toy = signal<ToyModel | null>(null)
  protected numOfProds: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  protected form: FormGroup | undefined

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) {
    route.params.subscribe((params: any) => {
      if (!localStorage.getItem('active')) {
        sessionStorage.setItem('ref', `/details/${params.id}/book`)
        router.navigateByUrl('/login')
        return
      }
      ToyService.getToyById(params.id)
        .then(rsp => {
          this.toy.set(rsp.data)
          this.form = this.formBuilder.group({
            name: new FormControl({ value: rsp.data.name, disabled: true }),
            details: new FormControl({ value: rsp.data.description, disabled: true }),
            type: new FormControl({ value: rsp.data.type.name, disabled: true }),
            ageGroup: new FormControl({ value: rsp.data.ageGroup.name, disabled: true }),
            targetGroup: new FormControl({ value: rsp.data.targetGroup, disabled: true }),
            productionDate: new FormControl({ value: rsp.data.productionDate, disabled: true }),
            price: new FormControl({ value: rsp.data.price, disabled: true }),
            numOfProd: [this.numOfProds[0], Validators.required]
          })


        })
    })
  }
  onSubmit() {
    if (!this.form?.valid) {
      alert('Invalid form data')
      return
    }
    if (this.toy === null) {
      alert('Toy Not Loaded!')
      return
    }
    try {
      UserService.createReservation(this.toy()!.toyId, this.form.value.numOfProd)
      this.router.navigateByUrl(`/profile`)
    } catch {
      alert('Failed to make a reservation')
    }

  }
}
