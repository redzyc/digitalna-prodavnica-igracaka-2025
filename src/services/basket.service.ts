import { signal } from '@angular/core';
import { ToyModel } from '../models/toy.model';
import { BasketModel } from '../models/basket.model';
import { BasketStateModel } from '../models/basket_state.model';
import { UserService } from './user.service';
import { ToyService } from './toy.service';

export class BasketService {

  // Signal koji prati stanje korpe
  public basketSignal = signal<BasketStateModel>({
    items: [],
    totalPrice: 0,
    totalItemCount: 0,
    customerEmail: null
  });

  // Privatni niz itema
  private currentBasketItems: BasketModel[] = [];

  constructor() {
    // Učitaj korpu iz localStorage ako postoji
    this.loadFromLocalStorage();
    // Osveži signal odmah
    this.updateBasketSignal();
  }

  // Dodavanje itema
  public async addItem(toy: ToyModel, numOfProd: number = 1) {
    if (!UserService.getActiveUser()) return;

    const newItem: BasketModel = {
      toyId: toy.toyId,
      numOfProd,
      status: 'RESERVED',
      createdAt: new Date().toISOString(),
      updatedAt: null
    };

    this.currentBasketItems.push(newItem);

    await this.updateBasketSignal();
    this.saveToLocalStorage();
  }

  // Učitavanje korpe iz localStorage
  private loadFromLocalStorage() {
    const stored = localStorage.getItem('basket');
    if (stored) {
      try {
        this.currentBasketItems = JSON.parse(stored);
      } catch {
        this.currentBasketItems = [];
      }
    }
  }

  // Čuvanje korpe u localStorage
  private saveToLocalStorage() {
    localStorage.setItem('basket', JSON.stringify(this.currentBasketItems));
  }

  // Osvežavanje signala
  private async updateBasketSignal() {
    const totalPrice = await this.calculateTotalPrice();
    this.basketSignal.set({
      items: [...this.currentBasketItems],
      totalPrice,
      totalItemCount: this.currentBasketItems.length,
      customerEmail: UserService.getActiveUser()?.email ?? null
    });
  }

  // Vraća trenutni state korpe
  public async getBasket(): Promise<BasketStateModel> {
    await this.updateBasketSignal();
    return this.basketSignal();
  }

  // Računanje ukupne cene
  private async calculateTotalPrice(): Promise<number> {
    const prices = await Promise.all(
      this.currentBasketItems.map(async item => {
        try {
          const response = await ToyService.getToyById(item.toyId);
          const toy: ToyModel = response.data;
          return toy.price * item.numOfProd;
        } catch {
          return 0;
        }
      })
    );
    return prices.reduce((sum, p) => sum + p, 0);
  }
}
