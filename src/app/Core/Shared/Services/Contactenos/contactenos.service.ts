import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ContactenosDTO } from 'src/app/Core/Models/ContactenosDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactenosService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Contactenos';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public EnviarFormulario(Json:ContactenosDTO):Observable<any>{

    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/EnviarFormulario',Json);
    }else{
      return EMPTY;
    }
  }
}
