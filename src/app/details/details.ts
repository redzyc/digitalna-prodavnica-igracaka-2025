import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToyService } from '../../services/toy.service';
import { ToyModel } from '../../models/toy.model';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details {

  protected toy=signal<ToyModel | null>(null)
  constructor(private route:ActivatedRoute){
      route.params.subscribe((params:any)=>{
        ToyService.getToyById(params.id)
        .then(rsp=>this.toy.set(rsp.data))
      })
  }
  convertToString(){
    return JSON.stringify(this.toy(),null,2)
  }
  protected getImage(toy:number){
    return `https://toy.pequla.com/img/${toy}.png`
  }
  

}
