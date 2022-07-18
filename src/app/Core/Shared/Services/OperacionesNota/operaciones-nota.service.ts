import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotaRegistrarDTO, ParticipacionExpositorFiltroDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperacionesNotaService {
  public urlBase=environment.url_api_integra+'Operaciones/Nota';
  constructor(private http: HttpClient) { }

  public ListadoNotaProcesar(idPEspecifico:number,grupo:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListadoNotaProcesar/'+idPEspecifico+ "/" +grupo);
  }
  public Registrar(json:Array<NotaRegistrarDTO>):Observable<any>{
    console.log(JSON.stringify(json))
    const formData: FormData = new FormData();
    formData.append('notas', JSON.stringify(json));
    console.log(formData)
    return this.http.post<any>(this.urlBase+'/Registrar',json);
  }
}
