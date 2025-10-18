import { signal } from '@angular/core';
import { ToyModel } from '../models/toy.model';
import { BasketModel } from '../models/basket.model';
import { BasketStateModel } from '../models/basket_state.model';
import { UserService } from './user.service';
import { ToyService } from './toy.service';

export class BasketService {

  public basketSignal = signal<BasketStateModel>({
    items: [],
    totalPrice: 0,
    totalItemCount: 0,
    customerEmail: null
  });

  private currentBasketItems: BasketModel[] = [];


  constructor() {
    this.loadFromLocalStorage();
    this.updateBasketSignal();
  }
  private getNextBasketId(): number {
  const lastId = Number(localStorage.getItem('lastBasketId') || '0');
  const nextId = lastId + 1;
  localStorage.setItem('lastBasketId', nextId.toString());
  return nextId;
}

static getBasketId(): number | null {
  const basketIdStr = localStorage.getItem('basketId');
  if (!basketIdStr) return null;
  const basketId = Number(basketIdStr);
  return isNaN(basketId) ? null : basketId;
}

  public addItem(toy: ToyModel | number, quantity: number = 1) {
    if (!UserService.getActiveUser()) return;

    const toyId = typeof toy === 'number' ? toy : toy.toyId;

    const existing = this.currentBasketItems.find(i => i.toyId === toyId && i.status === 'RESERVED');

    if (existing) {
      existing.numOfProd += quantity;
    } else {
      const addNew = (t: ToyModel) => {
        this.currentBasketItems.push({
          basketId: this.getNextBasketId(),
          toyId: t.toyId,
          userMail: UserService.getActiveUser()!.email,
          numOfProd: quantity,
          price: t.price,
          status: 'RESERVED',
          createdAt: new Date().toISOString(),
          updatedAt: null
        });
        this.updateBasketSignal();
        this.saveToLocalStorage();
      };

      if (typeof toy === 'number') {
        ToyService.getToyById(toy).then(r => addNew(r.data));
      } else {
        addNew(toy);
      }
    }
  }


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

  private saveToLocalStorage() {
    localStorage.setItem('basket', JSON.stringify(this.currentBasketItems));
  }

  private updateBasketSignal() {
    const totalPrice = this.calculateTotalPrice();
    const totalItemCount = this.calculateTotalCount();
    this.basketSignal.set({
      items: [...this.currentBasketItems],
      totalPrice: this.calculateTotalPrice(),
      totalItemCount: this.calculateTotalCount(),
      customerEmail: UserService.getActiveUser()?.email ?? null
    });
  }

  public async getBasket(): Promise<BasketStateModel> {
    await this.updateBasketSignal();
    return this.basketSignal();
  }

  private calculateTotalPrice(): number {
    return this.currentBasketItems
     .filter(item => item.status === 'RESERVED' && item.userMail === UserService.getActiveUser()!.email)
     .reduce((sum, item) => sum + (item.price ?? 0) * item.numOfProd, 0
  );
  }
    private calculateTotalCount():number {
      return this.currentBasketItems
      .filter(item => item.status === 'RESERVED' && item.userMail === UserService.getActiveUser()!.email)
      .reduce((sum, item) => sum + Number(item.numOfProd), 0
  );
    
  }

  public removeItem(toyId: number, status: "RESERVED" | "ARRIVED" | "CANCELED", basketId: number) {
    this.currentBasketItems = this.currentBasketItems.filter(i => !(i.toyId === toyId && i.basketId === basketId && i.status === status));

    this.updateBasketSignal();
    this.saveToLocalStorage();
  }

  public updateItemQuantity(toyId: number, quantity: number) {
    const item = this.currentBasketItems.find(i => i.toyId === toyId);
    if (item) {
      item.numOfProd = quantity;
      this.updateBasketSignal();
      this.saveToLocalStorage();
    }
  }
  public getQuantityForToy(toyId: number): number {
    const item = this.currentBasketItems.find(i => i.toyId === toyId);
    return item ? item.numOfProd : 0;
  }
  public updateItemStatus(toyId: number, newStatus: "RESERVED" | "ARRIVED" | "CANCELED", basketId: number) {
    const item = this.currentBasketItems.find(i => i.toyId === toyId && i.basketId === basketId);
    if (item) {
      item.status = newStatus;
      item.updatedAt = new Date().toISOString();
      this.updateBasketSignal();
      this.saveToLocalStorage();
    }
  }
  restoreCanceled(item: BasketModel) {
  item.status = 'RESERVED';
  this.updateBasketSignal();
  this.saveToLocalStorage();
}


}
