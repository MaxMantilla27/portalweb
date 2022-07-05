import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AulaVirtualComponent } from './aula-virtual.component';
import { AvatarComponent } from './avatar/avatar.component';
import { CambiarContraComponent } from './cambiar-contra/cambiar-contra.component';
import { ConfirmacionPagoTarjetaVisaComponent } from './confirmacion-pago-tarjeta-visa/confirmacion-pago-tarjeta-visa.component';
import { ConfirmacionPagoTarjetaComponent } from './confirmacion-pago-tarjeta/confirmacion-pago-tarjeta.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { CursoPruebaComponent } from './curso-prueba/curso-prueba/curso-prueba.component';
import { CursoComponent } from './curso/curso.component';
import { DocenciaComponent } from './docencia/docencia.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AlumnoGuard } from './Guard/alumno.guard';
import { AulaVirtualGuard } from './Guard/aula-virtual.guard';
import { ProveedorGuard } from './Guard/proveedor.guard';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { MisCursosComponent } from './mis-cursos/mis-cursos.component';
import { MisPagosComponent } from './mis-pagos/mis-pagos.component';
import { ModuloComponent } from './modulo/modulo.component';
import { PagoComponent } from './pago/pago.component';
import { ResultadoPagoComponent } from './resultado-pago/resultado-pago.component';
import { ModuloPruebaComponent } from './modulo-prueba/modulo-prueba.component';
import { SesionesPruebaComponent } from './sesiones-prueba/sesiones-prueba.component';
import { SesionesComponent } from './sesiones/sesiones.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { PagoTarjetaComponent } from './pago/pago-tarjeta/pago-tarjeta.component';
import { PagoVisaComponent } from './confirmacion-pago-organico/pago-visa/pago-visa.component';
import { PagoWompiComponent } from './confirmacion-pago-organico/pago-wompi/pago-wompi.component';
import { PagoConektaComponent } from './confirmacion-pago-organico/pago-conekta/pago-conekta.component';
import { PagoGeneralComponent } from './confirmacion-pago-organico/pago-general/pago-general.component';
import { ConfirmacionPagoTarjetaWompiComponent } from './confirmacion-pago-tarjeta-wompi/confirmacion-pago-tarjeta-wompi.component';
import { ConfirmacionPagoTarjetaConektaComponent } from './confirmacion-pago-tarjeta-conekta/confirmacion-pago-tarjeta-conekta.component';
import { PagoMultipagoComponent } from './confirmacion-pago-organico/pago-multipago/pago-multipago.component';

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
        { path: 'MisPagos', component: MisPagosComponent,canActivate:[AlumnoGuard]},
        { path: 'Categoria', component: CategoriaComponent,canActivate:[AlumnoGuard]},

        { path: 'MisPagos/tarjeta/:Identificador', component: PagoGeneralComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/visa/:Identificador', component: PagoVisaComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/wompi/:Identificador', component: PagoWompiComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/conekta/:Identificador', component: PagoConektaComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/multipago/:Identificador', component: PagoMultipagoComponent,canActivate:[AlumnoGuard]},

        { path: 'MisCursos/:IdMatricula', component: CursoComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:IdMatricula', component: PagoComponent,canActivate:[AlumnoGuard]},

        { path: 'PagoExitoso/:Identificador', component: ResultadoPagoComponent,canActivate:[AlumnoGuard]},
        { path: 'MisCursosPrueba/:IdRegistroPrueba', component: CursoPruebaComponent,canActivate:[AlumnoGuard]},

        { path: 'MisPagos/:IdMatricula/tarjeta/:Identificador', component: ConfirmacionPagoTarjetaComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:IdMatricula/visa/:Identificador', component: ConfirmacionPagoTarjetaVisaComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:IdMatricula/wompi/:Identificador', component: ConfirmacionPagoTarjetaWompiComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:IdMatricula/conekta/:Identificador', component: ConfirmacionPagoTarjetaConektaComponent,canActivate:[AlumnoGuard]},

        { path: 'MisCursos/:IdMatricula/:idPEspecificoHijo', component: ModuloComponent,canActivate:[AlumnoGuard]},
        { path: 'MisCursosPrueba/:IdRegistroPrueba/:idPEspecificoHijo', component: ModuloPruebaComponent,canActivate:[AlumnoGuard]},

        //tipo: 1.-sesiones/subsesiones 2.-Tarea 3.-Encuesta 4.- Tarea Calificar
        { path: 'MisCursos/:IdMatricula/:idPEspecificoHijo/:Tipo/:IdCapitulo/:IdSesion', component: SesionesComponent,canActivate:[AlumnoGuard]},
        { path: 'MisCursosPrueba/:IdRegistroPrueba/:idPEspecificoHijo/:Tipo/:IdCapitulo/:IdSesion', component: SesionesPruebaComponent,canActivate:[AlumnoGuard]},
        { path: '**', component: ErrorPageComponent},
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AulaVirtualRoutingModule { }
