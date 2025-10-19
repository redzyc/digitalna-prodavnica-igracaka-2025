import { Component, signal } from '@angular/core';
import { BasketService } from '../../services/basket.service';
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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ReviewModel } from '../../models/review.model';


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterModule,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatButtonModule],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class Details {
  protected toy = signal<ToyModel | null>(null);
  protected selectedNum: number = 1;
  userService: any;

  constructor(
    private route: ActivatedRoute,
    private basketService: BasketService,
    private router: Router,
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
    const currentNumOfProd = this.basketService.getQuantityForToy(toy!.toyId)
    if (!toy) return;
    if ((this.selectedNum + currentNumOfProd) > 99) {
      alert("We don't have that much in stock. The current number in stock is 99")
      return
    }

    try {
      let activeUser = UserService.getActiveUser();
      if (!activeUser) throw new Error('No active user');
    } catch (e) {
      alert("You need to be logged")
      sessionStorage.setItem('ref', this.router.url);
      this.router.navigateByUrl('/login');
      return;
    }

    this.basketService.addItem(toy, this.selectedNum);
    const basket = this.basketService.getBasket();
    alert(`You added ${this.selectedNum}x "${toy.name}" in BAG`);
  }
  protected getAverageRating(toy: ToyModel) {
    return this.basketService.getAverageRating(toy.toyId);
  }
    protected getReviewsForToy(toy: ToyModel) {
    return this.basketService.getReviewsForToy(toy.toyId);
  }

  increaseQuantity() {
    this.selectedNum++;
  }

  decreaseQuantity() {
    if (this.selectedNum > 1) this.selectedNum--;
  }
}