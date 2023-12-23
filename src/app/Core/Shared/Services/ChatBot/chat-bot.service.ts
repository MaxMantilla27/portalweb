import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ActualizarAlumnoChatBotDTO, FlujoChatEntradalDTO, InicioEntradaChatbotDTO, PerfilProfesionalDTO, ValidacionChatBotEnvioDTO } from 'src/app/Core/Models/ChatBotDTO';
import { ValidacionChatEnvioDTO } from 'src/app/Core/Models/ChatEnLineaDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
  isBrowser: boolean;

  public urlBase=environment.url_api+'ChatBot';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ValidacionAlumnoCorreoChatBot(Correo:string):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ValidacionAlumnoCorreoChatBot?Correo='+Correo);
    }else{
      return EMPTY;
    }
  }

  public ObtenerLongitudTipoDocumento(IdPais:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ValidacionAlumnoCorreoChatBot?IdPais='+IdPais);
    }else{
      return EMPTY;
    }
  }

  public InicializarChatbot(Json:InicioEntradaChatbotDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/InicializarChatbot',Json);
    }else{
      return EMPTY;
    }
  }
  public FlujoConversacionPrincipal(Json:FlujoChatEntradalDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/FlujoConversacionPrincipal',Json);
    }else{
      return EMPTY;
    }
  }

  public ObtenerProbabilidadTodosProgramas(IdAlumno:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerProbabilidadTodosProgramas?IdAlumno='+IdAlumno);
    }else{
      return EMPTY;
    }
  }
  public ObtenerProbabilidadOportunidad(IdOportunidad:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerProbabilidadOportunidad?IdOportunidad='+IdOportunidad);
    }else{
      return EMPTY;
    }
  }
  public ObtenerSegundaOpcionLlamada():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerSegundaOpcionLlamada');
    }else{
      return EMPTY;
    }
  }
  public ActualizarAlumnoChatBot(Json:ActualizarAlumnoChatBotDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ActualizarAlumnoChatBot',Json);
    }else{
      return EMPTY;
    }
  }
  public ProcesarAsignacionAutomaticaChatbot(Json:ValidacionChatBotEnvioDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ProcesarAsignacionAutomaticaChatbot',Json);
    }else{
      return EMPTY;
    }
  }
  public ActualizarIdOportunidadChatbotUsuarioContacto(IdChatbotUsuarioContacto:number,IdOportunidad:number,IdAlumno:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ActualizarIdOportunidadChatbotUsuarioContacto?IdChatbotUsuarioContacto='+IdChatbotUsuarioContacto+'&IdOportunidad='+IdOportunidad+'&IdAlumno='+IdAlumno);
    }else{
      return EMPTY;
    }
  }

  public ObtenerCincoOpcionesPerfilProfesionalChatbot(Json:PerfilProfesionalDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ObtenerCincoOpcionesPerfilProfesionalChatbot',Json);
    }else{
      return EMPTY;
    }
  }
}
