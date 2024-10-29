import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { RegistroPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { ChargeSpinnerComponent } from 'src/app/Core/Shared/Containers/Dialog/charge-spinner/charge-spinner.component';
import { ImagenTarjetas } from 'src/app/Core/Shared/ImagenTarjetas';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { MedioPagoActivoPasarelaService } from 'src/app/Core/Shared/Services/MedioPagoActivoPasarela/medio-pago-activo-pasarela.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { ModalPagoVisaComponent } from '../../modal-confirmacion-pago/modal-pago-visa/modal-pago-visa.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pago-medio-pago',
  templateUrl: './pago-medio-pago.component.html',
  styleUrls: ['./pago-medio-pago.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PagoMedioPagoComponent implements OnInit, OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _MedioPagoActivoPasarelaService: MedioPagoActivoPasarelaService,
    private _t: ImagenTarjetas,
    private dialog: MatDialog,
    private _FormaPagoService: FormaPagoService,
    private _SessionStorageService: SessionStorageService,
    private _ActivatedRoute:ActivatedRoute,
    private _router:Router,

  ) {}
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public IdMatriculaCabecera = 0;
  public CronogramaPago: any;
  public DatosFacturacion: any;
  public IdPasarelaPago=0;

  public tarjetas: any;
  public validadorPagosMultiples: any;
  public validadorPagosChile: boolean = false;
  public medioPagoSeleccionado: any;
  public eventosPagoSelccion: boolean = false;
  public pagoRecurrenteActivado: boolean = false;
  public showTooltip: boolean = false;
  public listaCronogramaPagosJson: any = [];
  public codigoIso: string = 'INTC';
  public jsonSend: RegistroPreProcesoPagoDTO = {
    IdFormaPago: 0,
    IdMatriculaCabecera: 0,
    IdPasarelaPago: 0,
    IdPGeneral: 0,
    ListaCuota: [],
    MedioCodigo: '',
    MedioPago: '',
    Moneda: '',
    SimboloMoneda: '',
    WebMoneda: '',
  };
  public IdMedioPagoSeleccionado: number = -1;
  public MedioPagoPasarelaSeleccionado=false
  ngOnInit(): void {
    setTimeout(() => {
      document.documentElement.scrollTop=0;
    }, 100);
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x:any) => {
        this.IdMatriculaCabecera = parseInt(x['idmatricula']);
        this.IdPasarelaPago = parseInt(x['idpasarelapago']);
        var localDatosFacturacion = this._SessionStorageService.SessionGetValue('DatosFacturacionPagos');
        console.log(localDatosFacturacion)
        var localCronogramaPagos = this._SessionStorageService.SessionGetValue('DatosCronogramaPagosCuotas');
        console.log(localCronogramaPagos)

        if(localCronogramaPagos!=''){
          this.CronogramaPago = JSON.parse(localCronogramaPagos);
          console.log(this.CronogramaPago);
          this.jsonSend.IdPGeneral=this.CronogramaPago.idPGeneral
          this.jsonSend.IdMatriculaCabecera=this.CronogramaPago.idMatriculaCabecera
          if(this.CronogramaPago.registroCuota.length>0){
            this.jsonSend.Moneda=this.CronogramaPago.registroCuota[0].nombreMoneda
            this.jsonSend.SimboloMoneda=this.CronogramaPago.registroCuota[0].simbolo
            this.jsonSend.WebMoneda=this.CronogramaPago.registroCuota[0].webMoneda;
          }
        }
        if(localDatosFacturacion!=''){
          this.DatosFacturacion = JSON.parse(localDatosFacturacion);
          console.log(this.DatosFacturacion);

        }
        this.ObtenerTarjetasMedioPago()
      },
    });

    console.log(this.IdMatriculaCabecera);
    console.log(this.IdPasarelaPago);

  }
  ObtenerTarjetasMedioPago() {
    this._MedioPagoActivoPasarelaService
      .MedioPagoPasarelaPortalCronograma(this.IdMatriculaCabecera)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          this.validadorPagosMultiples = x.filter(
            (item: any) =>
              item.idPasarelaPago === 7 || item.idPasarelaPago === 10
          );
          this.validadorPagosChile =
            x.filter(
              (item: any) =>
                item.idPasarelaPago === 11 || item.idPasarelaPago === 17
            ).length > 0
              ? true
              : false;
          this.tarjetas = x;
          this.tarjetas.forEach((e: any) => {
            e.img = this._t.GetTarjeta(e.medioCodigo);
          });
          console.log('Tarjetas por alumno', this.tarjetas);
        },
        complete: () => {
          // this.ObtenerInformacionPagoLocal()
        },
      });
  }
  EnviarSolicitudPago(): void {
    console.log('Datos de pasarela:', this.medioPagoSeleccionado);
    console.log('Datos de pasarela:', this.IdMedioPagoSeleccionado);
    console.log('Validador',this.validadorPagosMultiples)
    let valorIdMedioPagoSeleccionado=0
    if(this.IdPasarelaPago==10 ||this.IdPasarelaPago==7){
      if(this.IdMedioPagoSeleccionado!=1){
        valorIdMedioPagoSeleccionado=0
      }
      else{
        valorIdMedioPagoSeleccionado=1
      }
      this.medioPagoSeleccionado = this.tarjetas[valorIdMedioPagoSeleccionado]
    }
    if(this.IdPasarelaPago==1){
      if(this.IdMedioPagoSeleccionado==0){
        valorIdMedioPagoSeleccionado=0
      }
      else{
        valorIdMedioPagoSeleccionado=3
      }
      this.medioPagoSeleccionado =this.tarjetas[valorIdMedioPagoSeleccionado]
      console.log('Medio Pago2', this.medioPagoSeleccionado);
    }
    if (this.medioPagoSeleccionado != undefined) {
      this.jsonSend.ListaCuota = [];
      // if (this.EstadoAfiliado){
      //   this.PreProcesoAfiliacionPagoRecurrenteV2(this.medioPagoSeleccionado);
      // }
      // else{
      //   this.PreProcesoPagoCuotaAlumnoV2(this.medioPagoSeleccionado);
      // }
      this.PreProcesoPagoCuotaAlumnoV2(this.medioPagoSeleccionado);
      this.eventosPagoSelccion = false;
    } else {
      this.eventosPagoSelccion = true;
    }
  }
  PreProcesoPagoCuotaAlumnoV2(tarjeta: any) {
    const dialogRefLoader = this.dialog.open(ChargeSpinnerComponent, {
      panelClass: 'dialog-charge-spinner',
      disableClose: true,
    });
    this.CronogramaPago.registroCuota.forEach((r: any) => {
      if (r.estado == true) {
        var fecha = new Date(r.fechaVencimiento);
        let NombreCuota = '';
        if (r.tipoCuota == 'MATRICULA') {
          NombreCuota =
            'MATRÍCULA -' +
            ('0' + fecha.getUTCDate()).slice(-2) +
            '/' +
            ('0' + (fecha.getUTCMonth() + 1)).slice(-2) +
            '/' +
            fecha.getUTCFullYear();
        } else {
          NombreCuota =
            'Cuota N°' +
            r.numeroCuotaMostrar +
            ' - ' +
            ('0' + fecha.getUTCDate()).slice(-2) +
            '/' +
            ('0' + (fecha.getUTCMonth() + 1)).slice(-2) +
            '/' +
            fecha.getUTCFullYear();
        }
        this.jsonSend.ListaCuota.push({
          IdCuota: r.idCuota,
          NroCuota: r.nroCuota,
          TipoCuota: r.tipoCuota,
          Cuota: r.cuota,
          Mora: r.mora,
          MoraCalculada: r.moraCalculada,
          CuotaTotal: r.cuota + r.moraCalculada,
          FechaVencimiento: r.fechaVencimiento,
          Nombre: NombreCuota,
        });
      }
    });

    this.jsonSend.IdFormaPago = tarjeta.idFormaPago;
    this.jsonSend.IdPasarelaPago = tarjeta.idPasarelaPago;
    this.jsonSend.MedioCodigo = tarjeta.medioCodigo;
    this.jsonSend.MedioPago = tarjeta.medioPago;
    this.jsonSend.TipoComprobante = this.DatosFacturacion.Comprobante;
    this.jsonSend.CodigoTributario = this.DatosFacturacion.CodigoTributario;
    this.jsonSend.TipoMedioPagoAdicional = 0;
    this._FormaPagoService
      .PreProcesoPagoCuotaAlumno(this.jsonSend)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          dialogRefLoader.close();

          var sesion = x._Repuesta.identificadorTransaccion;
          // this._SessionStorageService.SessionSetValue(
          //   sesion,
          //   x._Repuesta.requiereDatosTarjeta
          // );
          console.log(x._Repuesta)
          console.log(this.tarjetas)
          console.log(tarjeta)
          console.log(this.medioPagoSeleccionado)
          let ruta: string | null = null;
          switch (tarjeta.idPasarelaPago) {
            case 10:
              ruta = tarjeta.idFormaPago === 52 ? 'int-niubiz/' : tarjeta.idFormaPago === 48 ? 'int-niubiz-sec/' : null;
              break;
            case 7:
              ruta = tarjeta.idFormaPago === 52 ? 'pe-niubiz/' : tarjeta.idFormaPago === 48 ? 'pe-niubiz-sec/' : null;
              break;
            case 1:
              ruta = 'col-payu/';
              break;
          }
          if (ruta) {
            this._router.navigate([`/AulaVirtual/MisPagos/${this.IdMatriculaCabecera}/${this.IdPasarelaPago}/${ruta}${sesion}`]);
          }
          // if (tarjeta.idPasarelaPago == 7 || tarjeta.idPasarelaPago == 10) {
          //   if (tarjeta.idFormaPago == 52) {
          //     console.log(
          //       '/AulaVirtual/MisPagos/' +
          //         this.IdMatriculaCabecera +
          //         '/visa/' +
          //         sesion
          //     );

          //     /*Aperturamos el modal del pago*/
          //     const dialogRef = this.dialog.open(ModalPagoVisaComponent, {
          //       width: '600px',
          //       data: {
          //         Identificador: sesion,
          //         IdMatricula: this.IdMatriculaCabecera,
          //         DatosFacturacion: this.DatosFacturacion,
          //       },
          //       panelClass: 'dialog-Tarjeta-Modal',
          //       disableClose: true,
          //     });
          //     dialogRef
          //       .afterClosed()
          //       .pipe(takeUntil(this.signal$))
          //       .subscribe((result) => {
          //         if (result == true) {
          //           window.location.reload();
          //         }
          //       });

          //     // this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/visa/'+sesion]);
          //   }
          //   // if (tarjeta.idFormaPago == 48) {
          //   //   console.log(
          //   //     '/AulaVirtual/MisPagos/' +
          //   //       this.IdMatriculaCabecera +
          //   //       '/tarjeta/' +
          //   //       sesion
          //   //   );
          //   //   // this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/tarjeta/'+sesion]);
          //   //   const dialogRef = this.dialog.open(ModalPagoTarjetaComponent, {
          //   //     width: '600px',
          //   //     data: {
          //   //       Identificador: sesion,
          //   //       IdMatricula: this.IdMatriculaCabecera,
          //   //       DatosFacturacion: this.DatosFacturacion,
          //   //     },
          //   //     panelClass: 'dialog-Tarjeta-Modal',
          //   //     disableClose: true,
          //   //     // disableClose:true
          //   //   });
          //   // }
          // }
          // if(tarjeta.idPasarelaPago==1 || tarjeta.idPasarelaPago==5){
          //   console.log('/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/tarjeta/'+sesion)
          //   const dialogRef = this.dialog.open(ModalPagoTarjetaMexicoComponent, {
          //     width: '600px',
          //     data: { Identificador: sesion, IdMatricula: this.IdMatriculaCabecera, DatosFacturacion:this.DatosFacturacion },
          //     panelClass: 'dialog-Tarjeta-Modal',
          //     disableClose:true
          //     // disableClose:true
          //   });
          //   // this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/tarjeta/'+sesion]);
          // }
          // else{
          //   if(parseInt(tarjeta.idPasarelaPago)==2){
          //     console.log('/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/wompi/'+sesion)
          //     const dialogRef = this.dialog.open(ModalPagoWompiComponent, {
          //       width: '600px',
          //       data: { Identificador: sesion, IdMatricula: this.IdMatriculaCabecera, DatosFacturacion:this.DatosFacturacion },
          //       panelClass: 'dialog-Tarjeta-Modal',
          //       disableClose:true
          //       // disableClose:true
          //     });
          //     dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
          //       console.log("Pago wompi",result);
          //     });
          //     // this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/wompi/'+sesion]);
          //   }
          //   if(parseInt(tarjeta.idPasarelaPago)==6){
          //     console.log('/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/conekta/'+sesion)
          //     const dialogRef = this.dialog.open(ModalPagoConektaComponent, {
          //       width: '600px',
          //       data: { Identificador: sesion, IdMatricula: this.IdMatriculaCabecera, DatosFacturacion:this.DatosFacturacion },
          //       panelClass: 'dialog-Tarjeta-Modal',
          //       disableClose:true
          //       // maxHeight: '90vh' //you can adjust the value as per your view
          //     });
          //     // this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/conekta/'+sesion]);
          //   }
          //   if(parseInt(tarjeta.idPasarelaPago)==3){}
          //   if(parseInt(tarjeta.idPasarelaPago)==4){
          //     console.log('/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/multipago/'+sesion)
          //     // this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/multipago/'+sesion]);
          //   }
          //   if(parseInt(tarjeta.idPasarelaPago)==11){
          //     console.log('/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/webpay/'+sesion)
          //     const dialogRef = this.dialog.open(ModalPagoWebpayComponent, {
          //       width: '600px',
          //       data: { Identificador: sesion, IdMatricula: this.IdMatriculaCabecera, DatosFacturacion:this.DatosFacturacion },
          //       panelClass: 'dialog-Tarjeta-Modal',
          //       disableClose:true
          //     });
          //     // this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/webpay/'+sesion]);
          //   }
          //   if(parseInt(tarjeta.idPasarelaPago)==12){
          //     console.log(this.total)
          //     if(this.total>=50)
          //     console.log('/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/klap/'+sesion)
          //     // this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/klap/'+sesion]);
          //     else
          //     this._SnackBarServiceService.openSnackBar("Lo sentimos, para iniciar un pago con Klap el monto mínimo es de 50 pesos.",'x',10,"snackbarCrucigramaerror");
          //   }
          //   if(parseInt(tarjeta.idPasarelaPago)==13){
          //     console.log('/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/izipay/'+sesion)
          //     const dialogRef = this.dialog.open(ModalPagoIzipayComponent, {
          //       width: '600px',
          //       data: { Identificador: sesion, IdMatricula: this.IdMatriculaCabecera, DatosFacturacion:this.DatosFacturacion },
          //       panelClass: 'dialog-Tarjeta-Modal',
          //       disableClose:true
          //       // disableClose:true
          //     });
          //     dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe(result => {
          //       if(result==true){
          //         window.location.reload()
          //       }
          //     });
          //   }
          //   if(parseInt(tarjeta.idPasarelaPago)==16){
          //     console.log('/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/openpayCOP/'+sesion)
          //     const dialogRef = this.dialog.open(ModalPagoOpenpayColombiaComponent, {
          //       width: '600px',
          //       data: { Identificador: sesion, IdMatricula: this.IdMatriculaCabecera, DatosFacturacion:this.DatosFacturacion },
          //       panelClass: 'dialog-Tarjeta-Modal',
          //       disableClose:true
          //       // disableClose:true
          //     });
          //   }
          //   if(parseInt(tarjeta.idPasarelaPago)==17){//Mercado Pago
          //     console.log('/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/mercadoPago/'+sesion)
          //     const dialogRef = this.dialog.open(ModalPagoMercadoPagoChileComponent, {
          //       width: '600px',
          //       data: { Identificador: sesion, IdMatricula: this.IdMatriculaCabecera, DatosFacturacion:this.DatosFacturacion },
          //       panelClass: 'dialog-Tarjeta-Modal',
          //       disableClose:true,
          //       // maxHeight: '90vh' //you can adjust the value as per your view
          //       // disableClose:true
          //     })
          //     dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe(result => {
          //       if(result==true){
          //         window.location.reload()
          //       }
          //     });
          //     // this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/mercadoPago/'+sesion]);
          //   }
          //   if(parseInt(tarjeta.idPasarelaPago)==18){
          //     console.log('/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/openpayPEN/'+sesion)
          //     const dialogRef = this.dialog.open(ModalPagoOpenpayPeruComponent, {
          //       width: '600px',
          //       data: { Identificador: sesion, IdMatricula: this.IdMatriculaCabecera, DatosFacturacion:this.DatosFacturacion },
          //       panelClass: 'dialog-Tarjeta-Modal',
          //       disableClose:true
          //     });
          //     // this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/openpayPEN/'+sesion]);
          //   }
          // }
        },
        complete: ()=>{
          this.MedioPagoPasarelaSeleccionado=true
        }
      });
  }
  ObtenerMedioPagoSeleccion(valor:any){
    console.log(valor)
    this.IdMedioPagoSeleccionado = valor;
  }
  RegresarPagosCronograma(){
    this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera]);
  }
}
