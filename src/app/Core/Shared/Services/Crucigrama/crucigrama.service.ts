import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EvaluacionPromedioCrucigramaDTO, ParametrosCrucigramaVideoSesionDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrucigramaService {
  public urlBase=environment.url_api+'Crucigrama';
  constructor(private http: HttpClient) { }

  public ObtenerCrucigramaProgramaCapacitacionSesion(Json:ParametrosCrucigramaVideoSesionDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ObtenerCrucigramaProgramaCapacitacionSesion',Json);
  }
  public EnviarFormularioCrucigrama(Json:EvaluacionPromedioCrucigramaDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/EnviarFormularioCrucigrama',Json);
  }
}
