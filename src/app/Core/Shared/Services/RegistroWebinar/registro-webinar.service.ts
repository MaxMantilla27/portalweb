import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistroWebinarService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'RegistroWebinar';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ConfirmarAsistencia(IdPEspecificoSesion:number,IdMatriculaCabecera:number,EstadoConfirmacion:boolean):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/ConfirmarAsistencia/'+IdPEspecificoSesion+'/'+IdMatriculaCabecera+'/'+EstadoConfirmacion,{});
    }else{
      return EMPTY;
    }
  }
}
