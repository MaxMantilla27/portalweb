import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QuejaSugerenciaDTO } from 'src/app/Core/Models/QuejaSugerenciaDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuejaSugerenciaService {

  public urlBase=environment.url_api+'QuejaSugerencia';
  constructor(private http: HttpClient) { }
  public ObtenerTipoQuejaSugerencia():Observable<any>{
    return this.http.get<any>(this.urlBase+'/ObtenerTipoQuejaSugerencia');
  }
  public RegistrarPortalQuejaSugerencia(Json:QuejaSugerenciaDTO):Observable<any>{
    return this.http.post<any>(this.urlBase+'/RegistrarPortalQuejaSugerencia',Json);
  }

}
