import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { datosAlumnoEnvioDTO } from 'src/app/Core/Models/AlumnoDTO';
import { AsistenciaRegistrarDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  isBrowser: boolean;
  public urlBase=environment.url_api+'Asistencia';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerAsistencia(IdMatriculaCabecera:number,IdPEspecifico:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerAsistencia?IdMatriculaCabecera='+IdMatriculaCabecera+'&IdPEspecifico='+IdPEspecifico);
    } else {
      return EMPTY;
    }
  }

  public ObtenerAsistenciasAlumnoOnline(IdMatriculaCabecera:number,IdPEspecifico:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ObtenerAsistenciasAlumnoOnline?IdMatriculaCabecera='+IdMatriculaCabecera+'&IdPEspecifico='+IdPEspecifico);
    } else {
      return EMPTY;
    }
  }
  public RegistrarAsistenciaMatricula(IdMatriculaCabecera:number,IdPEspecificoSesion:number):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/RegistrarAsistenciaMatricula?IdMatriculaCabecera='+IdMatriculaCabecera+'&IdPEspecificoSesion='+IdPEspecificoSesion);
    } else {
      return EMPTY;
    }
  }
  public RegistrarAsistenciaDocenteCorreccion(json:Array<AsistenciaRegistrarDTO>,idPEspecifico:number,usuario:string):Observable<any>{
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
    return this.http.post<any>(this.urlBase+'/RegistrarAsistenciaDocenteCorreccion',formData);

  }
  public RegistrarAsistenciaSesion(json:Array<AsistenciaRegistrarDTO>,idPEspecifico:number,usuario:string):Observable<any>{
    if(this.isBrowser){
      let asistencia = [];
      for (let i = 0; i < json.length; i++) {
        asistencia.push({
          Id: json[i].Id.toString(),
          IdPEspecificoSesion: json[i].IdPEspecificoSesion.toString(),
          IdMatriculaCabecera: json[i].IdMatriculaCabecera.toString(),
          Asistio: json[i].Asistio.toString(),
          Justifico: json[i].Justifico.toString()
        });
      }
      let asistenciaString = JSON.stringify(asistencia);
        // Configuración del Content-Type
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        // Enviar el objeto como JSON
        return this.http.post<any>(this.urlBase + '/RegistrarAsistenciaSesion', { asistenciaString: asistenciaString }, { headers });
      }else{
      return EMPTY;
    }
  }


}

