import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { CambioPasswordDTO } from 'src/app/Core/Models/AccountDTO';
import { RegisterDTO } from 'src/app/Core/Models/AlumnoDTO';
import { FiltroProgramasEnvioDTO } from 'src/app/Core/Models/FiltrosProgramasDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Account';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public RegistrarseAlumno(Json:RegisterDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/RegistrarseAlumno',Json);
    }else{
      return EMPTY;
    }
  }
  public ActualizarPasswordCuenta(Json:CambioPasswordDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ActualizarPasswordCuenta',Json);
    }else{
      return EMPTY;
    }
  }
  public RegistroCursoAulaVirtualNueva(IdBusqueda:number):Observable<any>{
    if(this.isBrowser){
      console.log(IdBusqueda)
      return this.http.post<any>(this.urlBase+'/RegistroCursoAulaVirtualNueva?IdBusqueda='+IdBusqueda,{headers:new HttpHeaders});
    }else{
      return EMPTY;
    }
  }
  public RecuperarPasswordCuenta(correo:string):Observable<any>{
    if(this.isBrowser){
      console.log(correo)
      return this.http.post<any>(this.urlBase+'/RecuperarPasswordCuenta?correo='+correo,{});
    }else{
      return EMPTY;
    }
  }

}
