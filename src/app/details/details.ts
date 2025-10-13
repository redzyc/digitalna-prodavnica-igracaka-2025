import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ToyService } from '../../services/toy.service';
import { BasketService } from '../../services/basket.service';
import { ToyModel } from '../../models/toy.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class Details {
  protected toy = signal<ToyModel | null>(null);
  protected numOfProds: number[] = Array.from({ length: 15 }, (_, i) => i + 1);
  protected selectedNum: number = 1;

  constructor(
    private route: ActivatedRoute,
    private basketService: BasketService,
    private router: Router
  ) {
    this.route.params.subscribe((params: any) => {
      ToyService.getToyById(params.id)
        .then(rsp => this.toy.set(rsp.data))
        .catch(err => console.error('Error loading toy', err));
    });
  }

  protected getImage(toyId: number) {
    return `https://toy.pequla.com/img/${toyId}.png`;
  }

  protected async addToBag() {
    const toy = this.toy();
    if (!toy) return;

    let activeUser = null;
    try {
      activeUser = UserService.getActiveUser();
      if (!activeUser) throw new Error('No active user');
    } catch (e) {
      sessionStorage.setItem('ref', this.router.url);
      this.router.navigateByUrl('/login');
      return;
    }

    await this.basketService.addItem(toy, this.selectedNum);
    const basket = await this.basketService.getBasket();
    console.log('🧺 Current basket:', basket);
    alert(`Dodali ste ${this.selectedNum}x "${toy.name}" u korpu 🧺`);
  }
}
