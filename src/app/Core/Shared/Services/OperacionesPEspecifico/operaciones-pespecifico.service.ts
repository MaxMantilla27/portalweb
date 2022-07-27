import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PEspecificoSilaboRegistrarDTO } from 'src/app/Core/Models/EvaluacionRegistrarDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperacionesPEspecificoService {
  public urlBase=environment.url_api_integra+'Operaciones/PEspecificoSilabo';
  constructor(private http: HttpClient) { }

  public PorPrograma(idPEspecifico:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/PorPrograma/'+idPEspecifico);
  }
  public Aprobar(Json:PEspecificoSilaboRegistrarDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/Aprobar',Json);
  }
}
