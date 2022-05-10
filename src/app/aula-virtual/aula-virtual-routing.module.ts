import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AulaVirtualComponent } from './aula-virtual.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { AulaVirtualGuard } from './Guard/aula-virtual.guard';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';

const routes: Routes = [
  {
    path: '', component: AulaVirtualComponent ,canActivateChild: [AulaVirtualGuard] , children:
      [
        { path: 'Cuenta', component: CuentaComponent},
        { path: 'MiPerfil', component: MiPerfilComponent}
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AulaVirtualRoutingModule { }
