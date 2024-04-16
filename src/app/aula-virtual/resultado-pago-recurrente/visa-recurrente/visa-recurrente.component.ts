import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-visa-recurrente',
  templateUrl: './visa-recurrente.component.html',
  styleUrls: ['./visa-recurrente.component.scss']
})
export class VisaRecurrenteComponent implements OnInit {
  private signal$ = new Subject();
  isBrowser: boolean;

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _router:Router,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId); {}
  }

  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  public DatosRecurrente:any={
    identificadorTransaccion:'',
  }

  public resultVisa:any
  public ruta=''
  public rutaMisCursos='/AulaVirtual/MisCursos'
  public AreaCapacitacion=''
  public ProgramaNombre=''
  intentos=0;
  img=1;
  imgAc=''
  public rutaPago='/AulaVirtual/MisPagos'
  public rutaCursos = '/AulaVirtual/MisCursos'
  ngOnInit(): void {
    if(this.isBrowser){
      this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
        next: (x) => {
          this.DatosRecurrente.identificadorTransaccion = x['Identificador'];
          this.ProcesarPagoRecurrente()
        },
      });
    }
    this.obtenerUrlRedireccionErrorPago()
  }


  ProcesarPagoRecurrente(){
    this.ruta='/AulaVirtual/MisPagos'
    let comprobanteString = this._SessionStorageService.SessionGetValue('comprobante')
    let json={
      IdentificadorTransaccion:this.DatosRecurrente.identificadorTransaccion,
      RequiereDatosTarjeta:true
    }

    this._FormaPagoService.RegistroPagoCuotaAlumnoVisaProcesarRecurrente(this.DatosRecurrente).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(json).pipe(takeUntil(this.signal$)).subscribe({
          next:x=>{
            this.resultVisa=x._Repuesta
            if(this.resultVisa.idMatriculaCabecera>0 &&
              this.resultVisa.idMatriculaCabecera!=null &&
              this.resultVisa.idMatriculaCabecera!=undefined ){
                this.rutaPago=this.rutaPago+'/'+this.resultVisa.idMatriculaCabecera
                this.rutaCursos=this.rutaCursos+'/'+this.resultVisa.idMatriculaCabecera
            }
            if(this.resultVisa.estadoOperacion=='Processed'){
              var valor:any
              let objComprobante = JSON.parse(comprobanteString)

              objComprobante.listaCuota.forEach((l:any) => {
                if(valor==undefined){
                  valor=l
                }else{
                  if(valor.nroCuota<l.nroCuota){
                    valor=l
                  }
                }
              });
              objComprobante.listaCuota = [valor]
              this._FormaPagoService.actualizarComprobantePagoLista(objComprobante).pipe(takeUntil(this.signal$)).subscribe({
                next:x=>{
                }
              })
            }
          }
        })
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

