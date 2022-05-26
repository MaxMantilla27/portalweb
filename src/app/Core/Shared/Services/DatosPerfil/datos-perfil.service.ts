import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DatosPerfilService {
  public urlBase=environment.url_api+'DatosPerfil';
  constructor(private http: HttpClient,private _SessionStorageService:SessionStorageService) { }

  public DatosPerfil():Observable<any>{
    return this.http.get<any>(this.urlBase+'/DatosPerfil');
  }
  public RegistroProgramaMatriculado():Observable<any>{
    return this.http.get<any>(this.urlBase+'/RegistroProgramaMatriculado');
  }
  public RegistroProgramaMatriculadoPorIdMatricula(IdMatriculaCabecera:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/RegistroProgramaMatriculadoPorIdMatricula?IdMatriculaCabecera='+IdMatriculaCabecera);
  }
}
