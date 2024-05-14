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
import { OfertaLaboralComponent } from './bolsa-trabajo/oferta-laboral/oferta-laboral.component';
import { MisPostulacionesComponent } from './bolsa-trabajo/mis-postulaciones/mis-postulaciones.component';
import { DevolverProyectoComponent } from './docencia-tareas/devolver-proyecto/devolver-proyecto.component';
import { EvalComponent } from './eval/eval.component';
import { ConfirmacionPagoMercadoPagoChileComponent } from './confirmacion-pago-mercado-pago-chile/confirmacion-pago-mercado-pago-chile.component';
import { ResultadoPagoMercadopagoComponent } from './resultado-pago-mercadopago/resultado-pago-mercadopago.component';
import { ConfirmacionPagoOpenpayColombiaComponent } from './confirmacion-pago-openpay-colombia/confirmacion-pago-openpay-colombia.component';
import { PagoMercadoPagoComponent } from './confirmacion-pago-organico/pago-mercado-pago/pago-mercado-pago.component';
import { ConfirmacionPagoOpenpayPeruComponent } from './confirmacion-pago-openpay-peru/confirmacion-pago-openpay-peru.component';
import { ModalPagoVisaComponent } from './modal-confirmacion-pago/modal-pago-visa/modal-pago-visa.component';
import { ModalPagoTarjetaComponent } from './modal-confirmacion-pago/modal-pago-tarjeta/modal-pago-tarjeta.component';
import { ModalPagoIzipayComponent } from './modal-confirmacion-pago/modal-pago-izipay/modal-pago-izipay.component';
import { Visa2Component } from './modal-confirmacion-pago/pagos-organicos/visa2/visa2.component';
import { Tarjeta2Component } from './modal-confirmacion-pago/pagos-organicos/tarjeta2/tarjeta2.component';
import { Wompi2Component } from './modal-confirmacion-pago/pagos-organicos/wompi2/wompi2.component';
import { Conekta2Component } from './modal-confirmacion-pago/pagos-organicos/conekta2/conekta2.component';
import { Multipago2Component } from './modal-confirmacion-pago/pagos-organicos/multipago2/multipago2.component';
import { Webpay2Component } from './modal-confirmacion-pago/pagos-organicos/webpay2/webpay2.component';
import { Mercadopago2Component } from './modal-confirmacion-pago/pagos-organicos/mercadopago2/mercadopago2.component';
import { ModalPagoOpenpayPeruComponent } from './modal-confirmacion-pago/modal-pago-openpay-peru/modal-pago-openpay-peru.component';
import { ModalPagoTarjetaMexicoComponent } from './modal-confirmacion-pago/modal-pago-tarjeta-mexico/modal-pago-tarjeta-mexico.component';
import { ModalPagoConektaComponent } from './modal-confirmacion-pago/modal-pago-conekta/modal-pago-conekta.component';
import { ModalPagoWebpayComponent } from './modal-confirmacion-pago/modal-pago-webpay/modal-pago-webpay.component';
import { ModalPagoMercadoPagoChileComponent } from './modal-confirmacion-pago/modal-pago-mercado-pago-chile/modal-pago-mercado-pago-chile.component';
import { ModalPagoWompiComponent } from './modal-confirmacion-pago/modal-pago-wompi/modal-pago-wompi.component';
import { ModalPagoOpenpayColombiaComponent } from './modal-confirmacion-pago/modal-pago-openpay-colombia/modal-pago-openpay-colombia.component';
import { ModalPagoMultipagoComponent } from './modal-confirmacion-pago/modal-pago-multipago/modal-pago-multipago.component';

