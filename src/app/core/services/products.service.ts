import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { combineLatest, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts(vehiclesUrl?: string, starshipsUrl?: string) {
    const starships = this.http.get<{ results: Product[]; next: string }>(
      starshipsUrl || 'https://swapi.dev/api/starships'
    );

    const vehicles = this.http.get<{ results: Product[]; next: string }>(
      vehiclesUrl || 'https://swapi.dev/api/vehicles'
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
      `https://swapi.dev/api/starships/?search=${searchTerm}`
    );

    const vehicles = this.http.get<{ results: Product[]; next: string }>(
      `https://swapi.dev/api/vehicles/?search=${searchTerm}`
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
}
