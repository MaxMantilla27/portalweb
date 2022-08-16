import {NgModule} from '@angular/core'
import {RouterModule,Routes} from '@angular/router';
import { PublicGuard } from './Guard/public.guard';
import { HomeComponent } from './Home/home.component';
import { LoginComponent } from './login/login.component';
import { ProgramasComponent } from './programas/programas.component';
import { PublicComponent } from './public.component';
import { CarrerasProfesionalesComponent } from './carreras-profesionales/carreras-profesionales.component'
import { EducacionTecnicaComponent } from './educacion-tecnica/educacion-tecnica.component';
import { CarreraProfesionalDetalleComponent } from './carreras-profesionales/carrera-profesional-detalle/carrera-profesional-detalle.component';
import {
  EducationTecnicaDetalleComponent
} from "./educacion-tecnica/education-tecnica-detalle/education-tecnica-detalle.component";
import {ProgramasDetalleComponent} from "./programas-detalle/programas-detalle.component";
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
import { AvatarComponent } from '../aula-virtual/avatar/avatar.component';
import { LandingPageInterceptorComponent } from './landing-page/landing-page/landing-page-interceptor/landing-page-interceptor/landing-page-interceptor.component';
import { PageErrorComponent } from './page-error/page-error/page-error.component';
import { ChatPruebaComponent } from './chat-prueba/chat-prueba.component';
import { FormularioPublicidadInterceptorComponent } from './FormularioPublicidad/FormularioPublicidadInterceptor/formulario-publicidad-interceptor.component';
import { NotificacionWebinarComponent } from './notificacion-webinar/notificacion-webinar.component';

const routes:Routes=[
    {path:'',component:PublicComponent,children:
        [
            {path:'',component:HomeComponent},
            {path:'programas-certificaciones-cursos',component:ProgramasComponent},
            {path:'login',component:LoginComponent,canActivate:[PublicGuard]},
            {path:'Registrarse', component:RegistrarseComponent ,canActivate:[PublicGuard]},
            {path:'carreras-profesionales',component:CarrerasProfesionalesComponent},
            {path:'tecnicos-productivos', component:EducacionTecnicaComponent},
            {path:'LibroReclamacion', component:LibroReclamacionesComponent},
            {path:'bs-campus', component:BSCampusComponent},
            {path:'Transparencia', component:TransparenciaComponent},
            {path:'termino-uso-web', component:TerminosCondicionesComponent},
            {path:'politica-privacidad', component:PoliticaPrivacidadComponent},
            {path:'AcercaBsGrupo', component:AcercaDeComponent},
            {path:'contactenos', component:ContactenosComponent},
            {path:'Account/ForgotPassword', component:ForgotPasswordComponent},
            {path:'Avatar', component: AvatarComponent},
            {path:'ChatEnlinea', component: ChatPruebaComponent},

            {path:'NotificacionAlumno/Webinar/:datos', component:NotificacionWebinarComponent},
            {path:'bs-campus/white-paper/:whitepaper', component:WhitepapersComponent},
            {path:'bs-campus/blog/:blog', component:BlogComponent},

            {path:'SubArea/:nombre', component:TagsComponent},
            {path:'Area/:nombre', component:TagsComponent},
            {path:'tag/:nombre', component:TagsComponent},
            {path:'tecnico-productivo/:urlWeb', component:EducationTecnicaDetalleComponent},
            {path:'carrera/:urlWeb',component:CarreraProfesionalDetalleComponent},
            {path:'programas-certificaciones-cursos/:IdArea',component:ProgramasComponent},
            {path:'error404',component:PageErrorComponent},
            {path:'publicidad/:formulario',component:FormularioPublicidadInterceptorComponent},

            {path:':IdFormulario', component:LandingPageInterceptorComponent},
            {path:':AreaCapacitacion/:ProgramaNombre',component:ProgramasDetalleComponent},
            {path:'**',component:PageErrorComponent},

        ]
    }
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class PublicRoutingModule
{

}
