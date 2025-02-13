import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatDetalleIntegraService {
  isBrowser: boolean;
  public urlBase=environment.url_api_integra+'ChatDetalleIntegra';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }


  public ObtenerDetalleChatPorIdInteraccionControlMensajeSoporte(IdAlumno:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerDetalleChatPorIdInteraccionControlMensajeSoporte/'+IdAlumno+'/0');
    }else{
      return EMPTY;
    }
  }
  public AdjuntarArchivoChatSoporte(file:File):Observable<any>{
    if(this.isBrowser){
      console.log(file)
      const formData: FormData = new FormData();
      formData.append('File', file);
      formData.append('Usuario', 'Visitante');
      console.log(formData)
      return this.http.post<any>(this.urlBase+'/AdjuntarArchivoChatSoporte',formData);
      // const req= new HttpRequest('POST', `${this.urlBase}/AdjuntarArchivoChatSoporte`,formData, {
      //   reportProgress: true,
      //   responseType: 'json'
      // });
      // return this.http.request(req)
    }else{
      return EMPTY;
    }
  }
  public ObtenerDetalleChatPorIdInteraccionMatricula(IdMatriculaCabecera:number,EsSoporteTecnico:boolean):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerDetalleChatPorIdInteraccionMatricula/'+IdMatriculaCabecera+'/'+EsSoporteTecnico);
    }else{
      return EMPTY;
    }
  }
}
