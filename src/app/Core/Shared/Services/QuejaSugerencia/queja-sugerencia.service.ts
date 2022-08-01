import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { QuejaSugerenciaDTO } from 'src/app/Core/Models/QuejaSugerenciaDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuejaSugerenciaService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'QuejaSugerencia';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerTipoQuejaSugerencia():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerTipoQuejaSugerencia');
    }else{
      return EMPTY;
    }
  }
  public RegistrarPortalQuejaSugerencia(Json:QuejaSugerenciaDTO):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/RegistrarPortalQuejaSugerencia',Json);
    }else{
      return EMPTY;
    }
  }

}
