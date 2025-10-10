import { Component, signal } from '@angular/core';
import axios from 'axios';
import { ToyService } from '../../services/toy.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home {
  protected toys = signal<any>([])

  constructor(){
    ToyService.getToys()
    .then (rsp=>this.toys.set(rsp.data))
  }
  protected getImage(toy:number){
    return `https://toy.pequla.com/img/${toy}.png`
  }


}
