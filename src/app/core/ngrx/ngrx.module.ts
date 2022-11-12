import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../../environments/environment';

import { EffectsModule } from '@ngrx/effects';

import { ProductsEffects } from './products/products.effects';
import { reducers } from './index';

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([ProductsEffects]),
  ],
  providers: [],
  exports: [StoreModule, StoreDevtoolsModule, EffectsModule],
})
export class NgrxModule {}
