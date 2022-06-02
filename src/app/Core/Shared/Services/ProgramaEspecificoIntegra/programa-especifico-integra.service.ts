import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProgramaEspecificoIntegraService {
  public urlBase=environment.url_api_integra+'ProgramaEspecifico';
  constructor(private http: HttpClient,private _SessionStorageService:SessionStorageService) { }

  public ObtenerSesionesOnlineWebinarPorProveedor(IdProveedor:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerSesionesOnlineWebinarPorProveedor/'+IdProveedor);
  }
}
