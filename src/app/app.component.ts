import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/core/ngrx/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'hayvn-shop';
  cartItemsCount$ = this.store.select((s) => s.products.cart.length);
  constructor(private store: Store<fromRoot.State>) {}
}
