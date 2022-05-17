import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { datosAlumnoEnvioDTO } from 'src/app/Core/Models/AlumnoDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  public urlBase=environment.url_api+'Alumno';
  constructor(private http: HttpClient) { }

  public ObtenerCombosPerfil():Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerCombosPerfil');
  }
  
  public ActualizarPerfilAlumno(Json:datosAlumnoEnvioDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ActualizarPerfilAlumno',Json);
  }
}
