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
  public Registrar(json:Array<NotaRegistrarDTO>,idPEspecifico:number,usuario:string):Observable<any>{
    console.log(json)
    const formData: FormData = new FormData();
    formData.append("idPEspecifico", idPEspecifico.toString() );
    formData.append("usuario", usuario );
    for (let i = 0; i < json.length; i++) {
      formData.append('notas[' + i + '][Id]', json[i].Id.toString());
      formData.append('notas[' + i + '][IdEvaluacion]', json[i].IdEvaluacion.toString());
      formData.append('notas[' + i + '][IdMatriculaCabecera]', json[i].IdMatriculaCabecera.toString());
      formData.append('notas[' + i + '][Nota]', json[i].Nota.toString());
    }
    console.log(formData.get('notas[]'))
    return this.http.post<any>(this.urlBase+'/Registrar',formData);
  }
  public Aprobar(json:Array<NotaRegistrarDTO>,idPEspecifico:number,usuario:string,grupo:number):Observable<any>{
    console.log(json)
    const formData: FormData = new FormData();
    formData.append("idPEspecifico", idPEspecifico.toString() );
    formData.append("grupo", grupo.toString() );
    formData.append("usuario", usuario );
    for (let i = 0; i < json.length; i++) {
      formData.append('notas[' + i + '][Id]', json[i].Id.toString());
      formData.append('notas[' + i + '][IdEvaluacion]', json[i].IdEvaluacion.toString());
      formData.append('notas[' + i + '][IdMatriculaCabecera]', json[i].IdMatriculaCabecera.toString());
      formData.append('notas[' + i + '][Nota]', json[i].Nota.toString());
    }
    console.log(formData.get('notas[]'))
    return this.http.post<any>(this.urlBase+'/Aprobar',formData);
  }


  public ListadoAsistenciaProcesar(idPEspecifico:number,grupo:number):Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListadoAsistenciaProcesar/'+idPEspecifico+ "/" +grupo);
  }
}
