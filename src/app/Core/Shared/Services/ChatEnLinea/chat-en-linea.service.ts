import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ValidacionChatEnvioDTO } from 'src/app/Core/Models/ChatEnLineaDTO';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class ChatEnLineaService {
  isBrowser: boolean;

  public urlBase=environment.url_api+'ChatEnLinea';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerConfiguracionChat():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerConfiguracionChat');
    }else{
      return EMPTY;
    }
  }
  public ObtenerAsesorChat(IdPGeneral:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerAsesorChat?IdPGeneral='+IdPGeneral);
    }else{
      return EMPTY;
    }
  }
  public ValidarCrearOportunidadChat(Json:ValidacionChatEnvioDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ValidarCrearOportunidadChat',Json);
    }else{
      return EMPTY;
    }
  }
}
