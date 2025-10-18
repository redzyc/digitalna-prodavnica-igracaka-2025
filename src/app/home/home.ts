import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToyService } from '../../services/toy.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToyModel } from '../../models/toy.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ReviewModel } from '../../models/review.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  protected toys = signal<ToyModel[]>([]);
  protected minRatingFilter: number = 0;
  protected filters = {
    searchTerm: '',
    selectedTypes: [] as string[],
    selectedTargetGroups: [] as string[],
    minPriceFilter: 0,
    maxPriceFilter: 0,
    selectedAgeGroup: [] as string[],
    review: ''
  };

  protected toyTypes = signal<string[]>([]);
  protected ageGroups = signal<string[]>([]);

  // Stvarni min/max za slajdere
  protected minPrice: number = 0;
  protected maxPrice: number = 1000;
  constructor(private router: Router) {
    ToyService.getToys()
      .then(rsp => {
        const data = rsp.data;
        this.toys.set(data);

        const prices = data.map((t: ToyModel) => t.price);
        this.minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        this.maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;

        // Inicijalno postavljanje filtera na ceo opseg
        this.filters.minPriceFilter = this.minPrice;
        this.filters.maxPriceFilter = this.maxPrice;
      })
      .catch(err => console.error('Error loading toys', err));

    ToyService.getToyTypes()
      .then(rsp => this.toyTypes.set(rsp.data.map((t: any) => t.name)))
      .catch(err => console.error('Error loading toy types', err));

    ToyService.getAgeGroup()
      .then(rsp => this.ageGroups.set(rsp.data.map((t: any) => t.name)))
      .catch(err => console.error('Error loading age groups', err));



  }

  protected getImage(toyId: number) {
    return `https://toy.pequla.com/img/${toyId}.png`;
  }
  sliderValue: number = 50;

  protected goToDetails(id: number) {
    this.router.navigateByUrl(`/details/${id}`);
  }
  protected getToyReviews(toyId: number): ReviewModel[] {
    const reviewsJson = localStorage.getItem('toyReviews');
    if (!reviewsJson) return [];
    const reviews: ReviewModel[] = JSON.parse(reviewsJson);
    return reviews.filter(r => r.toyId === toyId);
  }


  // Prosečna ocena
  protected getAverageRating(toy: ToyModel) {
    const reviews = this.getToyReviews(toy.toyId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
    return sum / reviews.length;
  }

  protected filteredToys() {
    return this.toys().filter(toy => {
      const pricePass =
        toy.price >= this.filters.minPriceFilter &&
        toy.price <= this.filters.maxPriceFilter;

      const typePass =
        this.filters.selectedTypes.length === 0 ||
        this.filters.selectedTypes.includes(toy.type.name);

      const groupPass =
        this.filters.selectedTargetGroups.length === 0 ||
        this.filters.selectedTargetGroups.includes(toy.targetGroup.toLowerCase());

      const agePass =
        this.filters.selectedAgeGroup.length === 0 ||
        this.filters.selectedAgeGroup.includes(toy.ageGroup.name);

      const searchTerm = this.filters.searchTerm.toLowerCase();
      const searchPass =
        !searchTerm ||
        toy.name.toLowerCase().includes(searchTerm) ||
        toy.description.toLowerCase().includes(searchTerm);

      const reviewPass =
        !this.filters.review ||
        this.getToyReviews(toy.toyId).some(r =>
          r.comment.toLowerCase().includes(this.filters.review.toLowerCase())
        );

      const ratingPass = this.getAverageRating(toy) >= (this.minRatingFilter || 0);

      return pricePass && typePass && groupPass && agePass && searchPass && reviewPass && ratingPass;
    });
  }


  protected checkPriceBounds() {
    if (this.filters.minPriceFilter > this.filters.maxPriceFilter) {
      alert("Min price can't be higher than max price")
      this.filters.minPriceFilter = this.minPrice;
    }

    if (this.filters.maxPriceFilter < this.filters.minPriceFilter) {
      alert("Max price can't be lower than min price")
      this.filters.maxPriceFilter = this.maxPrice;
    }

    this.applyFilters();
  }


  protected applyFilters() {

  }


  protected resetFilters() {
    this.filters = {
      searchTerm: '',
      selectedTypes: [] as string[],
      selectedTargetGroups: [] as string[],
      minPriceFilter: this.minPrice,
      maxPriceFilter: this.maxPrice,
      selectedAgeGroup: [] as string[],
      review: ''
    };
  }


}