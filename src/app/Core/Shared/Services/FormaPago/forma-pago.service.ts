import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { PagoOrganicoAlumnoDTO, RegistroPreProcesoPagoDTO, RegistroProcesoPagoAlumnoDTO, RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {
  private signal$ = new Subject();
  public urlBase=environment.url_api+'FormaPago';
  constructor(
    private http: HttpClient,
    private _SessionStorageService:SessionStorageService,
    private _router:Router
  ) { }
  public PreProcesoPagoCuotaAlumno(Json:RegistroPreProcesoPagoDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/PreProcesoPagoCuotaAlumno',Json);
  }
  public ObtenerPreProcesoPagoCuotaAlumno(Json:RegistroRespuestaPreProcesoPagoDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ObtenerPreProcesoPagoCuotaAlumno',Json);
  }
  public ObtenerPreProcesoPagoOrganicoAlumno(Json:RegistroRespuestaPreProcesoPagoDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ObtenerPreProcesoPagoOrganicoAlumno',Json);
  }
  public ProcesarPagoCuotaAlumno(Json:RegistroProcesoPagoAlumnoDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ProcesarPagoCuotaAlumno',Json);
  }
  public ProcesarPagoAlumnoOrganico(Json:RegistroProcesoPagoAlumnoDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ProcesarPagoAlumnoOrganico',Json);
  }
  public PreProcesoPagoOrganicoAlumno(Json:PagoOrganicoAlumnoDTO,dialogRef:any):void{
    console.log(Json)
    this.http.post<any>(this.urlBase+'/PreProcesoPagoOrganicoAlumno',Json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(dialogRef!=null){
          dialogRef.close();
        }
        var sesion=x._Repuesta.identificadorTransaccion;
        this._SessionStorageService.SessionSetValue(sesion,x._Repuesta.requiereDatosTarjeta);
        console.log(Json.IdFormaPago)
        this._SessionStorageService.SessionDeleteValue('redirect');
        if(parseInt(Json.IdPasarelaPago)==7){
          if(Json.IdFormaPago==52){
            this._router.navigate(['/AulaVirtual/MisPagos/visa/'+sesion]);
          }
          if(Json.IdFormaPago==48){
            this._router.navigate(['/AulaVirtual/MisPagos/tarjeta/'+sesion]);
          }
        }
        if(parseInt(Json.IdPasarelaPago)==1 || parseInt(Json.IdPasarelaPago)==5){
          this._router.navigate(['/AulaVirtual/MisPagos/tarjeta/'+sesion]);
        }else{
          if(parseInt(Json.IdPasarelaPago)==2){
            this._router.navigate(['/AulaVirtual/MisPagos/wompi/'+sesion]);
          }
          if(parseInt(Json.IdPasarelaPago)==6){
            this._router.navigate(['/AulaVirtual/MisPagos/conekta/'+sesion]);
          }
          if(parseInt(Json.IdPasarelaPago)==3){}
          if(parseInt(Json.IdPasarelaPago)==4){
            this._router.navigate(['/AulaVirtual/MisPagos/multipago/'+sesion]);
          }
        }
      }
    });
  }
  public ChangeToPending(Json:any):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ChangeToPending',Json);
  }

  public PreProcesoPagoTramiteAlumno(Json:RegistroPreProcesoPagoDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/PreProcesoPagoTramiteAlumno',Json);
  }
  public ValidarProcesoPagoCuotaAlumnoOpenPAy(Json:RegistroRespuestaPreProcesoPagoDTO):Observable<any>{
    console.log(Json)
    return this.http.post<any>(this.urlBase+'/ValidarProcesoPagoCuotaAlumnoOpenPAy',Json);
  }
}
