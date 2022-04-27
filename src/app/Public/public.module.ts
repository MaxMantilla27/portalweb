import { NgModule } from '@angular/core';
import { PublicRoutingModule } from './public-routing.module';
import { SharedModule } from '../Core/Shared/shared.module';
import { PublicComponent } from './public.component';
import { HomeComponent } from './Home/home.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './Interceptor/interceptor.service';
import { HomeProgramasComponent } from './Home/home-programas/home-programas.component';
import { ProgramasComponent } from './programas/programas.component';

@NgModule({
  imports: [
    PublicRoutingModule,
    SharedModule,
    HttpClientModule
  ],
  declarations: [
    PublicComponent,
    HomeComponent,
    LoginComponent,
    HomeProgramasComponent,
    ProgramasComponent
  ],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ],
})
export class PublicModule {
  constructor() {}
}
