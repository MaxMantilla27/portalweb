
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ChatAtencionClienteContactoActualizarDTO, ChatAtencionClienteContactoDetalleRegistrarDTO, ChatAtencionClienteContactoRegistrarDTO } from 'src/app/Core/Models/ChatAtencionClienteDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatAtencionClienteService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'ChatAtencionCliente';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerCursosAlumnoMatriculado():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerCursosAlumnoMatriculado');
    }else{
      return EMPTY;
    }
  }
  public ObtenerAreasCapacitacionChatAtc():Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerAreasCapacitacionChatAtc');
    }else{
      return EMPTY;
    }
  }
  public ListaProgramasFiltroChatAtc(IdAreaCapacitacion:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ListaProgramasFiltroChatAtc?IdAreaCapacitacion='+IdAreaCapacitacion);
    }else{
      return EMPTY;
    }
  }
  public RegistrarChatAtencionClienteContacto(Json:ChatAtencionClienteContactoRegistrarDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/RegistrarChatAtencionClienteContacto',Json);
    }else{
      return EMPTY;
    }
  }
  public RegistrarChatAtencionClienteContactoDetalle(Json:ChatAtencionClienteContactoDetalleRegistrarDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/RegistrarChatAtencionClienteContactoDetalle',Json);
    }else{
      return EMPTY;
    }
  }
  public ObtenerChatAtencionClienteContactoDetalle(IdContactoPortalSegmento:string,IdAlumno:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerChatAtencionClienteContactoDetalle?IdContactoPortalSegmento='+IdContactoPortalSegmento+'&IdAlumno='+IdAlumno);
    }else{
      return EMPTY;
    }
  }
  public ActualizarChatAtencionClienteContacto(Json:ChatAtencionClienteContactoActualizarDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ActualizarChatAtencionClienteContacto',Json);
    }else{
      return EMPTY;
    }
  }
  public ActualizarEsSporteTecnicoChatAtencionClienteContacto(IdChatAtencionClienteContacto:number,EsSoporteTecnico:boolean):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/ActualizarEsSporteTecnicoChatAtencionClienteContacto?IdChatAtencionClienteContacto='+IdChatAtencionClienteContacto+'&EsSoporteTecnico='+EsSoporteTecnico,{});
    }else{
      return EMPTY;
    }
  }
  public ObtenerChatAtencionClienteContactoDetalleAcademico(IdMatriculaCabecera:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerChatAtencionClienteContactoDetalleAcademico?IdMatriculaCabecera='+IdMatriculaCabecera);
    }else{
      return EMPTY;
    }
  }
  public ObtenerAsesorChatAtc(IdPais:number,IdProgramaGeneral:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerAsesorChatAtc?IdPais='+IdPais+'&IdProgramaGeneral='+IdProgramaGeneral);
    }else{
      return EMPTY;
    }
  }
  public ObtenerDetalleChatPorIdInteraccionContactoPortalSegmento(IdContactoPortalSegmento:string,IdPGeneral:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerDetalleChatPorIdInteraccionContactoPortalSegmento?IdContactoPortalSegmento='+IdContactoPortalSegmento+'&IdPGeneral='+IdPGeneral);
    }else{
      return EMPTY;
    }
  }

}
