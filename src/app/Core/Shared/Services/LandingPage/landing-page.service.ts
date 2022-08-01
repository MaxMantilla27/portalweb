import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ContactenosDTO } from 'src/app/Core/Models/ContactenosDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'LandingPageFormulario';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  public ObtenerFormularioLandingPage(IdFormulario:number):Observable<any>{

    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerFormularioLandingPage?IdFormulario='+IdFormulario);
    }else{
      return EMPTY;
    }
  }
  public EnviarFormularioLandingPage(Json:ContactenosDTO):Observable<any>{

    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/EnviarFormularioLandingPage',Json);
    }else{
      return EMPTY;
    }
  }
}
