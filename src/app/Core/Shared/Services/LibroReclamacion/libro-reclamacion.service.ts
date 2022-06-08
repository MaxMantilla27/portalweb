import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LibroReclamacionesDTO, MensajeCorreoDTO } from 'src/app/Core/Models/LibroReclamacionesDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibroReclamacionService {
  public urlBase=environment.url_api+'LibroReclamacion';
  constructor(private http: HttpClient) { }

  public RegistrarLibroReclamacion(Json:LibroReclamacionesDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/RegistrarLibroReclamacion',Json);
  }
  public EnvioCorreo(Json:MensajeCorreoDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/EnvioCorreo',Json);
  }
}
