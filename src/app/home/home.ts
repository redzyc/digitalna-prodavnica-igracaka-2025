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
    selectedRating: [] as number[],
    selectedTargetGroups: [] as string[],
    minPriceFilter: 0,
    maxPriceFilter: 0,
    selectedAgeGroup: [] as string[],
  };

  protected toyTypes = signal<string[]>([]);
  protected ageGroups = signal<string[]>([]);
  protected sortOption: string = '';


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

  protected goToDetails(id: number) {
    this.router.navigateByUrl(`/details/${id}`);
  }
  protected getToyReviews(toyId: number): ReviewModel[] {
    const reviewsJson = localStorage.getItem('toyReviews');
    if (!reviewsJson) return [];
    const reviews: ReviewModel[] = JSON.parse(reviewsJson);
    return reviews.filter(r => r.toyId === toyId);
  }


  protected getAverageRating(toy: ToyModel) {
    const reviews = this.getToyReviews(toy.toyId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc: number, r: any) => acc + Number(r.rating), 0);
    return sum / reviews.length;
  }

  protected filteredToys() {
    let toys = this.toys().filter(toy => {
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

      const ratingPass =
        this.filters.selectedRating.length === 0 ||
        this.filters.selectedRating.some(r => {
          const avg = this.getAverageRating(toy);
          switch (r) {
            case 1: return avg >= 1.0 && avg < 1.5;
            case 2: return avg >= 1.5 && avg < 2.5;
            case 3: return avg >= 2.5 && avg < 3.5;
            case 4: return avg >= 3.5 && avg < 4.5;
            case 5: return avg >= 4.5 && avg <= 5.0;
            default: return false;
          }
        });

      return pricePass && typePass && groupPass && agePass && searchPass && ratingPass && ratingPass;
    });

    if (this.sortOption === 'priceAsc') {
      toys.sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'priceDesc') {
      toys.sort((a, b) => b.price - a.price);
    } else if (this.sortOption === 'ratingAsc') {
      toys.sort((a, b) => this.getAverageRating(a) - this.getAverageRating(b));
    } else if (this.sortOption === 'ratingDesc') {
      toys.sort((a, b) => this.getAverageRating(b) - this.getAverageRating(a));
    } else if (this.sortOption === 'nameAsc') {
      toys.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortOption === 'nameDesc') {
      toys.sort((a, b) => b.name.localeCompare(a.name));
    }

    return toys;
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
      selectedRating: [] as number[],
      selectedAgeGroup: [] as string[]
    };
  }


}