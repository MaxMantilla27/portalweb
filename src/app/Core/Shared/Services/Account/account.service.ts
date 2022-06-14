import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CambioPasswordDTO } from 'src/app/Core/Models/AccountDTO';
import { RegisterDTO } from 'src/app/Core/Models/AlumnoDTO';
import { FiltroProgramasEnvioDTO } from 'src/app/Core/Models/FiltrosProgramasDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public urlBase=environment.url_api+'Account';
  constructor(private http: HttpClient) { }

  public RegistrarseAlumno(Json:RegisterDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/RegistrarseAlumno',Json);
  }
  public ActualizarPasswordCuenta(Json:CambioPasswordDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ActualizarPasswordCuenta',Json);
  }
  public RegistroCursoAulaVirtualNueva(IdBusqueda:number):Observable<any>{
    console.log(IdBusqueda)
    return this.http.post<any>(this.urlBase+'/RegistroCursoAulaVirtualNueva?IdBusqueda='+IdBusqueda,{headers:new HttpHeaders});
  }
}
