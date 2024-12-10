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

  public RecurrenciaActivaPagos = false
  public valorIdMedioPagoSeleccionado=-1

  ngOnInit(): void {
    setTimeout(() => {
      document.documentElement.scrollTop=0;
    }, 100);
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x:any) => {
        this.IdMatriculaCabecera = parseInt(x['idmatricula']);
        this.IdPasarelaPago = parseInt(x['idpasarelapago']);
        var localDatosFacturacion = this._SessionStorageService.SessionGetValue('DatosFacturacionPagos');
        var localCronogramaPagos = this._SessionStorageService.SessionGetValue('DatosCronogramaPagosCuotas');

        if(localCronogramaPagos!=''){
          this.CronogramaPago = JSON.parse(localCronogramaPagos);
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

        }
        this.ObtenerTarjetasMedioPago()

        let RecurrenciaActivaLocal = this._SessionStorageService.SessionGetValue('opcionRecurrencia');
        console.log('Recurrencia:',RecurrenciaActivaLocal);

        if(RecurrenciaActivaLocal!=''){

          if(RecurrenciaActivaLocal=='true' && this.IdPasarelaPago==7){
            this.RecurrenciaActivaPagos = true;
          }else{

            this.RecurrenciaActivaPagos = false;
          }

        }

      },

      complete: ()=>{


      }

    });
  }
  ObtenerTarjetasMedioPago() {
    this._MedioPagoActivoPasarelaService
      .MedioPagoPasarelaPortalCronograma(this.IdMatriculaCabecera)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
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
        },
        complete: () => {
          // this.ObtenerInformacionPagoLocal()
        },
      });
  }
  EnviarSolicitudPago(): void {
    if(this.IdPasarelaPago==10 ||this.IdPasarelaPago==7){
      if(this.IdMedioPagoSeleccionado!=1){
        this.valorIdMedioPagoSeleccionado=0
      }
      else{
        this.valorIdMedioPagoSeleccionado=1
      }
      this.medioPagoSeleccionado = this.tarjetas[this.valorIdMedioPagoSeleccionado]
    }
    if(this.IdPasarelaPago==1){
      if(this.IdMedioPagoSeleccionado==0){
        this.valorIdMedioPagoSeleccionado=0
      }
      else{
        this.valorIdMedioPagoSeleccionado=3
      }
      this.medioPagoSeleccionado =this.tarjetas[this.valorIdMedioPagoSeleccionado]
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
          // NombreCuota =
          //   'MATRÍCULA -' +
          //   ('0' + fecha.getUTCDate()).slice(-2) +
          //   '/' +
          //   ('0' + (fecha.getUTCMonth() + 1)).slice(-2) +
          //   '/' +
          //   fecha.getUTCFullYear();
            NombreCuota =
            'MATRÍCULA'
        } else {
          // NombreCuota =
          //   'Cuota N°' +
          //   r.numeroCuotaMostrar +
          //   ' - ' +
          //   ('0' + fecha.getUTCDate()).slice(-2) +
          //   '/' +
          //   ('0' + (fecha.getUTCMonth() + 1)).slice(-2) +
          //   '/' +
          //   fecha.getUTCFullYear();
            NombreCuota =
            'Cuota N°' +
            r.numeroCuotaMostrar
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

        },
        complete: ()=>{
          this.MedioPagoPasarelaSeleccionado=true
        }
      });
  }
  ObtenerMedioPagoSeleccion(valor:any){
    this.IdMedioPagoSeleccionado = valor;
  }
  RegresarPagosCronograma(){
    this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera]);
  }

  OpenModalMetodoPagoSucripcion(): void {
    if(this.IdPasarelaPago==10 ||this.IdPasarelaPago==7){
      if(this.IdMedioPagoSeleccionado!=1){
        this.valorIdMedioPagoSeleccionado=0
      }
      else{
        this.valorIdMedioPagoSeleccionado=1
      }
      this.medioPagoSeleccionado = this.tarjetas[this.valorIdMedioPagoSeleccionado]
    }

    this.jsonSend.ListaCuota=[]
    this.PreProcesoAfiliacionPagoRecurrente(this.medioPagoSeleccionado);
  }

  PreProcesoAfiliacionPagoRecurrente(tarjeta:any){
    if(tarjeta==undefined){
      this.medioPagoSeleccionado = this.tarjetas[0];
    }

    this.CronogramaPago.registroCuota.forEach((r:any) => {
      if(r.cancelado==false){
        var fecha=new Date(r.fechaVencimiento);
        let NombreCuota = ''
        if(r.tipoCuota=="MATRICULA"){
          // NombreCuota='MATRÍCULA -'+ ('0' + fecha.getUTCDate()).slice(-2)+ "/" +("0" + (fecha.getUTCMonth()+1)).slice(-2) + "/" +fecha.getUTCFullYear()
          NombreCuota='MATRÍCULA'
        }
        else{
          NombreCuota='Cuota N°'+r.numeroCuotaMostrar
        }
        this.jsonSend.ListaCuota.push({
          IdCuota: r.idCuota,
          NroCuota: r.nroCuota,
          TipoCuota: r.tipoCuota,
          Cuota: r.cuota,
          Mora: r.mora,
          MoraCalculada: r.moraCalculada,
          CuotaTotal: r.cuota+r.moraCalculada,
          FechaVencimiento:r.fechaVencimiento,
          Nombre:NombreCuota
        })
      }
    });
    this.jsonSend.IdFormaPago=tarjeta.idFormaPago
    this.jsonSend.IdPasarelaPago=tarjeta.idPasarelaPago
    this.jsonSend.MedioCodigo=tarjeta.medioCodigo
    this.jsonSend.MedioPago=tarjeta.medioPago
      const dialogRef =this.dialog.open(ChargeSpinnerComponent,{
        panelClass:'dialog-charge-spinner',
        disableClose:true
      });
      this._FormaPagoService.PreProcesoAfiliacionAlumno(this.jsonSend).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          dialogRef.close();
          var sesion=x._Repuesta.identificadorTransaccion;
          this._SessionStorageService.SessionSetValue(sesion,x._Repuesta.requiereDatosTarjeta);
         if(tarjeta.idPasarelaPago==7){ //visa
            if(tarjeta.idFormaPago==52){
              this._router.navigate(['/AulaVirtual/MisPagos/Afiliacion/'+this.IdMatriculaCabecera+'/visa/'+sesion]);
            }
          }

        },
        complete:()=>{
          dialogRef.close();
        },
        error:e=>{
          console.log(e)
          dialogRef.close();
        }
      })

  }


}
