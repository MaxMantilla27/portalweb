import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AulaVirtualComponent } from './aula-virtual.component';
import { AvatarComponent } from './avatar/avatar.component';
import { CambiarContraComponent } from './cambiar-contra/cambiar-contra.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { CursoComponent } from './curso/curso.component';
import { AulaVirtualGuard } from './Guard/aula-virtual.guard';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { MisCursosComponent } from './mis-cursos/mis-cursos.component';
import { ModuloComponent } from './modulo/modulo.component';
import { SesionesComponent } from './sesiones/sesiones.component';

const routes: Routes = [
  {
    path: '', component: AulaVirtualComponent ,canActivateChild: [AulaVirtualGuard] , children:
      [
        { path: 'Cuenta', component: CuentaComponent},
        { path: 'MiPerfil', component: MiPerfilComponent},
        { path: 'ChangePassword', component: CambiarContraComponent},
        { path: 'MisCursos', component: MisCursosComponent},
        { path: 'Avatar', component: AvatarComponent},

        { path: 'MisCursos/:IdMatricula', component: CursoComponent},

        { path: 'MisCursos/:IdMatricula/:idPEspecificoHijo', component: ModuloComponent},
        //tipo: 1.-sesiones/subsesiones 2.-Tarea 3.-Encuesta 4.- Tarea Calificar
        { path: 'MisCursos/:IdMatricula/:idPEspecificoHijo/:Tipo/:IdCapitulo/:IdSesion', component: SesionesComponent},
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AulaVirtualRoutingModule { }
