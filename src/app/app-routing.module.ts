import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Routes } from '@angular/router';
import { HomeComponent } from './Public/Home/home.component';
import { PublicComponent } from './Public/public.component';

const routes:Routes=[
  {path:'AulaVirtual',loadChildren:()=>import('./aula-virtual/aula-virtual.module').then(m=>m.AulaVirtualModule)},
  {path:'',loadChildren:()=>import('./Public/public.module').then(m=>m.PublicModule)},
  {path:'**',component:PublicComponent}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'}/*,{useHash:true}*/)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
