import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParametrosVideoSesionDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoSesionService {
  public urlBase=environment.url_api+'VideoSesion';
  constructor(private http: HttpClient) { }

  public ObtenerVideoProgramaCapacitacionSesion(Json:ParametrosVideoSesionDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ObtenerVideoProgramaCapacitacionSesion',Json);
  }

}
