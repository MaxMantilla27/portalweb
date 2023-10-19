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
import { PagoVisaComponent } from './confirmacion-pago-organico/pago-visa/pago-visa.component';
import { PagoWompiComponent } from './confirmacion-pago-organico/pago-wompi/pago-wompi.component';
import { PagoConektaComponent } from './confirmacion-pago-organico/pago-conekta/pago-conekta.component';
import { PagoGeneralComponent } from './confirmacion-pago-organico/pago-general/pago-general.component';
import { ConfirmacionPagoTarjetaWompiComponent } from './confirmacion-pago-tarjeta-wompi/confirmacion-pago-tarjeta-wompi.component';
import { ConfirmacionPagoTarjetaConektaComponent } from './confirmacion-pago-tarjeta-conekta/confirmacion-pago-tarjeta-conekta.component';
import { PagoMultipagoComponent } from './confirmacion-pago-organico/pago-multipago/pago-multipago.component';
import { DocenciaTareasComponent } from './docencia-tareas/docencia-tareas.component';
import { ConfirmacionPagoMultipagoComponent } from './confirmacion-pago-multipago/confirmacion-pago-multipago.component';
import { ResultadoPagoPSEComponent } from './resultado-pago-pse/resultado-pago-pse.component';
import { PagoWebpayComponent } from './confirmacion-pago-organico/pago-webpay/pago-webpay.component';
import { ResultadoPagoWebpayComponent } from './resultado-pago-webpay/resultado-pago-webpay.component';
import { ConfirmacionPagoWebpayComponent } from './confirmacion-pago-webpay/confirmacion-pago-webpay.component';
import { ConfirmacionPagoIzipayComponent } from './confirmacion-pago-izipay/confirmacion-pago-izipay.component';
import { ConfirmacionPagoKlapComponent } from './confirmacion-pago-klap/confirmacion-pago-klap.component';
import { ResultadoPagoKlapComponent } from './resultado-pago-klap/resultado-pago-klap.component';
import { AfiliacionOpenpayComponent } from './confirmacion-afiliacion-pago-recurrente/afiliacion-openpay/afiliacion-openpay.component';
import { DesafiliacionOpenpayComponent } from './confirmacion-desafiliacion-pago-recurrente/desafiliacion-openpay/desafiliacion-openpay.component';
import { AfiliacionVisaComponent } from './confirmacion-afiliacion-pago-recurrente/afiliacion-visa/afiliacion-visa.component';
import { ResultadoPagoIzipayComponent } from './resultado-pago-izipay/resultado-pago-izipay.component';
import { AfiliacionIzipayComponent } from './confirmacion-afiliacion-pago-recurrente/afiliacion-izipay/afiliacion-izipay.component';
import { BolsaTrabajoGuard } from './Guard/bolsa-trabajo.guard';
import { BolsaTrabajoComponent } from './bolsa-trabajo/bolsa-trabajo.component';
import { VisaRecurrenteComponent } from './resultado-pago-recurrente/visa-recurrente/visa-recurrente.component';
import { EvalComponent } from './eval/eval.component';
import { ConfirmacionPagoMercadoPagoChileComponent } from './confirmacion-pago-mercado-pago-chile/confirmacion-pago-mercado-pago-chile.component';
import { ResultadoPagoMercadopagoComponent } from './resultado-pago-mercadopago/resultado-pago-mercadopago.component';

