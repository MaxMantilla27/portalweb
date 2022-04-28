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

const routes:Routes=[
    {path:'',component:PublicComponent,children:
        [
            {path:'',component:HomeComponent},
            {path:'programas-certificaciones-cursos',component:ProgramasComponent},
            {path:'programas-certificaciones-cursos/:IdArea',component:ProgramasComponent},
            {path:'login',component:LoginComponent,canActivate:[PublicGuard]},
            {path:'carreras-profesionales',component:CarrerasProfesionalesComponent},
            {path: 'carrera/:urlWeb',component:CarreraProfesionalDetalleComponent},
            {path:'tecnicos-productivos', component:EducacionTecnicaComponent},
            {path:'tecnico-productivo/:urlWeb', component:EducationTecnicaDetalleComponent},

            {path:':AreaCapacitacion/:ProgramaNombre',component:ProgramasDetalleComponent,canActivate:[PublicGuard]}

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
