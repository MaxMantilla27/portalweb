import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { LibroReclamacionesDTO, MensajeCorreoDTO } from 'src/app/Core/Models/LibroReclamacionesDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasarelaPagoCorreoService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'PasarelaPagoCorreo';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  public EnvioCorreo(Json:MensajeCorreoDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/EnvioCorreo',Json);
    }else{
      return EMPTY;
    }
  }
}

