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
import { UserService } from '../../services/user.service';
import { ReviewModel } from '../../models/review.model';

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
  protected toys = signal<ToyModel[]>([]);
  stars = [1, 2, 3, 4, 5];
  protected userBasketItems: BasketModel[] = [];
  ratings: { [toyId: number]: number } = {};
  reviews: (ReviewModel & { toyId: number })[] = [];
  activeUserEmail: string | null = null;

  reservedItems: BasketModel[] = [];
  arrivedItems: BasketModel[] = [];
  canceledItems: BasketModel[] = [];

  constructor(
    private basketService: BasketService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    const activeUser = UserService.getActiveUser();
    this.activeUserEmail = activeUser?.email || null;

    if (!activeUser) {
      alert("You need to be logged in");
      this.router.navigateByUrl('/login');
      return;
    }

    ToyService.getToys()
      .then(rsp => this.toys.set(rsp.data))
      .catch(err => console.error('Error loading toys', err));

    const savedReviews = localStorage.getItem('toyReviews');
    if (savedReviews) this.reviews = JSON.parse(savedReviews);

    this.updateLists();

  }

  protected get currentBasket() {
    return this.basketService.basketSignal();
  }

  private updateLists() {
    const items = this.currentBasket.items ?? [];
     const userItems = items.filter(i => i.userMail === this.activeUserEmail);
    this.reservedItems = userItems.filter(i => i.status === 'RESERVED');
    this.arrivedItems = userItems.filter(i => i.status === 'ARRIVED');
    this.canceledItems = userItems.filter(i => i.status === 'CANCELED');
  }

  protected get hasArrivedItems(): boolean {
    return this.arrivedItems.length > 0;
  }

  protected get hasCanceledItems(): boolean {
    return this.canceledItems.length > 0;
  }

  protected getToyDetails(toyId: number): ToyModel | undefined {
    return this.toys().find(t => t.toyId === toyId);
  }

  protected getToyImage(toyId: number): string {
    return `https://toy.pequla.com/img/${toyId}.png`;
  }

  protected updateQuantity(item: BasketModel, quantity: number) {
    if (item.status !== "RESERVED") return;
    if (quantity < 1) quantity = 1;
    if (quantity > 99) {
      this.showMessage('Maximum order for this item is 99', 'snack-red');
      quantity = 99;
    }
    item.numOfProd = quantity;
    this.basketService.updateItemQuantity(item.toyId, quantity);
  }

  protected changeToCancel(item: BasketModel) {
  this.basketService.updateItemStatus(item.toyId, 'CANCELED', item.basketId);
  this.showMessage('Status has been changed to CANCELED', 'snack-green');
  this.updateLists(); 
}

protected changeToArrived(item: BasketModel) {
  this.basketService.updateItemStatus(item.toyId, 'ARRIVED', item.basketId);
  this.showMessage('Status has been changed to ARRIVED', 'snack-green');
  this.updateLists(); 
}


protected removeItem(item: BasketModel) {
  this.basketService.removeItem(item.toyId,item.status, item.basketId);
  this.updateLists(); 
}

  protected hasUserReviewed(toyId: number, userMail: string | null): boolean {
    if (!userMail) return false;
    return this.reviews.some(r => r.userMail === userMail && r.toyId === toyId);
  }

  protected selectRating(toyId: number, rating: number) {
    this.ratings[toyId] = rating;
  }

  protected submitReview(toyId: number) {
    const activeUser = UserService.getActiveUser();
    if (!activeUser) return;

    const rating = this.ratings[toyId];


    if (this.hasUserReviewed(toyId, activeUser.email)) {
      this.showMessage('You already gave a review', 'snack-red');
      return;
    }

    const review: ReviewModel & { toyId: number } = {
      id: Date.now(),
      userMail: activeUser.email,
      userName: `${activeUser.firstName} ${activeUser.lastName}`,
      rating: rating.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: null,
      toyId
    };

    this.reviews.push(review);
    localStorage.setItem('toyReviews', JSON.stringify(this.reviews));

    this.showMessage('Thank you for review', 'snack-green');

    delete this.ratings[toyId];
  }

  protected getAverageRating(toy: ToyModel): number {
    const toyReviews = this.reviews.filter(r => r.toyId === toy.toyId);
    if (toyReviews.length === 0) return 0;
    const total = toyReviews.reduce((sum, r) => sum + parseFloat(r.rating), 0);
    return Math.round(total / toyReviews.length);
  }

  private showMessage(message: string, style: string) {
    this.snackBar.open(message, 'Close', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [style]
    });
  }
}
