import { Component, signal } from '@angular/core';
import { BasketService } from '../../services/basket.service';
import { BasketModel } from '../../models/basket.model';
import { ToyModel } from '../../models/toy.model';
import { ToyService } from '../../services/toy.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NumericLiteral } from 'typescript';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './basket.html',
  styleUrls: ['./basket.css']
})
export class Basket {
  public numOfProd: number[] = Array.from({ length: 99 }, (_, i) => i + 1);
  private toyCache: Map<number, ToyModel> = new Map();
  protected toys = signal<ToyModel[]>([]);

  constructor(private basketService: BasketService, private router: Router, private snackBar: MatSnackBar) {
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
  protected goToToy(toyId: Number) {
    console.log(this.router.navigateByUrl(`/details/${toyId}`))
    this.router.navigateByUrl(`/details/${toyId}`);
  }

  updateQuantity(item: BasketModel, quantity: number) {
    if (quantity < 1) quantity = 1;
    if (quantity > 99) {
      this.snackBar.open(`We don't have that much in stock. Max is 99`, 'Close', { 
    duration: 3500,
    horizontalPosition: 'center', // centrirano horizontalno
    verticalPosition: 'top',      // može i 'bottom' ili 'top'
    panelClass: ['snack-red']     // dodajemo custom klasu
  });
      quantity = 99;
    }
    item.numOfProd = quantity;
    this.basketService.updateItemQuantity(item.toyId, quantity);
  }

  removeItem(toyId: number) {
    this.basketService.removeItem(toyId);
  }

  addItem(toyId: number, quantity: number) {
    const currentQuantity = this.basketService.getQuantityForToy(toyId);
    if (currentQuantity + quantity > 99) {
      this.snackBar.open(`We don't have that much in stock. Max is 99`, 'Close', { duration: 2500 });
      return;
    }
    this.basketService.addItem(toyId, quantity);
  }
}
