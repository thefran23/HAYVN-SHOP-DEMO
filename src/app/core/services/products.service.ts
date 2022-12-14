import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { combineLatest, map, Observable, of } from 'rxjs';
import mockSaleDataResponse from '../mocks/sale.json';
import mockImagesDataResponse from '../mocks/images.json';
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts(vehiclesUrl?: string, starshipsUrl?: string) {
    const starships = this.http.get<{ results: Product[]; next: string }>(
      starshipsUrl || 'https://swapi.py4e.com/api/starships'
    );

    const vehicles = this.http.get<{ results: Product[]; next: string }>(
      vehiclesUrl || 'https://swapi.py4e.com/api/vehicles'
    );

    const products: Observable<{
      results: Product[];
      vehiclesNext: string;
      starshipsNext: string;
    }> = combineLatest([starships, vehicles]).pipe(
      map(([starships, vehicles]) => {
        return {
          results: [...starships.results, ...vehicles.results],
          vehiclesNext: vehicles.next,
          starshipsNext: starships.next,
        };
      })
    );
    return products;
  }

  searchProducts(searchTerm: string) {
    console.log('in service ', searchTerm);
    const starships = this.http.get<{ results: Product[]; next: string }>(
      `https://swapi.py4e.com/api/starships/?search=${searchTerm}`
    );

    const vehicles = this.http.get<{ results: Product[]; next: string }>(
      `https://swapi.py4e.com/api/vehicles/?search=${searchTerm}`
    );

    const products: Observable<{
      results: Product[];
      vehiclesNext: string;
      starshipsNext: string;
    }> = combineLatest([starships, vehicles]).pipe(
      map(([starships, vehicles]) => {
        return {
          results: [...starships.results, ...vehicles.results],
          vehiclesNext: vehicles.next,
          starshipsNext: starships.next,
        };
      })
    );
    return products;
  }

  getProduct(url: string) {
    return this.http.get<Product>(url);
  }

  getSaleProducts() {
    return of(mockSaleDataResponse);
  }

  getProductImages() {
    return of(mockImagesDataResponse);
  }
}
