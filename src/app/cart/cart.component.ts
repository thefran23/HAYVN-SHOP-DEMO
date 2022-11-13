import { Component, OnInit } from '@angular/core';
import * as fromRoot from 'src/app/core/ngrx/index';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItemsToDisplay$ = this.store.select((s) => s.products.cart);
  total$ = this.getTotal();

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit(): void {}

  getTotal() {
    return this.store
      .select((s) => s.products.cart)
      .pipe(
        map((products) => {
          const saleTotal = products.reduce(
            (prev, item) =>
              prev +
              (item.discount_percent
                ? +item.cost_in_credits * (item.discount_percent / 100)
                : +item.cost_in_credits),
            0
          );
          return saleTotal;
        })
      );
  }
}
