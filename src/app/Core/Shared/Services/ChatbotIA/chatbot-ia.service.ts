import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ChatAtencionClienteContactoActualizarDTO, ChatAtencionClienteContactoDetalleRegistrarDTO, ChatAtencionClienteContactoRegistrarDTO } from 'src/app/Core/Models/ChatAtencionClienteDTO';
import { environment } from 'src/environments/environment';
import { RegistroChatbotIADTO } from 'src/app/Core/Models/ChatbotIADTO';
@Injectable({
  providedIn: 'root'
})
export class ChatbotIAService {

  isBrowser: boolean;
  public urlBase=environment.url_api+'ChatbotIAPortal';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public EnviarMensajeBot(registroChar: RegistroChatbotIADTO):Observable<any>{
    if(this.isBrowser){
      return this.http.post<string>(this.urlBase+'/InteractuarHiloChat', {
        'IdChatbotIAPortalHiloChat': registroChar.IdChatbotIAPortalHiloChat,
        'Mensaje' : registroChar.Mensaje,
        'Cerrado' : registroChar.Cerrado,
        'Derivado' : registroChar.Derivado,
        'TiempoActual': this.formatearFecha(registroChar.TiempoActual!)
      });
    }else{
      return EMPTY;
    }
  }

  public ObtenerInteraccionesChat():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerCursosAlumnoMatriculado');
    }else{
      return EMPTY;
    }
  }

  private formatearFecha(fecha: Date): string {
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
  
    return `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
  }
  



}
