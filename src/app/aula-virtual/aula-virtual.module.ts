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
})
export class AulaVirtualModule { }
