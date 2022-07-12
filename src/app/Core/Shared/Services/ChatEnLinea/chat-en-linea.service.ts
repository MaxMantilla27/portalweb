import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ValidacionChatEnvioDTO } from 'src/app/Core/Models/ChatEnLineaDTO';
@Injectable({
  providedIn: 'root'
})
export class ChatEnLineaService {

  public urlBase=environment.url_api+'ChatEnLinea';
  constructor(private http: HttpClient) { }

  public ObtenerConfiguracionChat():Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerConfiguracionChat');
  }
  public ObtenerAsesorChat(IdPGeneral:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerAsesorChat?IdPGeneral='+IdPGeneral);
  }
  public ValidarCrearOportunidadChat(Json:ValidacionChatEnvioDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ValidarCrearOportunidadChat',Json);
  }
}
