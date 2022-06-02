import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AulaVirtualComponent } from './aula-virtual.component';
import { AvatarComponent } from './avatar/avatar.component';
import { CambiarContraComponent } from './cambiar-contra/cambiar-contra.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { CursoComponent } from './curso/curso.component';
import { DocenciaComponent } from './docencia/docencia.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AlumnoGuard } from './Guard/alumno.guard';
import { AulaVirtualGuard } from './Guard/aula-virtual.guard';
import { ProveedorGuard } from './Guard/proveedor.guard';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { MisCursosComponent } from './mis-cursos/mis-cursos.component';
import { ModuloComponent } from './modulo/modulo.component';
import { SesionesComponent } from './sesiones/sesiones.component';

const routes: Routes = [
  {
    path: '', component: AulaVirtualComponent ,canActivateChild: [AulaVirtualGuard] , children:
      [
        { path: 'Cuenta', component: CuentaComponent},
        { path: 'MiPerfil', component: MiPerfilComponent,canActivate:[AlumnoGuard]},
        { path: 'ChangePassword', component: CambiarContraComponent,canActivate:[AlumnoGuard]},
        { path: 'MisCursos', component: MisCursosComponent,canActivate:[AlumnoGuard]},
        { path: 'Avatar', component: AvatarComponent,canActivate:[AlumnoGuard]},
        { path: 'Docencia', component: DocenciaComponent,canActivate:[ProveedorGuard]},

        { path: 'MisCursos/:IdMatricula', component: CursoComponent,canActivate:[AlumnoGuard]},

        { path: 'MisCursos/:IdMatricula/:idPEspecificoHijo', component: ModuloComponent,canActivate:[AlumnoGuard]},

        //tipo: 1.-sesiones/subsesiones 2.-Tarea 3.-Encuesta 4.- Tarea Calificar
        { path: 'MisCursos/:IdMatricula/:idPEspecificoHijo/:Tipo/:IdCapitulo/:IdSesion', component: SesionesComponent,canActivate:[AlumnoGuard]},
        { path: '**', component: ErrorPageComponent},
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AulaVirtualRoutingModule { }
