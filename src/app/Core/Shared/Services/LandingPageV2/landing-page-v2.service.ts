import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LandingPageV2Service {
  isBrowser: boolean;
  public urlBase=environment.url_api+'LandingPageV2';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  public ObtenerLandingPagePortal(IdFormulario:number):Observable<any>{

    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerLandingPagePortal?IdFormulario='+IdFormulario);
    }else{
      return EMPTY;
    }
  }
}
