import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToyService } from '../../services/toy.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  protected toys = signal<any[]>([]);

  constructor(private router: Router) {
    ToyService.getToys()
      .then(rsp => this.toys.set(rsp.data))
      .catch(err => console.error('Error loading toys', err));
  }

  protected getImage(toyId: number) {
    return `https://toy.pequla.com/img/${toyId}.png`;
  }

  protected goToDetails(id: number) {
    this.router.navigateByUrl(`/details/${id}`);
  }
}