const routes: Routes = [
  {
    path: '', component: AulaVirtualComponent ,canActivateChild: [AulaVirtualGuard] , children:
      [
        { path: 'Cuenta', component: CuentaComponent},
        { path: 'eval', component: EvalComponent},
        { path: 'MiPerfil', component: MiPerfilComponent,canActivate:[AlumnoGuard]},
        { path: 'ChangePassword', component: CambiarContraComponent,canActivate:[AlumnoGuard]},
        { path: 'MisCursos', component: MisCursosComponent,canActivate:[AlumnoGuard]},
        { path: 'Avatar', component: AvatarComponent,canActivate:[AlumnoGuard]},
        { path: 'Docencia', component: DocenciaComponent,canActivate:[ProveedorGuard]},
        { path: 'MisPagos', component: MisPagosComponent,canActivate:[AlumnoGuard]},
        { path: 'Categoria', component: CategoriaComponent,canActivate:[AlumnoGuard]},
        { path: 'BolsaTrabajo', component: BolsaTrabajoComponent,canActivate:[BolsaTrabajoGuard]},

        { path: 'MisPagos/tarjeta/:Identificador', component: PagoGeneralComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/visa/:Identificador', component: PagoVisaComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/wompi/:Identificador', component: PagoWompiComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/conekta/:Identificador', component: PagoConektaComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/multipago/:Identificador', component: PagoMultipagoComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/webpay/:Identificador', component: PagoWebpayComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/webpayResultado', component: ResultadoPagoWebpayComponent},

        { path: 'MisCursos/:IdMatricula', component: CursoComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:IdMatricula', component: PagoComponent,canActivate:[AlumnoGuard]},
        { path: 'Docencia/:IdTarea', component: DocenciaTareasComponent,canActivate:[ProveedorGuard]},

        { path: 'PagoExitosoPse/:estado', component: ResultadoPagoPSEComponent,canActivate:[AlumnoGuard]},
        { path: 'PagoExitoso/:Identificador', component: ResultadoPagoComponent,canActivate:[AlumnoGuard]},
        { path: 'PagoExitosoKlap/:Identificador', component: ResultadoPagoKlapComponent,canActivate:[AlumnoGuard]},
        { path: 'PagoExitosoIziPay/:Identificador', component: ResultadoPagoIzipayComponent,canActivate:[AlumnoGuard]},
        { path: 'PagoExitosoMercadoPago/:Identificador', component: ResultadoPagoMercadopagoComponent,canActivate:[AlumnoGuard]},

        // RespuestaPago Recurrente :
        { path: 'AfilicacionPagoRecurrente/:Identificador', component: VisaRecurrenteComponent,canActivate:[AlumnoGuard]},

        { path: 'MisCursosPrueba/:IdRegistroPrueba', component: CursoPruebaComponent,canActivate:[AlumnoGuard]},

        { path: 'MisPagos/:IdMatricula/tarjeta/:Identificador', component: ConfirmacionPagoTarjetaComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:IdMatricula/visa/:Identificador', component: ConfirmacionPagoTarjetaVisaComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:IdMatricula/wompi/:Identificador', component: ConfirmacionPagoTarjetaWompiComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:IdMatricula/conekta/:Identificador', component: ConfirmacionPagoTarjetaConektaComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:IdMatricula/multipago/:Identificador', component: ConfirmacionPagoMultipagoComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:IdMatricula/webpay/:Identificador', component: ConfirmacionPagoWebpayComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:IdMatricula/izipay/:Identificador', component: ConfirmacionPagoIzipayComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:IdMatricula/klap/:Identificador', component: ConfirmacionPagoKlapComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:IdMatricula/mercadoPago/:Identificador', component: ConfirmacionPagoMercadoPagoChileComponent,canActivate:[AlumnoGuard]},

        // Afiliaciones a Pagos Recurrentes
        { path: 'MisPagos/Afiliacion/:IdMatricula/openpay/:Identificador', component: AfiliacionOpenpayComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/Afiliacion/:IdMatricula/visa/:Identificador', component: AfiliacionVisaComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/Afiliacion/:IdMatricula/izipay/:Identificador', component: AfiliacionIzipayComponent,canActivate:[AlumnoGuard]},

        // Desafiliaciones a Pagos Recurrentes
        { path: 'MisPagos/Desafiliacion/:IdMatricula/openpay/:Identificador', component: DesafiliacionOpenpayComponent,canActivate:[AlumnoGuard]},

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