import { AsistenciaAlumnoComponent } from './curso/asistencia-alumno/asistencia-alumno.component';
import { ConfirmCertFisicoComponent } from './curso/curso-certificado-fisico/confirm-cert-fisico/confirm-cert-fisico.component';
import { PerfilAlumnosComponent } from './docencia/perfil-alumnos/perfil-alumnos.component';
import { DocenciaGestionAsistenciaComponent } from './docencia/docencia-gestion-asistencia/docencia-gestion-asistencia.component';
import { RegistroAsistenciaComponent } from './docencia/registro-asistencia/registro-asistencia.component';
import { DocenciaAccesoClasesComponent } from './docencia-v2/docencia-acceso-clases/docencia-acceso-clases.component';
import { DocenciaCursosOnlineComponent } from './docencia-v2/docencia-cursos-online/docencia-cursos-online.component';
import { DocenciaV2CursosOnlineComponent } from './docencia-v2-cursos-online/docencia-v2-cursos-online.component';
import { AdministrarSesionComponent } from './docencia-v2-cursos-online/administrar-sesion/administrar-sesion.component';
import { RegistrarAsistenciaOnlineComponent } from './docencia-v2-cursos-online/administrar-sesion/registrar-asistencia-online/registrar-asistencia-online.component';
import { CursoNotasComponent } from './curso/curso-notas/curso-notas.component';
import { PespecificoSesionTemaComponent } from './docencia-v2-cursos-online/administrar-sesion/pespecifico-sesion-tema/pespecifico-sesion-tema.component';
import { PespecificoSesionRecursoConectividadComponent } from './docencia-v2-cursos-online/administrar-sesion/pespecifico-sesion-recurso-conectividad/pespecifico-sesion-recurso-conectividad.component';
import { PespecificoSesionEsquemaComponent } from './docencia-v2-cursos-online/administrar-sesion/pespecifico-sesion-esquema/pespecifico-sesion-esquema.component';
import { AgregarTareaComponent } from './docencia-v2-cursos-online/administrar-sesion/pespecifico-sesion-esquema/agregar-tarea/agregar-tarea.component';
import { AgregarCuestionarioComponent } from './docencia-v2-cursos-online/administrar-sesion/pespecifico-sesion-esquema/agregar-cuestionario/agregar-cuestionario.component';
import { AgregarPreguntasComponent } from './docencia-v2-cursos-online/administrar-sesion/pespecifico-sesion-esquema/agregar-cuestionario/agregar-preguntas/agregar-preguntas.component';
import { MaterialEstudioDocenteComponent } from './docencia-v2-cursos-online/material-estudio-docente/material-estudio-docente.component';
import { SilaboDocenteComponent } from './docencia-v2-cursos-online/silabo-docente/silabo-docente.component';
import { CriterioEvaluacionDocenteComponent } from './docencia-v2-cursos-online/criterio-evaluacion-docente/criterio-evaluacion-docente.component';
import { PerfilAlumnoDocenteComponent } from './docencia-v2-cursos-online/perfil-alumno-docente/perfil-alumno-docente.component';
import { CronogramaClasesDocenteComponent } from './docencia-v2-cursos-online/cronograma-clases-docente/cronograma-clases-docente.component';
import { NotaDocenteComponent } from './docencia-v2-cursos-online/nota-docente/nota-docente.component';
import { RegistrarForoVideoComponent } from './sesiones/sesion-video/registrar-foro-video/registrar-foro-video.component';
import { RegistrarForoTareaComponent } from './sesiones/sesion-tarea/registrar-foro-tarea/registrar-foro-tarea.component';
import { CursoForoProyectoContenidoComponent } from './curso/curso-proyecto/curso-foro-proyecto-contenido/curso-foro-proyecto-contenido.component';
import { CursoForoProyectoInsertComponent } from './curso/curso-proyecto/curso-foro-proyecto-insert/curso-foro-proyecto-insert.component';
import { ModuloSesionesOnlineComponent } from './modulo/modulo-sesiones-online/modulo-sesiones-online.component';
import { EnvioTareaComponent } from './modulo/modulo-sesiones-online/envio-tarea/envio-tarea.component';
import { EnvioCuestionarioComponent } from './modulo/modulo-sesiones-online/envio-cuestionario/envio-cuestionario.component';
import { AsistenciasOnlineComponent } from './modulo/asistencias-online/asistencias-online.component';
import { GestionAsistenciaProgramaComponent } from './curso/gestion-asistencia-programa/gestion-asistencia-programa.component';
import { DocenciaCursosAonlineComponent } from './docencia-v2/docencia-cursos-aonline/docencia-cursos-aonline.component';
import { DocenciaCursosAonlineResponderForoComponent } from './docencia-v2/docencia-cursos-aonline/docencia-cursos-aonline-responder-foro/docencia-cursos-aonline-responder-foro.component';
import { DocenciaCursosAonlineCalificarProyectoAplicacionComponent } from './docencia-v2/docencia-cursos-aonline/docencia-cursos-aonline-calificar-proyecto-aplicacion/docencia-cursos-aonline-calificar-proyecto-aplicacion.component';
import { DocenciaCursosAonlineCalificarTrabajoParesComponent } from './docencia-v2/docencia-cursos-aonline/docencia-cursos-aonline-calificar-trabajo-pares/docencia-cursos-aonline-calificar-trabajo-pares.component';
import { DocenciaResponerForoCursoComponent } from './docencia-v2/docencia-cursos-aonline/docencia-cursos-aonline-responder-foro/docencia-responder-foro-curso/docencia-responer-foro-curso.component';
import { DocenciaResponderForoCursoModalComponent } from './docencia-v2/docencia-cursos-aonline/docencia-cursos-aonline-responder-foro/docencia-responder-foro-curso-modal/docencia-responder-foro-curso-modal.component';
import { DocenciaCalificarTrabajoParesComponent } from './docencia-v2/docencia-cursos-aonline/docencia-cursos-aonline-calificar-trabajo-pares/docencia-calificar-trabajo-pares/docencia-calificar-trabajo-pares.component';
import { DocenciaCalificarTrabajoParesModalComponent } from './docencia-v2/docencia-cursos-aonline/docencia-cursos-aonline-calificar-trabajo-pares/docencia-calificar-trabajo-pares-modal/docencia-calificar-trabajo-pares-modal.component';
import { DocenciaCalificarProyectoAplicacionComponent } from './docencia-v2/docencia-cursos-aonline/docencia-cursos-aonline-calificar-proyecto-aplicacion/docencia-calificar-proyecto-aplicacion/docencia-calificar-proyecto-aplicacion.component';
import { DocenciaCalificarProyectoAplicacionModalComponent } from './docencia-v2/docencia-cursos-aonline/docencia-cursos-aonline-calificar-proyecto-aplicacion/docencia-calificar-proyecto-aplicacion-modal/docencia-calificar-proyecto-aplicacion-modal.component';
import { ModuloCalificacionesOnlineComponent } from './modulo/modulo-calificaciones/modulo-calificaciones-online/modulo-calificaciones-online.component';
import { CalificarActividadesDocenteComponent } from './docencia-v2-cursos-online/calificar-actividades-docente/calificar-actividades-docente.component';
import { CalificarCuestionarioDocenteComponent } from './docencia-v2-cursos-online/calificar-actividades-docente/calificar-cuestionario-docente/calificar-cuestionario-docente.component';
import { CalificarTareaDocenteComponent } from './docencia-v2-cursos-online/calificar-actividades-docente/calificar-tarea-docente/calificar-tarea-docente.component';
import { DetallesCuestionarioComponent } from './docencia-v2-cursos-online/calificar-actividades-docente/calificar-cuestionario-docente/detalles-cuestionario/detalles-cuestionario.component';
import { LineamientosTareaOnlineComponent } from './docencia-v2-cursos-online/calificar-actividades-docente/calificar-tarea-docente/lineamientos-tarea-online/lineamientos-tarea-online.component';
import { VistaPreviaCuestionarioComponent } from './docencia-v2-cursos-online/administrar-sesion/pespecifico-sesion-esquema/vista-previa-cuestionario/vista-previa-cuestionario.component';
import { RecursosTareaComponent } from './docencia-v2-cursos-online/administrar-sesion/pespecifico-sesion-esquema/recursos-tarea/recursos-tarea.component';
import { RecursosCuestionarioComponent } from './docencia-v2-cursos-online/administrar-sesion/pespecifico-sesion-esquema/recursos-cuestionario/recursos-cuestionario.component';
import { RegistrarForoProyectoComponent } from './curso/curso-proyecto/registrar-foro-proyecto/registrar-foro-proyecto.component';
import { CursoModulosCarrerasProfesionalesComponent } from './curso/curso-modulos-carreras-profesionales/curso-modulos-carreras-profesionales.component';
import { CursoTramitesCarreraComponent } from './curso/curso-tramites-carrera/curso-tramites-carrera.component';
import { CardTramitesCarreraComponent } from './curso/curso-tramites-carrera/card-tramites-carrera/card-tramites-carrera.component';
import { TramitesInformacionPersonalComponent } from './curso/curso-tramites-carrera/tramites-informacion-personal/tramites-informacion-personal.component';
import { TramitesCertificadoIdiomaComponent } from './curso/curso-tramites-carrera/tramites-certificado-idioma/tramites-certificado-idioma.component';
import { TramitesCertificadoEstudiosComponent } from './curso/curso-tramites-carrera/tramites-certificado-estudios/tramites-certificado-estudios.component';
import { TramitesGradoBachillerComponent } from './curso/curso-tramites-carrera/tramites-grado-bachiller/tramites-grado-bachiller.component';
import { TramitesConstanciaMatriculaComponent } from './curso/curso-tramites-carrera/tramites-constancia-matricula/tramites-constancia-matricula.component';
import { TramitesDiplomaTituloComponent } from './curso/curso-tramites-carrera/tramites-diploma-titulo/tramites-diploma-titulo.component';
import { CursoNotasCarrerasProfesionalesComponent } from './curso/curso-notas-carreras-profesionales/curso-notas-carreras-profesionales.component';
import { CursoCertificadoCarrerasProfesionalesComponent } from './curso/curso-certificado-carreras-profesionales/curso-certificado-carreras-profesionales.component';

