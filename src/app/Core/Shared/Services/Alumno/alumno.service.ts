import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}
