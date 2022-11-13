import { AfterViewInit, Component, OnDestroy } from '@angular/core';

import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
import * as fromRoot from 'src/app/core/ngrx/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'hayvn-shop';
  cartItemsCount$ = this.store.select((s) => s.products.cart.length);
  showArrow$ = new BehaviorSubject(true);
  destroyed$: Subject<void> = new Subject<void>();

  constructor(private store: Store<fromRoot.State>, private router: Router) {}

  ngAfterViewInit() {
    this.router.events.subscribe(
      (event) => event instanceof NavigationEnd && this.handleRouteChange(event)
    );
  }

  handleRouteChange = (event: any) => {
    console.log(event.url);
    if (event.url !== '/products') {
      console.log('HERE');
      this.showArrow$.next(true);
    }
    this.showArrow$.next(false);
  };

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
