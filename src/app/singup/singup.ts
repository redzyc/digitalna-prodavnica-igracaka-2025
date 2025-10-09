import { Component, signal } from '@angular/core';
import { single } from 'rxjs';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-singup',
  imports: [],
  templateUrl: './singup.html',
  styleUrl: './singup.css'
})
export class Singup {
protected toys = signal<string[]>([]);

constructor() {
  MainService.getToys()
  .then(rsp => this.toys.set(rsp.data));
  }
}


