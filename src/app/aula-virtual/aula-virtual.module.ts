import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AulaVirtualRoutingModule } from './aula-virtual-routing.module';
import { AulaVirtualComponent } from './aula-virtual.component';
import { SharedModule } from '../Core/Shared/shared.module';
import { CuentaComponent } from './cuenta/cuenta.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from '../Public/Interceptor/interceptor.service';
import { CuentaMiPerfilComponent } from './cuenta/cuenta-mi-perfil/cuenta-mi-perfil.component';
import { CuentaMisPagosComponent } from './cuenta/cuenta-mis-pagos/cuenta-mis-pagos.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { CambiarContraComponent } from './cambiar-contra/cambiar-contra.component';
import { MyHttpInterceptor } from './http.interceptor';
import { MisCursosComponent } from './mis-cursos/mis-cursos.component';
import { CursoComponent } from './curso/curso.component';
import { AvatarComponent } from './avatar/avatar.component';
import { IndicacionesContentComponent } from './curso/indicaciones-content/indicaciones-content.component';
import { IndicacionesOptionsContentComponent } from './curso/indicaciones-options-content/indicaciones-options-content.component';
import { CursoModulosComponent } from './curso/curso-modulos/curso-modulos.component';
import { ModuloComponent } from './modulo/modulo.component';
import { ModuloSesionesComponent } from './modulo/modulo-sesiones/modulo-sesiones.component';
import { SesionesComponent } from './sesiones/sesiones.component';
import { ModuloSilaboComponent } from './modulo/modulo-silabo/modulo-silabo.component';
import { ModuloForoComponent } from './modulo/modulo-foro/modulo-foro.component';
import { ModuloForoInsertComponent } from './modulo/modulo-foro/modulo-foro-insert/modulo-foro-insert/modulo-foro-insert.component';
import { SesionVideoComponent } from './sesiones/sesion-video/sesion-video.component';
import { ModuloForoContenidoComponent } from './modulo/modulo-foro/modulo-foro-contenido/modulo-foro-contenido.component';
import { SesionTareaComponent } from './sesiones/sesion-tarea/sesion-tarea.component';
import { CursoProyectoComponent } from './curso/curso-proyecto/curso-proyecto.component';
import { ModuloRecursoComponent } from './modulo/modulo-recurso/modulo-recurso.component';
import { ModuloCalificacionesComponent } from './modulo/modulo-calificaciones/modulo-calificaciones/modulo-calificaciones.component';
import { BeneficiosComponent } from './curso/beneficios/beneficios/beneficios.component';
import { ModuloWebinarsComponent } from './modulo/modulo-webinars/modulo-webinars/modulo-webinars.component';
import { SesionEncuestaComponent } from './sesiones/sesion-encuesta/sesion-encuesta.component';
import { CursoCertificadoComponent } from './curso/curso-certificado/curso-certificado.component';
import { CursoTramitesComponent } from './curso/curso-tramites/curso-tramites/curso-tramites.component';
import { CursoCertificadoDigitalComponent } from './curso/curso-certificado-digital/curso-certificado-digital.component';
import { SesionTareaCalificarComponent } from './sesiones/sesion-tarea-calificar/sesion-tarea-calificar.component';
import { CursoCertificadoFisicoComponent } from './curso/curso-certificado-fisico/curso-certificado-fisico.component';
import { DocenciaComponent } from './docencia/docencia.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { DocenciaSesionesWebinarComponent } from './docencia/docencia-sesiones-webinar/docencia-sesiones-webinar.component';
import { DocenciaForosComponent } from './docencia/docencia-foros/docencia-foros.component';
import { DocenciaForosModalComponent } from './docencia/docencia-foros/docencia-foros-modal/docencia-foros-modal.component';
import { MisPagosComponent } from './mis-pagos/mis-pagos.component';
import { PagoComponent } from './pago/pago.component';
import { PagoTarjetaComponent } from './pago/pago-tarjeta/pago-tarjeta.component';
import { ConfirmacionPagoTarjetaComponent } from './confirmacion-pago-tarjeta/confirmacion-pago-tarjeta.component';
import { ConfirmacionPagoTarjetaVisaComponent } from './confirmacion-pago-tarjeta-visa/confirmacion-pago-tarjeta-visa.component';
import { ResultadoPagoComponent } from './resultado-pago/resultado-pago.component';
import { CursoPruebaComponent } from './curso-prueba/curso-prueba/curso-prueba.component';
import { CursoPruebaModulosComponent } from './curso-prueba/curso-prueba/curso-prueba-modulos/curso-prueba-modulos/curso-prueba-modulos.component';
import { ModuloPruebaComponent } from './modulo-prueba/modulo-prueba.component';
import { ModuloForoPruebaComponent } from './modulo-prueba/modulo-foro-prueba/modulo-foro-prueba/modulo-foro-prueba.component';
import { ModuloRecursoPruebaComponent } from './modulo-prueba/modulo-recurso-prueba/modulo-recurso-prueba/modulo-recurso-prueba.component';
import { ModuloSilaboPruebaComponent } from './modulo-prueba/modulo-silabo-prueba/modulo-silabo-prueba/modulo-silabo-prueba.component';
import { ModuloSesionesPruebaComponent } from './modulo-prueba/modulo-sesiones-prueba/modulo-sesiones-prueba/modulo-sesiones-prueba.component';
import { ModuloForoContenidoPruebaComponent } from './modulo-prueba/modulo-foro-prueba/modulo-foro-prueba/modulo-foro-contenido-prueba/modulo-foro-contenido-prueba/modulo-foro-contenido-prueba.component';
import { SesionesPruebaComponent } from './sesiones-prueba/sesiones-prueba.component';
import { SesionesVideoPruebaComponent } from './sesiones-prueba/sesiones-video-prueba/sesiones-video-prueba/sesiones-video-prueba.component';
import { ModuloAyudaComponent } from './modulo/modulo-ayuda/modulo-ayuda/modulo-ayuda.component';
import { ModuloAyudaPreguntasFrecuentesComponent } from './modulo/modulo-ayuda/modulo-ayuda/modulo-ayuda-preguntas-frecuentes/modulo-ayuda-preguntas-frecuentes/modulo-ayuda-preguntas-frecuentes.component';
import { ModuloAyudaQuejasSugerenciasComponent } from './modulo/modulo-ayuda/modulo-ayuda/modulo-ayuda-quejas-sugerencias/modulo-ayuda-quejas-sugerencias/modulo-ayuda-quejas-sugerencias.component';
import { RegistrarErrorComponent } from './sesiones/sesion-video/registrar-error/registrar-error/registrar-error.component';
import { VigenciaAccesoPruebaComponent } from './mis-cursos/vigencia-acceso-prueba/vigencia-acceso-prueba/vigencia-acceso-prueba.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { PagoWompiComponent } from './confirmacion-pago-organico/pago-wompi/pago-wompi.component';
import { PagoVisaComponent } from './confirmacion-pago-organico/pago-visa/pago-visa.component';
import { PagoConektaComponent } from './confirmacion-pago-organico/pago-conekta/pago-conekta.component';
import { PagoGeneralComponent } from './confirmacion-pago-organico/pago-general/pago-general.component';
import { ConfirmacionPagoTarjetaWompiComponent } from './confirmacion-pago-tarjeta-wompi/confirmacion-pago-tarjeta-wompi.component';
import { ConfirmacionPagoTarjetaConektaComponent } from './confirmacion-pago-tarjeta-conekta/confirmacion-pago-tarjeta-conekta.component';
import { PagoMultipagoComponent } from './confirmacion-pago-organico/pago-multipago/pago-multipago.component';
import { DocenciaGestionNotasComponent } from './docencia/docencia-gestion-notas/docencia-gestion-notas.component';
import { DocenciaGestionNotasRegistroComponent } from './docencia/docencia-gestion-notas/docencia-gestion-notas-registro/docencia-gestion-notas-registro.component';
import { DocenciaGestionAsistenciasComponent } from './docencia/docencia-gestion-asistencias/docencia-gestion-asistencias.component';
import { DocenciaGestionAsistenciasRegistroComponent } from './docencia/docencia-gestion-asistencias/docencia-gestion-asistencias-registro/docencia-gestion-asistencias-registro.component';
import { DocenciaGestionSilabosComponent } from './docencia/docencia-gestion-silabos/docencia-gestion-silabos.component';
import { DocenciaGestionSilabosRegistroComponent } from './docencia/docencia-gestion-silabos/docencia-gestion-silabos-registro/docencia-gestion-silabos-registro.component';
import { DocenciaGestionSilabosRegistroAddComponent } from './docencia/docencia-gestion-silabos/docencia-gestion-silabos-registro/docencia-gestion-silabos-registro-add/docencia-gestion-silabos-registro-add.component';
import { DocenciaGestionAutoevaluacionesComponent } from './docencia/docencia-gestion-autoevaluaciones/docencia-gestion-autoevaluaciones.component';
import { DocenciaTrabajoParesComponent } from './docencia/docencia-trabajo-pares/docencia-trabajo-pares.component';
import { DocenciaTareasComponent } from './docencia-tareas/docencia-tareas.component';
import { DocenciaActividadesAutoevaluacionComponent } from './docencia/docencia-actividades-autoevaluacion/docencia-actividades-autoevaluacion.component';
import { ConfirmacionPagoMultipagoComponent } from './confirmacion-pago-multipago/confirmacion-pago-multipago.component';
import { CursoClaseOnlineComponent } from './curso/curso-clase-online/curso-clase-online.component';
import { CursoSimuladoresComponent } from './curso/curso-simuladores/curso-simuladores.component';
import { CursoCertificadoIrcaComponent } from './curso/curso-certificado-irca/curso-certificado-irca.component';
import { CursoVideosSincronicoComponent } from './curso/curso-videos-sincronico/curso-videos-sincronico.component';
import { ModuloVideosSincronicoComponent } from './modulo/modulo-videos-sincronico/modulo-videos-sincronico.component';
import { ResultadoPagoPSEComponent } from './resultado-pago-pse/resultado-pago-pse.component';
import { RetroalimentacionTareaComponent } from './sesiones/sesion-tarea/retroalimentacion-tarea/retroalimentacion-tarea.component';
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
import { BolsaTrabajoComponent } from './bolsa-trabajo/bolsa-trabajo.component';
import { VisaRecurrenteComponent } from './resultado-pago-recurrente/visa-recurrente/visa-recurrente.component';
import { DevolverProyectoComponent } from './docencia-tareas/devolver-proyecto/devolver-proyecto.component';

