import { Component, signal } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home {
  protected webData= signal('');

    constructor() {
axios.get('./data.json')
    .then(rsp =>this.webData.set(JSON.stringify(rsp.data, null, 2)))
}
  

}
