import { NgModule } from '@angular/core';
import { PublicRoutingModule } from './public-routing.module';
import { SharedModule } from '../Core/Shared/shared.module';
import { PublicComponent } from './public.component';
import { HomeComponent } from './Home/home.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './Interceptor/interceptor.service';
import { HomeProgramasComponent } from './Home/home-programas/home-programas.component';
import { ProgramasComponent } from './programas/programas.component';
import { CarrerasProfesionalesComponent } from './carreras-profesionales/carreras-profesionales.component';
import { EducacionTecnicaComponent } from './educacion-tecnica/educacion-tecnica.component';
import { CarreraProfesionalDetalleComponent } from './carreras-profesionales/carrera-profesional-detalle/carrera-profesional-detalle.component';
import { ProgramasDetalleComponent } from './programas-detalle/programas-detalle.component';
import { EducationTecnicaDetalleComponent } from './educacion-tecnica/education-tecnica-detalle/education-tecnica-detalle.component';
import { LibroReclamacionesComponent } from './libro-reclamaciones/libro-reclamaciones.component';
import { BSCampusComponent } from './bscampus/bscampus.component';
import { WhitepapersComponent } from './bscampus/whitepapers/whitepapers.component';
import { BlogComponent } from './bscampus/blog/blog.component';
import { RegistrarseComponent } from './registrarse/registrarse.component';
import { TransparenciaComponent } from './transparencia/transparencia.component';
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';
import { PoliticaPrivacidadComponent } from './politica-privacidad/politica-privacidad.component';
import { AcercaDeComponent } from './acerca-de/acerca-de.component';
import { ContactenosComponent } from './contactenos/contactenos.component';
import { TagsComponent } from './tags/tags.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VistaPreviaComponent } from './programas-detalle/vista-previa/vista-previa.component';
import { FiltroProgramasComponent } from './programas/filtro-programas/filtro-programas.component';
import { ProgramaPagoComponent } from './programas-detalle/programa-pago/programa-pago.component';
import { LandingPageComponent } from './landing-page/landing-page/landing-page.component';
import { LandingPageInterceptorComponent } from './landing-page/landing-page/landing-page-interceptor/landing-page-interceptor/landing-page-interceptor.component';
import { PageErrorComponent } from './page-error/page-error/page-error.component';
import { ChatEnLineaComponent } from './chat-en-linea/chat-en-linea.component';
import { FormularioPublicidadComponent } from './FormularioPublicidad/formulario-publicidad.component';
import { FormularioPublicidadInterceptorComponent } from './FormularioPublicidad/FormularioPublicidadInterceptor/formulario-publicidad-interceptor.component';
import { NotificacionWebinarComponent } from './notificacion-webinar/notificacion-webinar.component';
import { InformacionCertificadoComponent } from './informacion-certificado/informacion-certificado.component';
import { CompraExitosaOpenPayComponent } from './compra-exitosa-open-pay/compra-exitosa-open-pay.component';
import { LandinPageV2Component } from './landin-page-v2/landin-page-v2.component';
import { LandingPageModalComponent } from './landin-page-v2/landing-page-modal/landing-page-modal.component';
import { TarifaGestionComponent } from './tarifa-gestion/tarifa-gestion.component';
import { HomePartnerComponent } from './Home/home-partner/home-partner.component';
import { HomeCasosExitosComponent } from './Home/home-casos-exitos/home-casos-exitos.component';
import { HomeLearningComponent } from './Home/home-learning/home-learning.component';
import { HomeCarrerasProfesionalesComponent } from './Home/home-carreras-profesionales/home-carreras-profesionales.component';
import { HomeEducacionTecnicaComponent } from './Home/home-educacion-tecnica/home-educacion-tecnica.component';
import { HomeFormacionContinuaComponent } from './Home/home-formacion-continua/home-formacion-continua.component';
import { ProgramaFormularioComponent } from './programas-detalle/programa-formulario/programa-formulario.component';
import { SorteoComponent } from './sorteo/sorteo.component';
import { LoginFacebookComponent } from './login/login-facebook/login-facebook.component';
import { LoginFacebookIngresarComponent } from './login/login-facebook/login-facebook-ingresar/login-facebook-ingresar.component';
import { LoginFacebookRegistrarComponent } from './login/login-facebook/login-facebook-registrar/login-facebook-registrar.component';
import { NotificacionBoliviaComponent } from './Home/notificacion-bolivia/notificacion-bolivia.component';
import { CompraExitosaOpenPayColombiaComponent } from './compra-exitosa-open-pay-colombia/compra-exitosa-open-pay-colombia.component';
import { ChatBotLandingPageComponent } from './chat-bot-landing-page/chat-bot-landing-page.component';
import { CompraExistosaOpenPayPeruComponent } from './compra-existosa-open-pay-peru/compra-existosa-open-pay-peru.component';
import { PagoOrganicoTodosComponent } from './programas-detalle/programas-pago-organico/pago-organico-todos/pago-organico-todos/pago-organico-todos.component';
import { ModalPagoVisaOrganicoComponent } from '../aula-virtual/modal-confirmacion-pago-organico/modal-pago-visa-organico/modal-pago-visa-organico/modal-pago-visa-organico.component';
import { ModalPagoTarjetaOrganicoComponent } from '../aula-virtual/modal-confirmacion-pago-organico/modal-pago-tarjeta-organico/modal-pago-tarjeta-organico/modal-pago-tarjeta-organico.component';
import { ModalPagoTarjetaMexicoOraganicoComponent } from '../aula-virtual/modal-confirmacion-pago-organico/modal-pago-tarjeta-mexico-organico/modal-pago-tarjeta-mexico-oraganico/modal-pago-tarjeta-mexico-oraganico.component';
import { ModalPagoWompiOrganicoComponent } from '../aula-virtual/modal-confirmacion-pago-organico/modal-pago-wompi-organico/modal-pago-wompi-organico/modal-pago-wompi-organico.component';
import { ModalPagoConektaOrganicoComponent } from '../aula-virtual/modal-confirmacion-pago-organico/modal-pago-conekta-organico/modal-pago-conekta-organico/modal-pago-conekta-organico.component';
import { ModalPagoWebpayOrganicoComponent } from '../aula-virtual/modal-confirmacion-pago-organico/modal-pago-webpay-organico/modal-pago-webpay-organico/modal-pago-webpay-organico.component';
import { ModalPagoIzipayOrganicoComponent } from '../aula-virtual/modal-confirmacion-pago-organico/modal-pago-izipay-organico/modal-pago-izipay-organico/modal-pago-izipay-organico.component';
import { ModalPagoOpenpayColombiaOrganicoComponent } from '../aula-virtual/modal-confirmacion-pago-organico/modal-pago-openpay-colombia-organico/modal-pago-openpay-colombia-organico/modal-pago-openpay-colombia-organico.component';
import { ModalPagoMercadoPagoChileOrganicoComponent } from '../aula-virtual/modal-confirmacion-pago-organico/modal-pago-mercado-pago-chile-organico/modal-pago-mercado-pago-chile-organico/modal-pago-mercado-pago-chile-organico.component';
import { ModalPagoOpenpayPeruOrganicoComponent } from '../aula-virtual/modal-confirmacion-pago-organico/modal-pago-openpay-peru-organico/modal-pago-openpay-peru-organico/modal-pago-openpay-peru-organico.component';
import { ProcesoMatriculaModalComponent } from './transparencia/proceso-matricula-modal/proceso-matricula-modal.component';


