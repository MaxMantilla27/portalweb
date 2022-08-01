import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { datosAlumnoEnvioDTO } from 'src/app/Core/Models/AlumnoDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Alumno';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerCombosPerfil():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerCombosPerfil');
    }else{
      return EMPTY;
    }
  }

  public ActualizarPerfilAlumno(Json:datosAlumnoEnvioDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ActualizarPerfilAlumno',Json);
  }
}
