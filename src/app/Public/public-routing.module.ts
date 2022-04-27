import {NgModule} from '@angular/core'
import {RouterModule,Routes} from '@angular/router';
import { PublicGuard } from './Guard/public.guard';
import { HomeComponent } from './Home/home.component';
import { LoginComponent } from './login/login.component';
import { ProgramasComponent } from './programas/programas.component';
import { PublicComponent } from './public.component';
import { CarrerasProfesionalesComponent } from './carreras-profesionales/carreras-profesionales.component'

const routes:Routes=[
    {path:'',component:PublicComponent,children:
        [
            {path:'',component:HomeComponent},
            {path:'programas-certificaciones-cursos',component:ProgramasComponent},
            {path:'programas-certificaciones-cursos/:IdArea',component:ProgramasComponent},
            {path:'login',component:LoginComponent,canActivate:[PublicGuard]},
            {path:'carreras-profesionales',component:CarrerasProfesionalesComponent},


            {path:':AreaCapacitacion/:ProgramaNombre',component:LoginComponent,canActivate:[PublicGuard]}
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
