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
import { ChatPruebaComponent } from './chat-prueba/chat-prueba.component';
import { FormularioPublicidadComponent } from './FormularioPublicidad/formulario-publicidad.component';
import { FormularioPublicidadInterceptorComponent } from './FormularioPublicidad/FormularioPublicidadInterceptor/formulario-publicidad-interceptor.component';
import { NotificacionWebinarComponent } from './notificacion-webinar/notificacion-webinar.component';
import { InformacionCertificadoComponent } from './informacion-certificado/informacion-certificado.component';
import { CompraExitosaOpenPayComponent } from './compra-exitosa-open-pay/compra-exitosa-open-pay.component';
import { LandinPageV2Component } from './landin-page-v2/landin-page-v2.component';
import { LandingPageModalComponent } from './landin-page-v2/landing-page-modal/landing-page-modal.component';
import { TarifaGestionComponent } from './tarifa-gestion/tarifa-gestion.component';


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
    ChatPruebaComponent,
    FormularioPublicidadComponent,
    FormularioPublicidadInterceptorComponent,
    NotificacionWebinarComponent,
    InformacionCertificadoComponent,
    CompraExitosaOpenPayComponent,
    LandinPageV2Component,
    LandingPageModalComponent,
    TarifaGestionComponent
  ],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ],
})
export class PublicModule {
  constructor() {}
}
