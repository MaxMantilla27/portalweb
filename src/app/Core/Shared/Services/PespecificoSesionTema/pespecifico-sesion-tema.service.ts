import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { PespecificoSesionTemaUpdateDTO, PespecificoSesionTemaSaveDTO, PespecificoSesionTemaUpdateOrdenDTO, PespecificoSesionTemaDeleteDTO } from 'src/app/Core/Models/PespecificoSesionTemaDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PespecificoSesionTemaService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'PespecificoSesionTema';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerPespecificoSesionTemaPorSesion(IdPEspecificoSesion:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerPespecificoSesionTemaPorSesion?IdPEspecificoSesion='+IdPEspecificoSesion);
    } else {
      return EMPTY;
    }
  }
  public ActualizarTemaSesion(Json:PespecificoSesionTemaUpdateDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ActualizarTemaSesion',Json);
    }else{
      return EMPTY;
    }
  }
  public InsertarTemaSesion(Json:PespecificoSesionTemaSaveDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/InsertarTemaSesion',Json);
    }else{
      return EMPTY;
    }
  }
  public OrdenarTemaSesion(Json:PespecificoSesionTemaUpdateOrdenDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/OrdenarTemaSesion',Json);
    }else{
      return EMPTY;
    }
  }
  public EliminarTemaSesion(Json:PespecificoSesionTemaDeleteDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/EliminarTemaSesion',Json);
    }else{
      return EMPTY;
    }
  }


}
