import {NgModule} from '@angular/core'
import {RouterModule,Routes} from '@angular/router';
import { PublicGuard } from './Guard/public.guard';
import { HomeComponent } from './Home/home.component';
import { LoginComponent } from './login/login.component';
import { PublicComponent } from './public.component';
import { CarrerasProfesionalesComponent } from './carreras-profesionales/carreras-profesionales.component'
import { EducacionTecnicaComponent } from './educacion-tecnica/educacion-tecnica.component';
import { CarreraProfesionalDetalleComponent } from './carreras-profesionales/carrera-profesional-detalle/carrera-profesional-detalle.component';

const routes:Routes=[
    {path:'',component:PublicComponent,children:
        [
            {path:'',component:HomeComponent},
            {path:'login',component:LoginComponent,canActivate:[PublicGuard]},
            {path:'carreras-profesionales',component:CarrerasProfesionalesComponent},
            {path: 'carreras-profesionales/:urlWeb',component:CarreraProfesionalDetalleComponent},
            {path:'tecnicos-productivos', component:EducacionTecnicaComponent}
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
