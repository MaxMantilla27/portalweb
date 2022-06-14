import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistroPreProcesoPagoDTO, RegistroProcesoPagoAlumnoDTO, RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {
  public urlBase=environment.url_api+'FormaPago';
  constructor(private http: HttpClient) { }
  public PreProcesoPagoCuotaAlumno(Json:RegistroPreProcesoPagoDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/PreProcesoPagoCuotaAlumno',Json);
  }
  public ObtenerPreProcesoPagoCuotaAlumno(Json:RegistroRespuestaPreProcesoPagoDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ObtenerPreProcesoPagoCuotaAlumno',Json);
  }
  public ProcesarPagoCuotaAlumno(Json:RegistroProcesoPagoAlumnoDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ProcesarPagoCuotaAlumno',Json);
  }

}
