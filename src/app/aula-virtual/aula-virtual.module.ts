import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AulaVirtualRoutingModule } from './aula-virtual-routing.module';
import { AulaVirtualComponent } from './aula-virtual.component';
import { SharedModule } from '../Core/Shared/shared.module';
import { CuentaComponent } from './cuenta/cuenta.component';


@NgModule({
  declarations: [
    AulaVirtualComponent,
    CuentaComponent
  ],
  imports: [
    CommonModule,
    AulaVirtualRoutingModule,
    SharedModule,
  ]
})
export class AulaVirtualModule { }
