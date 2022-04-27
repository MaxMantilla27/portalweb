import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SilaboService {
  public urlBase=environment.url_api+'Silabo';
  constructor(private http: HttpClient) { }
  public ObtenerSilaboCurso(IdPGeneral:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerSilaboCurso?IdPGeneral='+IdPGeneral);
  }
}
