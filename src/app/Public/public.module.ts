import { NgModule } from '@angular/core';
import { PublicRoutingModule } from './public-routing.module';
import { SharedModule } from '../Core/Shared/shared.module';
import { PublicComponent } from './public.component';
import { HomeComponent } from './Home/home.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    PublicRoutingModule,
    SharedModule
  ],
  declarations: [
    PublicComponent,
    HomeComponent,
    LoginComponent
  ],
  exports: [],
  providers: [],
})
export class PublicModule {
  constructor() {}
}
