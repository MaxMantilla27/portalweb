import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ImagenTarjetas } from 'src/app/Core/Shared/ImagenTarjetas';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { MedioPagoActivoPasarelaService } from 'src/app/Core/Shared/Services/MedioPagoActivoPasarela/medio-pago-activo-pasarela.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
@Component({
  selector: 'app-detalle-pago-chile-webpay',
  templateUrl: './detalle-pago-chile-webpay.component.html',
  styleUrls: ['./detalle-pago-chile-webpay.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetallePagoChileWebpayComponent implements  OnInit {
  private signal$ = new Subject()

  constructor(
    private _MedioPagoActivoPasarelaService: MedioPagoActivoPasarelaService,
    private _SessionStorageService:SessionStorageService,
    private _FormaPagoService:FormaPagoService,
    private _ActivatedRoute:ActivatedRoute,
    private _t: ImagenTarjetas,
    private _router:Router,
  ) { }

  public resultPreProceso:any
  public json={
    IdentificadorTransaccion:'',
    TokenComercio:null
  }
  public IdMatriculaCabecera=0;
  public DatosFacturacion: any = {};
  public IdPasarelaPago = 0;
  public tarjetas: any;
  public url = '/AulaVirtual/PagoExitoso/';
  ngOnInit(): void {
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (params) => {
        this.IdMatriculaCabecera = +params['idmatricula'];
        this.IdPasarelaPago = +params['idpasarelapago'];
        this.json.IdentificadorTransaccion = params['identificador'];
        this.url += this.json.IdentificadorTransaccion;
        this.ObtenerPreProcesoPagoCuotaAlumno();
        this.ObtenerTarjetasMedioPago();
      },
    });
  }
  redireccionarAWebpay(){
    console.log(this.url)
    window.location.href = this.url;
  }
  ObtenerPreProcesoPagoCuotaAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoAlumnoWebPay(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        let webPayResponse =x._Repuesta.registroEnvioComercio
        this.url = webPayResponse.url + "?token_ws="+webPayResponse.token
        this._SessionStorageService.SessionSetValue('token_ws',x._Repuesta.tokenComercio);
        this.resultPreProceso=x._Repuesta;
        this.resultPreProceso.total= 0;
        if(this.resultPreProceso.listaCuota!=undefined){
          this.resultPreProceso.listaCuota.forEach((l:any) => {
            this.resultPreProceso.total+=l.cuotaTotal
          });
        }
        else{
          this.resultPreProceso.total=this.resultPreProceso.montoTotal
        }
        console.log(this.resultPreProceso);

      }
    })
  }
  ObtenerTarjetasMedioPago(): void {
    this._MedioPagoActivoPasarelaService
      .MedioPagoPasarelaPortalCronograma(this.IdMatriculaCabecera)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (response) => {
          this.tarjetas = response.map((tarjeta: any) => ({
            ...tarjeta,
            img: this._t.GetTarjeta(tarjeta.medioCodigo),
          }));
          console.log('Tarjetas por alumno', this.tarjetas);
        },
      });
  }
  RegresarPasarela(): void {
    this._router.navigate(['/AulaVirtual/MisPagos/', this.IdMatriculaCabecera]);
  }
}
