import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Route, Router } from '@angular/router';
import { EMPTY, Observable, Subject, takeUntil } from 'rxjs';
import { PagoOrganicoAlumnoDTO, RegistroPreProcesoPagoDTO, RegistroProcesoPagoAlumnoDTO, RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {
  isBrowser: boolean;
  private signal$ = new Subject();
  public urlBase=environment.url_api+'FormaPago';
  constructor(
    private http: HttpClient,
    private _SessionStorageService:SessionStorageService,
    private _router:Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public PreProcesoPagoCuotaAlumno(Json:RegistroPreProcesoPagoDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/PreProcesoPagoCuotaAlumno',Json);
    }else{
      return EMPTY;
    }
  }

  public PreProcesoAfiliacionAlumno(Json:RegistroPreProcesoPagoDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/PreProcesoAfiliacionPagoRecurrenteAlunmo',Json);
    }else{
      return EMPTY;
    }
  }

  public ObtenerPreProcesoPagoCuotaAlumno(Json:RegistroRespuestaPreProcesoPagoDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ObtenerPreProcesoPagoCuotaAlumno',Json);
    }else{
      return EMPTY;
    }
  }
  public ObtenerPreProcesoPagoOrganicoAlumno(Json:RegistroRespuestaPreProcesoPagoDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ObtenerPreProcesoPagoOrganicoAlumno',Json);
    }else{
      return EMPTY;
    }
  }



  public ObtenerPreProcesoPagoAlumnoWebPay(Json:any):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ObtenerProcesoOrganicoPreValidacionWebPay',Json);
    }else{
      return EMPTY;
    }
  }

  public ProcesarPagoCuotaAlumno(Json:RegistroProcesoPagoAlumnoDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      Json.TarjetaHabiente.NumeroDocumento=Json.TarjetaHabiente.NumeroDocumento.toString();
      if(Json.RegistroProcesoPagoPse!=undefined){
        Json.RegistroProcesoPagoPse.NumeroDocumentoPSE=Json.RegistroProcesoPagoPse.NumeroDocumentoPSE.toString();
      }
      return this.http.post<any>(this.urlBase+'/ProcesarPagoCuotaAlumno',Json);
    }else{
      return EMPTY;
    }
  }
  public ProcesarPagoAlumnoOrganico(Json:RegistroProcesoPagoAlumnoDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      Json.TarjetaHabiente.NumeroDocumento=Json.TarjetaHabiente.NumeroDocumento.toString()
      if(Json.RegistroProcesoPagoPse!=undefined){
        Json.RegistroProcesoPagoPse.NumeroDocumentoPSE=Json.RegistroProcesoPagoPse.NumeroDocumentoPSE.toString();
      }
      return this.http.post<any>(this.urlBase+'/ProcesarPagoAlumnoOrganico',Json);
    }else{
      return EMPTY;
    }
  }

  public ProcesarAfiliacionPagoRecurrenteAlumno(Json:any):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/ProcesarAfiliacionPagoRecurrenteAlumno',Json)
    }else{
      return EMPTY;
    }
    
  }

  public actualizarComprobantePagoLista(Json:any):Observable<any>{
    if(this.isBrowser){
      return this.http.post<any>(this.urlBase+'/actualizarComprobantePagoLista',Json)
    }else{
      return EMPTY;
    }
    
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
        if(parseInt(Json.IdPasarelaPago)==7 || parseInt(Json.IdPasarelaPago)==10){
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
          if(parseInt(Json.IdPasarelaPago)==11){
            this._router.navigate(['/AulaVirtual/MisPagos/webpay/'+sesion]);
          }
        }
      }
    });
  }
  public ChangeToPending(Json:any):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ChangeToPending',Json);
    }else{
      return EMPTY;
    }
  }

  public PreProcesoPagoTramiteAlumno(Json:RegistroPreProcesoPagoDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/PreProcesoPagoTramiteAlumno',Json);
    }else{
      return EMPTY;
    }
  }

  public ValidarProcesoPagoCuotaAlumnoOpenPAy(Json:RegistroRespuestaPreProcesoPagoDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ValidarProcesoPagoCuotaAlumnoOpenPAy',Json);
    }else{
      return EMPTY;
    }
  }

  public ValidarProcesoAfiliacionAlumnoOpenPAy(Json:RegistroRespuestaPreProcesoPagoDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ValidarProcesoAfiliacionOpenPay',Json);
    }else{
      return EMPTY;
    }
  }

  public ProcesamientoPagoOpenPay(ident:string):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ProcesamientoPagoOpenPay?Id='+ident);
    }else{
      return EMPTY;
    }
  }
  public ProcesamientoAfiliacionOpenPay(ident:string):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ValidarProcesoAfiliacionOpenPay?Id='+ident);
    }else{
      return EMPTY;
    }
  }

  public ObtenerConfirmacionWebPay(token_ws:string):Observable<any>{
    if(this.isBrowser){
      return this.http.get<any>(this.urlBase+'/ConfirmarTransaccionWebPay?token_ws='+token_ws);
    }else{
      return EMPTY;
    }
  }

  public ProcesarPagoConfirmadoKlap(Json:any):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ProcesarPagoConfirmadoKlap',Json);
    }else{
      return EMPTY;
    }
  }

  public ConsultarPagoKlap(Json:any):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/ConsultarEstadoTransaccionKlap',Json);
    }else{
      return EMPTY;
    }
  }

}
