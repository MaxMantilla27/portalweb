import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-resultado-pago-mercadopago',
  templateUrl: './resultado-pago-mercadopago.component.html',
  styleUrls: ['./resultado-pago-mercadopago.component.scss']
})
export class ResultadoPagoMercadopagoComponent implements OnInit,OnDestroy {

  private signal$ = new Subject()
  isBrowser: boolean;

  constructor(
    private _FormaPagoService:FormaPagoService,
    private _ActivatedRoute:ActivatedRoute,
    public dialog:MatDialog,
    private _SessionStorageService:SessionStorageService,
    private _router:Router,
    @Inject(PLATFORM_ID) platformId: Object,
  ) { 
    this.isBrowser = isPlatformBrowser(platformId); {}
  }
  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:false
  }
  
  resultProceso:any;
  reultadoPago :any;
  dialogRef:any
  public ruta=''
  public AreaCapacitacion=''
  public ProgramaNombre=''
  public rutaMisCursos='/AulaVirtual/MisCursos'


  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  ngOnInit(): void {
    if(this.isBrowser){
      this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
        next: (x) => {
          console.log("Identificador",x)
          this.json.IdentificadorTransaccion = x['Identificador'];
          this.ObtenerPreProcesoPagoCuotaAlumno()
        },
      });
    }
    this.obtenerUrlRedireccionErrorPago()
  }
  ObtenerPreProcesoPagoCuotaAlumno(){
    this.ruta='/AulaVirtual/MisPagos'
    let comprobanteString = this._SessionStorageService.SessionGetValue('comprobante')

    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.resultProceso = x._Repuesta
        if(x._Repuesta.respuestaComercio!=null && x._Repuesta.respuestaComercio!="" && x._Repuesta.estadoOperacion!='Error')
          this.reultadoPago = JSON.parse(x._Repuesta.respuestaComercio)
        console.log("resultProceso",this.resultProceso)
        console.log("reultadoPago",this.reultadoPago)
      },
      error:e=>{
        //this._router.navigate([this.ruta])
      }
    })
  }
  obtenerUrlRedireccionErrorPago(){
    var DatosFormulario = this._SessionStorageService.SessionGetValue('urlRedireccionErrorPago');
    console.log(DatosFormulario)
    if(DatosFormulario!=''){
      var datos = JSON.parse(DatosFormulario);
      console.log(datos)
      this.AreaCapacitacion = datos.AreaCapacitacion;
      this.ProgramaNombre = datos.ProgramaNombre;
    }
  }
  RedireccionarModalIntentoPago(){
    this._SessionStorageService.SessionSetValue('urlRedireccionErrorPagoModal','true');
    this._router.navigate(['/'+ this.AreaCapacitacion + '/' + this.ProgramaNombre])

  }
}

