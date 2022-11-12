import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  Subject,
  Subscription,
  take,
  takeLast,
  takeUntil,
} from 'rxjs';
import * as fromRoot from 'src/app/core/ngrx/index';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { FormControl } from '@angular/forms';
import { OrderBy } from '../core/models/product.model';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  loadProducts,
  searchProducts,
} from '../core/ngrx/products/products.actions';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport)
  viewPort!: CdkVirtualScrollViewport;
  searchTermControl = new FormControl();
  orderControl = new FormControl<OrderBy>('Price Asc', { nonNullable: true });
  formCtrlSub!: Subscription;
  destroyed$: Subject<void> = new Subject<void>();
  productsList$ = this.store.select((store) => store.products.productsList);
  selectedOrderByFilter$ = new BehaviorSubject<OrderBy>('Price Asc');
  filteredProductsList$ = this.getFilteredProducts();

  orderBy = ['Price Asc', 'Price Desc'];
  constructor(
    private store: Store<fromRoot.State>,
    private actions$: Actions // private router: Router
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  updateOrderBy(orderBy: OrderBy) {
    console.log('here ', orderBy);
    this.selectedOrderByFilter$.next(orderBy);
  }

  getFilteredProducts() {
    return combineLatest([
      this.productsList$,
      this.searchTermControl.valueChanges.pipe(startWith('')),
      this.selectedOrderByFilter$,
    ]).pipe(
      map(([products, filter, orderBy]) => {
        if (filter.length === 0) {
          return products.slice().sort((a, b) => {
            if (orderBy === 'Price Asc') {
              return +a.cost_in_credits - +b.cost_in_credits;
            }
            return +b.cost_in_credits - +a.cost_in_credits;
          });
        }
        this.store.dispatch(searchProducts(filter));

        return products
          .filter((products) =>
            products.name
              .toLowerCase()
              .includes(filter.toString().toLowerCase())
          )
          .sort((a, b) => {
            if (orderBy === 'Price Asc') {
              return +a.cost_in_credits - +b.cost_in_credits;
            }
            return +b.cost_in_credits - +a.cost_in_credits;
          });
      })
    );
  }

  scrollEvent() {
    if (this.viewPort.measureScrollOffset('bottom') < 60) {
      let starshipsNext$ = this.store.select((s) => s.products.starshipsNext);
      let vehiclesNext$ = this.store.select((s) => s.products.vehiclesNext);
      let productsLoaded$ = this.store.select(
        (s) => s.products.productsList.length > 0
      );
      combineLatest([starshipsNext$, vehiclesNext$, productsLoaded$])
        .pipe(
          take(1),
          map(([starshipsUrl, vehiclesUrl, loaded]) => {
            if (loaded) {
              this.store.dispatch(loadProducts({ vehiclesUrl, starshipsUrl }));
            }
          })
        )
        .subscribe();
    }
  }

  clear() {
    this.searchTermControl.setValue('');
  }
}
