import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TerminosCondicionesService {
  public urlBase=environment.url_api+'TerminosCondiciones';
  constructor(private http: HttpClient) { }

  public ObtenerTerminosCondiciones():Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerTerminosCondiciones');
  }
}
