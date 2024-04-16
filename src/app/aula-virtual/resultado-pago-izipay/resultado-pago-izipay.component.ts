import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-resultado-pago-izipay',
  templateUrl: './resultado-pago-izipay.component.html',
  styleUrls: ['./resultado-pago-izipay.component.scss']
})
export class ResultadoPagoIzipayComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  isBrowser: boolean;
  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _router:Router,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId); {}
  }

  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:true
  }

  dialogRef:any
  public tipoRespuesta = null
  resultWebpay:any
  public resultProceso :any
  public ruta='/AulaVirtual/MisPagos'
  public rutaCursos = '/AulaVirtual/MisCursos'
  ngOnInit(): void {
    if(this.isBrowser){
      this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
        next: (x) => {
          this.json.IdentificadorTransaccion = x['Identificador'];
          this._ActivatedRoute.queryParams.pipe(takeUntil(this.signal$)).subscribe({
            next: (x) => {
              this.tipoRespuesta = x['tipo']
              this.ObtenerPreProcesoPagoCuotaAlumno()
            },
          });
        },
      });
    }
  }

  ObtenerPreProcesoPagoCuotaAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log("REPUESTA-PREPROCESO",x._Repuesta)
        this.resultProceso =x._Repuesta
        if(this.resultProceso.idMatriculaCabecera>0 &&
          this.resultProceso.idMatriculaCabecera!=null &&
          this.resultProceso.idMatriculaCabecera!=undefined ){
            this.ruta=this.ruta+'/'+this.resultProceso.idMatriculaCabecera
            this.rutaCursos=this.rutaCursos+'/'+this.resultProceso.idMatriculaCabecera
        }
      },
      error:e=>{
        //this._router.navigate([this.ruta])
      }
    })
  }


}