@NgModule({
  imports: [
    PublicRoutingModule,
    SharedModule,
    HttpClientModule
  ],
  declarations: [
    PublicComponent,
    HomeComponent,
    LoginComponent,
    CarrerasProfesionalesComponent,
    EducacionTecnicaComponent,
    CarreraProfesionalDetalleComponent,
    HomeProgramasComponent,
    ProgramasComponent,
    CarrerasProfesionalesComponent,
    EducationTecnicaDetalleComponent,
    ProgramasDetalleComponent,
    LibroReclamacionesComponent,
    BSCampusComponent,
    WhitepapersComponent,
    BlogComponent,
    RegistrarseComponent,
    TransparenciaComponent,
    TerminosCondicionesComponent,
    PoliticaPrivacidadComponent,
    AcercaDeComponent,
    ContactenosComponent,
    TagsComponent,
    ForgotPasswordComponent,
    VistaPreviaComponent,
    FiltroProgramasComponent,
    ProgramaPagoComponent,
    LandingPageComponent,
    LandingPageInterceptorComponent,
    PageErrorComponent,
    ChatEnLineaComponent,
    FormularioPublicidadComponent,
    FormularioPublicidadInterceptorComponent,
    NotificacionWebinarComponent,
    InformacionCertificadoComponent,
    CompraExitosaOpenPayComponent,
    LandinPageV2Component,
    LandingPageModalComponent,
    TarifaGestionComponent,
    HomePartnerComponent,
    HomeCasosExitosComponent,
    HomeLearningComponent,
    HomeCarrerasProfesionalesComponent,
    HomeEducacionTecnicaComponent,
    HomeFormacionContinuaComponent,
    ProgramaFormularioComponent,
    SorteoComponent,
    LoginFacebookComponent,
    LoginFacebookIngresarComponent,
    LoginFacebookRegistrarComponent,
    NotificacionBoliviaComponent,
    CompraExistosaOpenPayPeruComponent,
    CompraExitosaOpenPayColombiaComponent,
    ChatBotLandingPageComponent,
    CompraExistosaOpenPayPeruComponent,
    PagoOrganicoTodosComponent,
    ModalPagoVisaOrganicoComponent,
    ModalPagoTarjetaOrganicoComponent,
    ModalPagoTarjetaMexicoOraganicoComponent,
    ModalPagoWompiOrganicoComponent,
    ModalPagoConektaOrganicoComponent,
    ModalPagoWebpayOrganicoComponent,
    ModalPagoIzipayOrganicoComponent,
    ModalPagoOpenpayColombiaOrganicoComponent,
    ModalPagoMercadoPagoChileOrganicoComponent,
    ModalPagoOpenpayPeruOrganicoComponent,
    ProcesoMatriculaModalComponent
  ],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ],
})
export class PublicModule {
  constructor() {}
}
