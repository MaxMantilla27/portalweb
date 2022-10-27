import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TarifaGestionService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'TarifaGestion';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerTarifas():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/TipoCambioTarifas');
    }else{ 
      return EMPTY;
    }
  }



}