import { AsistenciaAlumnoComponent } from './curso/asistencia-alumno/asistencia-alumno.component';
import { ConfirmCertFisicoComponent } from './curso/curso-certificado-fisico/confirm-cert-fisico/confirm-cert-fisico.component';
import { PerfilAlumnosComponent } from './docencia/perfil-alumnos/perfil-alumnos.component';
import { DocenciaGestionAsistenciaComponent } from './docencia/docencia-gestion-asistencia/docencia-gestion-asistencia.component';
import { RegistroAsistenciaComponent } from './docencia/registro-asistencia/registro-asistencia.component';
import { DocenciaAccesoClasesComponent } from './docencia/docencia-acceso-clases/docencia-acceso-clases.component';


@NgModule({
  declarations: [
    AulaVirtualComponent,
    CuentaComponent,
    CuentaMiPerfilComponent,
    CuentaMisPagosComponent,
    MiPerfilComponent,
    CambiarContraComponent,
    MisCursosComponent,
    CursoComponent,
    IndicacionesContentComponent,
    IndicacionesOptionsContentComponent,
    CursoModulosComponent,
    AvatarComponent,
    ModuloComponent,
    ModuloSesionesComponent,
    SesionesComponent,
    ModuloSilaboComponent,
    ModuloForoComponent,
    ModuloForoInsertComponent,
    SesionVideoComponent,
    ModuloForoContenidoComponent,
    SesionTareaComponent,
    CursoProyectoComponent,
    ModuloRecursoComponent,
    ModuloCalificacionesComponent,
    BeneficiosComponent,
    ModuloWebinarsComponent,
    SesionEncuestaComponent,
    CursoCertificadoComponent,
    CursoTramitesComponent,
    CursoCertificadoDigitalComponent,
    SesionTareaCalificarComponent,
    CursoCertificadoFisicoComponent,
    DocenciaComponent,
    ErrorPageComponent,
    DocenciaSesionesWebinarComponent,
    DocenciaForosComponent,
    DocenciaForosModalComponent,
    MisPagosComponent,
    PagoComponent,
    PagoTarjetaComponent,
    ConfirmacionPagoTarjetaComponent,
    ConfirmacionPagoTarjetaVisaComponent,
    ResultadoPagoComponent,
    CursoPruebaComponent,
    CursoPruebaModulosComponent,
    ModuloPruebaComponent,
    ModuloForoPruebaComponent,
    ModuloRecursoPruebaComponent,
    ModuloSilaboPruebaComponent,
    ModuloSesionesPruebaComponent,
    ModuloForoContenidoPruebaComponent,
    SesionesPruebaComponent,
    SesionesVideoPruebaComponent,
    ModuloAyudaComponent,
    ModuloAyudaPreguntasFrecuentesComponent,
    ModuloAyudaQuejasSugerenciasComponent,
    RegistrarErrorComponent,
    VigenciaAccesoPruebaComponent,
    CategoriaComponent,
    PagoWompiComponent,
    PagoVisaComponent,
    PagoConektaComponent,
    PagoGeneralComponent,
    ConfirmacionPagoTarjetaWompiComponent,
    ConfirmacionPagoTarjetaConektaComponent,
    PagoMultipagoComponent,
    DocenciaGestionNotasComponent,
    DocenciaGestionNotasRegistroComponent,
    DocenciaGestionAsistenciasComponent,
    DocenciaGestionAsistenciasRegistroComponent,
    DocenciaGestionSilabosComponent,
    DocenciaGestionSilabosRegistroComponent,
    DocenciaGestionSilabosRegistroAddComponent,
    DocenciaGestionAutoevaluacionesComponent,
    DocenciaTrabajoParesComponent,
    DocenciaTareasComponent,
    DocenciaActividadesAutoevaluacionComponent,
    ConfirmacionPagoMultipagoComponent,
    CursoClaseOnlineComponent,
    CursoSimuladoresComponent,
    CursoCertificadoIrcaComponent,
    CursoVideosSincronicoComponent,
    ModuloVideosSincronicoComponent,
    ResultadoPagoPSEComponent,
    RetroalimentacionTareaComponent,
    PagoWebpayComponent,
    ResultadoPagoWebpayComponent,
    ConfirmacionPagoWebpayComponent,
    ConfirmacionPagoIzipayComponent,
    ConfirmacionPagoKlapComponent,
    ResultadoPagoKlapComponent,
    AfiliacionOpenpayComponent,
    DesafiliacionOpenpayComponent,
    AfiliacionVisaComponent,
    ResultadoPagoIzipayComponent,
    AfiliacionIzipayComponent,
    DocenciaV2Component,
    BolsaTrabajoComponent,
    VisaRecurrenteComponent,
    DevolverProyectoComponent,
    AsistenciaAlumnoComponent,
    ConfirmCertFisicoComponent,
    PerfilAlumnosComponent,
    DocenciaGestionAsistenciaComponent,
    RegistroAsistenciaComponent,
    DocenciaAccesoClasesComponent,


  ],
  imports: [
    CommonModule,
    AulaVirtualRoutingModule,
    SharedModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MyHttpInterceptor, multi: true },
  ],
  exports:[
    VigenciaAccesoPruebaComponent
  ]
})
export class AulaVirtualModule { }
