import { Component } from '@angular/core';
import { BasketService } from '../../services/basket.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

// Angular Material moduli
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatDividerModule],
  templateUrl: './basket.html',
  styleUrls: ['./basket.css']
})
export class Basket {
  constructor(private basketService: BasketService, private router: Router) {
    try {
      const activeUser = UserService.getActiveUser();
      if (!activeUser) throw new Error('No active user');
    } catch (e) {
      sessionStorage.setItem('ref', this.router.url);
      this.router.navigateByUrl('/login');
    }
  }
  get currentBasket() {
    return this.basketService.basketSignal();
  }
}
