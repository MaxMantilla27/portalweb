import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AulaVirtualComponent } from './aula-virtual.component';
import { CambiarContraComponent } from './cambiar-contra/cambiar-contra.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { CursoComponent } from './curso/curso.component';
import { AulaVirtualGuard } from './Guard/aula-virtual.guard';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { MisCursosComponent } from './mis-cursos/mis-cursos.component';

const routes: Routes = [
  {
    path: '', component: AulaVirtualComponent ,canActivateChild: [AulaVirtualGuard] , children:
      [
        { path: 'Cuenta', component: CuentaComponent},
        { path: 'MiPerfil', component: MiPerfilComponent},
        { path: 'ChangePassword', component: CambiarContraComponent},
        { path: 'MisCursos', component: MisCursosComponent},

        { path: 'MisCursos/:IdMatricula', component: CursoComponent},
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AulaVirtualRoutingModule { }
