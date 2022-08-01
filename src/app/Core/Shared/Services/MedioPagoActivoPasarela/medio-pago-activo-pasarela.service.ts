import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedioPagoActivoPasarelaService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'MedioPagoActivoPasarela';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public MedioPagoPasarelaPortalCronograma(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/MedioPagoPasarelaPortalCronograma?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public MedioPagoActivoPasarelaPortal(IdPais:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/MedioPagoActivoPasarelaPortal?IdPais='+IdPais);
    }else{
      return EMPTY;
    }
  }

}
