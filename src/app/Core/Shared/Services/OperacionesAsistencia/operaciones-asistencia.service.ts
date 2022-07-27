import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AsistenciaRegistrarDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperacionesAsistenciaService {
  public urlBase=environment.url_api_integra+'Operaciones/Asistencia';
  constructor(private http: HttpClient) { }

  public Registrar(json:Array<AsistenciaRegistrarDTO>,idPEspecifico:number,usuario:string):Observable<any>{
    console.log(json)
    const formData: FormData = new FormData();
    formData.append("idPEspecifico", idPEspecifico.toString() );
    formData.append("usuario", usuario );
    for (let i = 0; i < json.length; i++) {
      formData.append('notas[' + i + '][Id]', json[i].Id.toString());
      formData.append('notas[' + i + '][IdPEspecificoSesion]', json[i].IdPEspecificoSesion.toString());
      formData.append('notas[' + i + '][IdMatriculaCabecera]', json[i].IdMatriculaCabecera.toString());
      formData.append('notas[' + i + '][Justifico]', json[i].Justifico.toString());
      formData.append('notas[' + i + '][Asistio]', json[i].Asistio.toString());
    }
    console.log(formData.get('notas[]'))
    return this.http.post<any>(this.urlBase+'/Registrar',formData);
  }

  public Aprobar(json:Array<AsistenciaRegistrarDTO>,idPEspecifico:number,usuario:string,grupo:number):Observable<any>{
    console.log(json)
    const formData: FormData = new FormData();
    formData.append("idPEspecifico", idPEspecifico.toString() );
    formData.append("grupo", grupo.toString() );
    formData.append("usuario", usuario );
    for (let i = 0; i < json.length; i++) {
      formData.append('notas[' + i + '][Id]', json[i].Id.toString());
      formData.append('notas[' + i + '][IdPEspecificoSesion]', json[i].IdPEspecificoSesion.toString());
      formData.append('notas[' + i + '][IdMatriculaCabecera]', json[i].IdMatriculaCabecera.toString());
      formData.append('notas[' + i + '][Justifico]', json[i].Justifico.toString());
      formData.append('notas[' + i + '][Asistio]', json[i].Asistio.toString());
    }
    console.log(formData.get('notas[]'))
    return this.http.post<any>(this.urlBase+'/Aprobar',formData);
  }
}
