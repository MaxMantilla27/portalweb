import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForoCursoService {
  public urlBase=environment.url_api+'ForoCurso';
  constructor(private http: HttpClient) { }
  public ObtenerForoCurso(IdPGeneral:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerForoCurso?IdPGeneral='+IdPGeneral);
  }
}