import { ExamenSuficienciaComponent } from './curso/examen-suficiencia/examen-suficiencia.component';

import { AsistenciasCarrerasProfesionalesComponent } from './modulo/asistencias-carreras-profesionales/asistencias-carreras-profesionales.component';
import { GestionAsistenciaProgramaCarreraProfesionalComponent } from './curso/gestion-asistencia-programa-carrera-profesional/gestion-asistencia-programa-carrera-profesional.component';
import { CertificadoTituloCarrerasProfesionalesComponent } from './curso/curso-certificado-carreras-profesionales/certificado-titulo-carreras-profesionales/certificado-titulo-carreras-profesionales.component';
import { CertificadoEstudiosCarrerasProfesionalesComponent } from './curso/curso-certificado-carreras-profesionales/certificado-estudios-carreras-profesionales/certificado-estudios-carreras-profesionales.component';
import { CertificadoBachillerCarrerasProfesionalesComponent } from './curso/curso-certificado-carreras-profesionales/certificado-bachiller-carreras-profesionales/certificado-bachiller-carreras-profesionales.component';
import { ModalCertificadoEstudiosCarrerasProfesionalesComponent } from './curso/curso-certificado-carreras-profesionales/certificado-estudios-carreras-profesionales/modal-certificado-estudios-carreras-profesionales/modal-certificado-estudios-carreras-profesionales.component';
import { ModalCertificadoBachillerCarrerasProfesionalesComponent } from './curso/curso-certificado-carreras-profesionales/certificado-bachiller-carreras-profesionales/modal-certificado-bachiller-carreras-profesionales/modal-certificado-bachiller-carreras-profesionales.component';
import { ModalCertificadoTituloCarrerasProfesionalesComponent } from './curso/curso-certificado-carreras-profesionales/certificado-titulo-carreras-profesionales/modal-certificado-certificado-titulo-carreras-profesionales/modal-certificado-titulo-carreras-profesionales.component';
import { ExamenCarreraComponent } from './examen-carrera/examen-carrera.component';
import { CursoTrabajoAplicacionProfesionalComponent } from './curso/curso-trabajo-aplicacion-profesional/curso-trabajo-aplicacion-profesional.component';
import { ModalTrabajoAplicacionProfesionalComponent } from './curso/curso-trabajo-aplicacion-profesional/modal-trabajo-aplicacion-profesional/modal-trabajo-aplicacion-profesional.component';
import { DocenciaCarrerasProfesionalesComponent } from './docencia-v2/docencia-carreras-profesionales/docencia-carreras-profesionales.component';
import { DocenciaExamenSuficienciaProfesionalComponent } from './docencia-v2/docencia-carreras-profesionales/docencia-examen-suficiencia-profesional/docencia-examen-suficiencia-profesional.component';
import { DocenciaTrabajoAplicacionProfesionalComponent } from './docencia-v2/docencia-carreras-profesionales/docencia-trabajo-aplicacion-profesional/docencia-trabajo-aplicacion-profesional.component';
import { CrearTrabajoAplicacionComponent } from './docencia-v2/docencia-carreras-profesionales/docencia-trabajo-aplicacion-profesional/crear-trabajo-aplicacion/crear-trabajo-aplicacion.component';
import { CalificarTrabajoAplicacionComponent } from './docencia-v2/docencia-carreras-profesionales/docencia-trabajo-aplicacion-profesional/calificar-trabajo-aplicacion/calificar-trabajo-aplicacion.component';
import { ModalTrabajoAplicacionComponent } from './docencia-v2/docencia-carreras-profesionales/docencia-trabajo-aplicacion-profesional/crear-trabajo-aplicacion/modal-trabajo-aplicacion/modal-trabajo-aplicacion.component';
import { CrearExamenAplicacionComponent } from './docencia-v2/docencia-carreras-profesionales/docencia-examen-suficiencia-profesional/crear-examen-aplicacion/crear-examen-aplicacion.component';
import { CalificarExamenAplicacionComponent } from './docencia-v2/docencia-carreras-profesionales/docencia-examen-suficiencia-profesional/calificar-examen-aplicacion/calificar-examen-aplicacion.component';
import { ModalExamenAplicacionComponent } from './docencia-v2/docencia-carreras-profesionales/docencia-examen-suficiencia-profesional/crear-examen-aplicacion/modal-examen-aplicacion/modal-examen-aplicacion.component';
import { ModalPrevisualizacionExamenAplicacionComponent } from './docencia-v2/docencia-carreras-profesionales/docencia-examen-suficiencia-profesional/crear-examen-aplicacion/modal-previsualizacion-examen-aplicacion/modal-previsualizacion-examen-aplicacion.component';
import { ModalExamenAplicacionPreguntasComponent } from './docencia-v2/docencia-carreras-profesionales/docencia-examen-suficiencia-profesional/crear-examen-aplicacion/modal-examen-aplicacion/modal-examen-aplicacion-preguntas/modal-examen-aplicacion-preguntas.component';
import { CalificarExamenAplicacionDetalleComponent } from './docencia-v2/docencia-carreras-profesionales/docencia-examen-suficiencia-profesional/calificar-examen-aplicacion/calificar-examen-aplicacion-detalle/calificar-examen-aplicacion-detalle.component';
import { CursoHerramientasAdicionalesComponent } from './curso/curso-herramientas-adicionales/curso-herramientas-adicionales.component';
import { CursoGoogleWorkspacesComponent } from './curso/curso-google-workspaces/curso-google-workspaces.component';



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
    OfertaLaboralComponent,
    MisPostulacionesComponent,
    DevolverProyectoComponent,
    EvalComponent,
    ResultadoPagoMercadopagoComponent,
    ConfirmacionPagoMercadoPagoChileComponent,
    ConfirmacionPagoOpenpayColombiaComponent,
    AsistenciaAlumnoComponent,
    ConfirmCertFisicoComponent,
    PerfilAlumnosComponent,
    DocenciaGestionAsistenciaComponent,
    RegistroAsistenciaComponent,
    DocenciaAccesoClasesComponent,
    DocenciaCursosOnlineComponent,
    DocenciaV2CursosOnlineComponent,
    AdministrarSesionComponent,
    RegistrarAsistenciaOnlineComponent,
    CursoNotasComponent,
    PespecificoSesionTemaComponent,
    PespecificoSesionRecursoConectividadComponent,
    PespecificoSesionEsquemaComponent,
    AgregarTareaComponent,
    AgregarCuestionarioComponent,
    AgregarPreguntasComponent,
    MaterialEstudioDocenteComponent,
    SilaboDocenteComponent,
    CriterioEvaluacionDocenteComponent,
    PerfilAlumnoDocenteComponent,
    CronogramaClasesDocenteComponent,
    NotaDocenteComponent,
    RegistrarForoVideoComponent,
    RegistrarForoTareaComponent,
    CursoForoProyectoContenidoComponent,
    CursoForoProyectoInsertComponent,
    ModuloSesionesOnlineComponent,
    EnvioTareaComponent,
    EnvioCuestionarioComponent,
    AsistenciasOnlineComponent,
    GestionAsistenciaProgramaComponent,
    DocenciaCursosAonlineComponent,
    DocenciaCursosAonlineResponderForoComponent,
    DocenciaCursosAonlineCalificarProyectoAplicacionComponent,
    DocenciaCursosAonlineCalificarTrabajoParesComponent,
    DocenciaResponerForoCursoComponent,
    DocenciaResponderForoCursoModalComponent,
    DocenciaCalificarTrabajoParesComponent,
    DocenciaCalificarTrabajoParesModalComponent,
    DocenciaCalificarProyectoAplicacionComponent,
    DocenciaCalificarProyectoAplicacionModalComponent,
    ModuloCalificacionesOnlineComponent,
    CalificarActividadesDocenteComponent,
    CalificarCuestionarioDocenteComponent,
    CalificarTareaDocenteComponent,
    DetallesCuestionarioComponent,
    LineamientosTareaOnlineComponent,
    VistaPreviaCuestionarioComponent,
    RecursosTareaComponent,
    RecursosCuestionarioComponent,
    RegistrarForoProyectoComponent,
    CursoModulosCarrerasProfesionalesComponent,
    CursoTramitesCarreraComponent,
    CardTramitesCarreraComponent,
    TramitesInformacionPersonalComponent,
    TramitesCertificadoIdiomaComponent,
    TramitesCertificadoEstudiosComponent,
    TramitesGradoBachillerComponent,
    TramitesConstanciaMatriculaComponent,
    TramitesDiplomaTituloComponent,
    CursoNotasCarrerasProfesionalesComponent,
    CursoCertificadoCarrerasProfesionalesComponent,
    ExamenSuficienciaComponent,
    AsistenciasCarrerasProfesionalesComponent,
    GestionAsistenciaProgramaCarreraProfesionalComponent,
    CertificadoTituloCarrerasProfesionalesComponent,
    CertificadoEstudiosCarrerasProfesionalesComponent,
    CertificadoBachillerCarrerasProfesionalesComponent,
    ModalCertificadoEstudiosCarrerasProfesionalesComponent,
    ModalCertificadoBachillerCarrerasProfesionalesComponent,
    ModalCertificadoTituloCarrerasProfesionalesComponent,
    ExamenCarreraComponent,
    CursoTrabajoAplicacionProfesionalComponent,
    ModalTrabajoAplicacionProfesionalComponent,
    DocenciaCarrerasProfesionalesComponent,
    DocenciaExamenSuficienciaProfesionalComponent,
    DocenciaTrabajoAplicacionProfesionalComponent,
    CrearTrabajoAplicacionComponent,
    CalificarTrabajoAplicacionComponent,
    ModalTrabajoAplicacionComponent,
    CrearExamenAplicacionComponent,
    CalificarExamenAplicacionComponent,
    ModalExamenAplicacionComponent,
    ModalPrevisualizacionExamenAplicacionComponent,
    ModalExamenAplicacionPreguntasComponent,
    CalificarExamenAplicacionDetalleComponent,
    ConfirmacionPagoMercadoPagoChileComponent,
    ConfirmacionPagoOpenpayColombiaComponent,
    PagoMercadoPagoComponent,
    ConfirmacionPagoOpenpayPeruComponent,
    ModalPagoVisaComponent,
    ModalPagoTarjetaComponent,
    ModalPagoIzipayComponent,
    Visa2Component,
    Tarjeta2Component,
    Wompi2Component,
    Conekta2Component,
    Multipago2Component,
    Webpay2Component,
    Mercadopago2Component,
    ModalPagoOpenpayPeruComponent,
    ModalPagoTarjetaMexicoComponent,
    ModalPagoConektaComponent,
    ModalPagoWebpayComponent,
    ModalPagoMercadoPagoChileComponent,
    ModalPagoWompiComponent,
    ModalPagoOpenpayColombiaComponent,
    ModalPagoMultipagoComponent,
    CursoHerramientasAdicionalesComponent,
    CursoGoogleWorkspacesComponent
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
