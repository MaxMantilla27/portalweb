import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatDetalleIntegraService {
  public urlBase=environment.url_api_integra+'ChatDetalleIntegra';
  constructor(private http: HttpClient) { }
  public ObtenerDetalleChatPorIdInteraccionControlMensajeSoporte(IdAlumno:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerDetalleChatPorIdInteraccionControlMensajeSoporte/'+IdAlumno+'/0');
  }
  public AdjuntarArchivoChatSoporte(file:File):Observable<any>{
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
  }
}
