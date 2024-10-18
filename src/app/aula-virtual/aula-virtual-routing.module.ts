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
import { DocenciaV2Component } from './docencia-v2/docencia-v2.component';
import { BolsaTrabajoGuard } from './Guard/bolsa-trabajo.guard';
import { BolsaTrabajoComponent } from './bolsa-trabajo/bolsa-trabajo.component';
import { VisaRecurrenteComponent } from './resultado-pago-recurrente/visa-recurrente/visa-recurrente.component';
import { EvalComponent } from './eval/eval.component';
import { ConfirmacionPagoMercadoPagoChileComponent } from './confirmacion-pago-mercado-pago-chile/confirmacion-pago-mercado-pago-chile.component';
import { ResultadoPagoMercadopagoComponent } from './resultado-pago-mercadopago/resultado-pago-mercadopago.component';
import { ConfirmacionPagoOpenpayColombiaComponent } from './confirmacion-pago-openpay-colombia/confirmacion-pago-openpay-colombia.component';
import { PagoMercadoPagoComponent } from './confirmacion-pago-organico/pago-mercado-pago/pago-mercado-pago.component';
import { ConfirmacionPagoOpenpayPeruComponent } from './confirmacion-pago-openpay-peru/confirmacion-pago-openpay-peru.component';
import { Tarjeta2Component } from './modal-confirmacion-pago/pagos-organicos/tarjeta2/tarjeta2.component';
import { PagoOrganicoTodosComponent } from './programas-pago-organico/pago-organico-todos.component';
import { DocenciaV2CursosOnlineComponent } from './docencia-v2-cursos-online/docencia-v2-cursos-online.component';
import { PagoMedioPagoComponent } from './pago/pago-medio-pago/pago-medio-pago.component';
import { DetallePagoInternacionalNiubizComponent } from './pago/pago-medio-pago/detalle-pago-internacional-niubiz/detalle-pago-internacional-niubiz.component';
import { DetallePagoInternacionalNiubizSecundarioComponent } from './pago/pago-medio-pago/detalle-pago-internacional-niubiz-secundario/detalle-pago-internacional-niubiz-secundario.component';
import { DetallePagoPeruNiubizComponent } from './pago/pago-medio-pago/detalle-pago-peru-niubiz/detalle-pago-peru-niubiz.component';
import { DetallePagoPeruNiubizSecundarioComponent } from './pago/pago-medio-pago/detalle-pago-peru-niubiz-secundario/detalle-pago-peru-niubiz-secundario.component';
import { DetallePagoPeruBilleteraElectronicaComponent } from './pago/pago-medio-pago/detalle-pago-peru-billetera-electronica/detalle-pago-peru-billetera-electronica.component';
import { DetallePagoPeruYapeComponent } from './pago/pago-medio-pago/detalle-pago-peru-yape/detalle-pago-peru-yape.component';
import { DetallePagoPeruIzipayComponent } from './pago/pago-medio-pago/detalle-pago-peru-izipay/detalle-pago-peru-izipay.component';
import { DetallePagoPeruOpenpayComponent } from './pago/pago-medio-pago/detalle-pago-peru-openpay/detalle-pago-peru-openpay.component';
import { DetallePagoMexicoOpenpayComponent } from './pago/pago-medio-pago/detalle-pago-mexico-openpay/detalle-pago-mexico-openpay.component';
import { DetallePagoColombiaOpenpayComponent } from './pago/pago-medio-pago/detalle-pago-colombia-openpay/detalle-pago-colombia-openpay.component';
import { DetallePagoColombiaWompiComponent } from './pago/pago-medio-pago/detalle-pago-colombia-wompi/detalle-pago-colombia-wompi.component';
import { DetallePagoColombiaPayuComponent } from './pago/pago-medio-pago/detalle-pago-colombia-payu/detalle-pago-colombia-payu.component';
import { DetallePagoChileWebpayComponent } from './pago/pago-medio-pago/detalle-pago-chile-webpay/detalle-pago-chile-webpay.component';
import { DetallePagoChileMercadopagoComponent } from './pago/pago-medio-pago/detalle-pago-chile-mercadopago/detalle-pago-chile-mercadopago.component';

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
        { path: 'DocenciaV2', component: DocenciaV2Component,canActivate:[ProveedorGuard]},
        { path: 'MisPagos', component: MisPagosComponent,canActivate:[AlumnoGuard]},
        { path: 'Categoria', component: CategoriaComponent,canActivate:[AlumnoGuard]},
        { path: 'BolsaTrabajo', component: BolsaTrabajoComponent,canActivate:[BolsaTrabajoGuard]},

        { path: 'MisPagos/tarjeta/:Identificador', component: PagoGeneralComponent,canActivate:[AlumnoGuard]},
        //Miguel pago peru
        { path: 'MisPagos/tarjeta2/:Identificador', component: Tarjeta2Component,canActivate:[AlumnoGuard]},


        { path: 'MisPagos/visa/:Identificador', component: PagoVisaComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/wompi/:Identificador', component: PagoWompiComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/conekta/:Identificador', component: PagoConektaComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/multipago/:Identificador', component: PagoMultipagoComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/webpay/:Identificador', component: PagoWebpayComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/mercadopago/:Identificador', component: PagoMercadoPagoComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/webpayResultado', component: ResultadoPagoWebpayComponent},

        { path: 'MisPagos/PagoOrganicoTodos', component: PagoOrganicoTodosComponent,canActivate:[AlumnoGuard]},


        { path: 'DocenciaV2/:IdPespecifico', component: DocenciaV2CursosOnlineComponent,canActivate:[ProveedorGuard]},
        { path: 'MisCursos/:IdMatricula', component: CursoComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:IdMatricula', component: PagoComponent,canActivate:[AlumnoGuard]},

        { path: 'MisPagos/:idmatricula/:idpasarelapago', component: PagoMedioPagoComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:idmatricula/:idpasarelapago/int-niubiz/:identificador', component: DetallePagoInternacionalNiubizComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:idmatricula/:idpasarelapago/int-niubiz-sec/:identificador', component: DetallePagoInternacionalNiubizSecundarioComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:idmatricula/:idpasarelapago/pe-niubiz/:identificador', component: DetallePagoPeruNiubizComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:idmatricula/:idpasarelapago/pe-niubiz-sec/:identificador', component: DetallePagoPeruNiubizSecundarioComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:idmatricula/:idpasarelapago/pe-bi-elec/:identificador', component: DetallePagoPeruBilleteraElectronicaComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:idmatricula/:idpasarelapago/pe-yape/:identificador', component: DetallePagoPeruYapeComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:idmatricula/:idpasarelapago/pe-izipay/:identificador', component: DetallePagoPeruIzipayComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:idmatricula/:idpasarelapago/pe-openpay/:identificador', component: DetallePagoPeruOpenpayComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:idmatricula/:idpasarelapago/mex-openpay/:identificador', component: DetallePagoMexicoOpenpayComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:idmatricula/:idpasarelapago/col-openpay/:identificador', component: DetallePagoColombiaOpenpayComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:idmatricula/:idpasarelapago/col-wompi/:identificador', component: DetallePagoColombiaWompiComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:idmatricula/:idpasarelapago/col-payu/:identificador', component: DetallePagoColombiaPayuComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:idmatricula/:idpasarelapago/chi-webpay/:identificador', component: DetallePagoChileWebpayComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:idmatricula/:idpasarelapago/chi-mercadopago/:identificador', component: DetallePagoChileMercadopagoComponent,canActivate:[AlumnoGuard]},

        { path: 'Docencia/:IdTarea', component: DocenciaTareasComponent,canActivate:[ProveedorGuard]},

        { path: 'PagoExitosoPse/:Identificador', component: ResultadoPagoPSEComponent,canActivate:[AlumnoGuard]},
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
        { path: 'MisPagos/:IdMatricula/openpayCOP/:Identificador', component: ConfirmacionPagoOpenpayColombiaComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:IdMatricula/mercadoPago/:Identificador', component: ConfirmacionPagoMercadoPagoChileComponent,canActivate:[AlumnoGuard]},
        { path: 'MisPagos/:IdMatricula/openpayPEN/:Identificador', component: ConfirmacionPagoOpenpayPeruComponent,canActivate:[AlumnoGuard]},

        { path: 'MisPagos/:IdMatricula/openpayPEN/:Identificador', component: ConfirmacionPagoOpenpayPeruComponent,canActivate:[AlumnoGuard]},

        { path: 'MisPagos/:IdMatricula/openpayCOP/:Identificador', component: ConfirmacionPagoOpenpayColombiaComponent,canActivate:[AlumnoGuard]},
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
