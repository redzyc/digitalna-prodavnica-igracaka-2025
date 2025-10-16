import { Component, signal } from '@angular/core';
import { BasketService } from '../../services/basket.service';
import { BasketModel } from '../../models/basket.model';
import { ToyModel } from '../../models/toy.model';
import { ToyService } from '../../services/toy.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './basket.html',
  styleUrls: ['./basket.css']
})
export class Basket {
  public numOfProd: number[] = Array.from({ length: 99 }, (_, i) => i + 1);
  protected toys = signal<ToyModel[]>([]);
  stars = [1, 2, 3, 4, 5];

  constructor(
    private basketService: BasketService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    ToyService.getToys()
      .then(rsp => this.toys.set(rsp.data))
      .catch(err => console.error('Error loading toys', err));
  }

  get currentBasket() {
    return this.basketService.basketSignal();
  }

  getToyDetails(toyId: number): ToyModel | undefined {
    return this.toys().find(t => t.toyId === toyId);
  }

  getToyImage(toyId: number): string {
    return `https://toy.pequla.com/img/${toyId}.png`;
  }

  goToToy(toyId: number) {
    this.router.navigateByUrl(`/details/${toyId}`);
  }

  updateQuantity(item: BasketModel, quantity: number) {
    if (quantity < 1) quantity = 1;
    if (quantity > 99) {
      this.snackBar.open(`Max količina je 99`, 'Zatvori', {
        duration: 3500,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-red']
      });
      quantity = 99;
    }
    item.numOfProd = quantity;
    this.basketService.updateItemQuantity(item.toyId, quantity);
  }

  removeItem(toyId: number, status: 'RESERVED' | 'ARRIVED' | 'CANCELED') {
    this.basketService.removeItem(toyId, status);
  }

  changeToCancel(item: BasketModel) {
    this.basketService.updateItemStatus(item.toyId, 'CANCELED');
    this.snackBar.open('Status promenjen na CANCELED', 'Zatvori', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snack-green']
    });
  }

  changeToArrived(item: BasketModel) {
    this.basketService.updateItemStatus(item.toyId, 'ARRIVED');
    this.snackBar.open('Status promenjen na ARRIVED', 'Zatvori', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snack-green']
    });
  }

  rateItem() {
  }
}
