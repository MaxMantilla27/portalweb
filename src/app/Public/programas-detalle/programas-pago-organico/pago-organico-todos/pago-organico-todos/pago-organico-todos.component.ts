import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  PagoOrganicoAlumnoDTO,
  RegistroProcesoPagoAlumnoDTO,
  RegistroRespuestaPreProcesoPagoDTO,
} from 'src/app/Core/Models/ProcesoPagoDTO';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { ImagenTarjetas } from 'src/app/Core/Shared/ImagenTarjetas';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { MedioPagoActivoPasarelaService } from 'src/app/Core/Shared/Services/MedioPagoActivoPasarela/medio-pago-activo-pasarela.service';
import { ProgramaService } from 'src/app/Core/Shared/Services/Programa/programa.service';
import { SeccionProgramaService } from 'src/app/Core/Shared/Services/SeccionPrograma/seccion-programa.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { ModalPagoConektaOrganicoComponent } from 'src/app/aula-virtual/modal-confirmacion-pago-organico/modal-pago-conekta-organico/modal-pago-conekta-organico/modal-pago-conekta-organico.component';
import { ModalPagoIzipayOrganicoComponent } from 'src/app/aula-virtual/modal-confirmacion-pago-organico/modal-pago-izipay-organico/modal-pago-izipay-organico/modal-pago-izipay-organico.component';
import { ModalPagoMercadoPagoChileOrganicoComponent } from 'src/app/aula-virtual/modal-confirmacion-pago-organico/modal-pago-mercado-pago-chile-organico/modal-pago-mercado-pago-chile-organico/modal-pago-mercado-pago-chile-organico.component';
import { ModalPagoOpenpayColombiaOrganicoComponent } from 'src/app/aula-virtual/modal-confirmacion-pago-organico/modal-pago-openpay-colombia-organico/modal-pago-openpay-colombia-organico/modal-pago-openpay-colombia-organico.component';
import { ModalPagoOpenpayPeruOrganicoComponent } from 'src/app/aula-virtual/modal-confirmacion-pago-organico/modal-pago-openpay-peru-organico/modal-pago-openpay-peru-organico/modal-pago-openpay-peru-organico.component';
import { ModalPagoTarjetaMexicoOraganicoComponent } from 'src/app/aula-virtual/modal-confirmacion-pago-organico/modal-pago-tarjeta-mexico-organico/modal-pago-tarjeta-mexico-oraganico/modal-pago-tarjeta-mexico-oraganico.component';
import { ModalPagoTarjetaOrganicoComponent } from 'src/app/aula-virtual/modal-confirmacion-pago-organico/modal-pago-tarjeta-organico/modal-pago-tarjeta-organico/modal-pago-tarjeta-organico.component';
import { ModalPagoVisaOrganicoComponent } from 'src/app/aula-virtual/modal-confirmacion-pago-organico/modal-pago-visa-organico/modal-pago-visa-organico/modal-pago-visa-organico.component';
import { ModalPagoWebpayOrganicoComponent } from 'src/app/aula-virtual/modal-confirmacion-pago-organico/modal-pago-webpay-organico/modal-pago-webpay-organico/modal-pago-webpay-organico.component';
import { ModalPagoWompiOrganicoComponent } from 'src/app/aula-virtual/modal-confirmacion-pago-organico/modal-pago-wompi-organico/modal-pago-wompi-organico/modal-pago-wompi-organico.component';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { HelperService as Help } from 'src/app/Core/Shared/Services/helper.service';
import { PagoTarjetaComponent } from 'src/app/aula-virtual/pago/pago-tarjeta/pago-tarjeta.component';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
const pipe = new DatePipe('en-US')

@Component({
  selector: 'app-pago-organico-todos',
  templateUrl: './pago-organico-todos.component.html',
  styleUrls: ['./pago-organico-todos.component.scss'],
})
export class PagoOrganicoTodosComponent implements OnInit {
  private signal$ = new Subject();
  isBrowser: boolean;
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private _router: Router,
    private _HelperService: HelperService,
    private _SeccionProgramaService: SeccionProgramaService,
    private _ProgramaService: ProgramaService,
    private _MedioPagoActivoPasarelaService: MedioPagoActivoPasarelaService,
    private _t: ImagenTarjetas,
    public _FormaPagoService: FormaPagoService,
    private _SessionStorageService: SessionStorageService,
    public dialog: MatDialog,
    private _HelperServiceP: Help,
    private _SnackBarServiceService:SnackBarServiceService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public resultCard: any = {
    nombrePrograma: '',
    version: '',
    tipo: 1,
    moneda: '',
    montoTotal: 0,
    inicio: '',
  };
  public modalidadSeleccionada: any = {
    tipo: 1,
    fechaInicioTexto: '',
    version: '',
  };
  public formaPagoSeleccion: any = {
    moneda: '',
    montoTotal: 0,
  };
  public idPEspecifico = 0;
  public validadorPagosMultiples: any;
  public medioPagoSeleccionado: any;
  public tarjetas: any;
  public idFormaPago = -1;
  public formapago: any;
  public eventosPagoSelccion: boolean = false;
  public datospago: any;
  public modalidad: any;
  public idPegeneral = 0;
  public datosPrograma: any;
  public validadorPagosChile: boolean = false;
  public jsonEnvioPago: PagoOrganicoAlumnoDTO = {
    CodigoBanco: '',
    IdFormaPago: 0,
    IdMontoPago: 0,
    IdPais: 0,
    IdPasarelaPago: '',
    IdPEspecifico: 0,
    IdPGeneral: 0,
    MontoTotalPago: 0,
    RequiereTarjeta: true,
    TipoProveedor: '',
    WebMoneda: 0,
    MedioCodigo: '',
    MedioPago: '',
    Moneda: '',
    Inicio: '',
    Tipo: '',
    Version: '',
    IdBusqueda: 0,
    TipoComprobante: false,
    CodigoTributario:''

  };
  public DatosFacturacion: any = {
    Comprobante: false,
    RazonSocial: '',
    CodigoTributario: '',
  };
  public jsonSave: RegistroProcesoPagoAlumnoDTO = {
    IdentificadorTransaccion: '',
    MedioCodigo: '',
    MedioPago: '',
    RequiereDatosTarjeta: true,
    TransactionToken: '',
    Estado: null,
    Comprobante: false,
    CodigoTributario: '',
    RazonSocial: '',
    IdPasarelaPago: 0,
    IdentificadorUsuario: '',
    PagoPSE: false,
    TarjetaHabiente: {
      Aniho: '',
      CodigoVV: '',
      Mes: '',
      NumeroDocumento: '',
      NumeroTarjeta: '',
      Titular: '',
      fecha: '',
    },
  };
  public medioCodigo = 0;
  public contCambioPais = 0;
  public codigoIso: string = 'INTC';
  public IdPais = -1;
  public Paises: any;
  dialogRef:any
  public pagoRecurrenteActivado:boolean = false;

  ngOnInit(): void {
     this.dialogRef =this.dialog.open(ChargeComponent,{
      panelClass:'dialog-charge',
      disableClose:true
    });
        this.datospago = localStorage.getItem('datEnvioPago');
    this.datospago = atob(this.datospago);
    this.datospago = JSON.parse(this.datospago);
    this.modalidad = this.datospago.modalidad;


    this._HelperServiceP.recibirDataPais
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.Paises = x;
          this.codigoIso =
            this._SessionStorageService.SessionGetValue('ISO_PAIS') != ''
              ? this._SessionStorageService.SessionGetValue('ISO_PAIS')
              : 'INTC';
          console.log('*********************', this.codigoIso);
          this.IdPais = this.GetIdPaisProCodigo();

          this.ListMontoPagoCompleto();
          this.MedioPagoActivoPasarelaPortal();
        },
      });

    this._HelperService
      .recibirChangePais()
      .pipe(takeUntil(this.signal$))
      .subscribe((x) => {
        console.log('cambio de pais');
        //this._router.navigate(['/AulaVirtual/MisCursos']);

        if (this.isBrowser) {
          this.ObtenerCabeceraProgramaGeneral();
          location.reload();
        }

        // if(this.change==true){
        //   this.GetProgramasHome()
        // }
      });


  }
  GetIdPaisProCodigo(): number {
    var idp = 0;
    this.Paises.forEach((p: any) => {
      if (p.codigoIso.toLowerCase() == this.codigoIso.toLowerCase()) {
        idp = parseInt(p.idPais);
      }
    });
    return idp;
  }
  removeAccents(strng: string) {
    return strng.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  ListMontoPagoCompleto() {
    this._SeccionProgramaService
      .ListMontoPagoCompleto(this.datospago.idBusqueda)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.formapago = x.listaMontoPagoProgramaInformacionDTO;
          console.log('forma!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1', this.formapago);
        },
      });
  }
  ObtenerCabeceraProgramaGeneral() {
    this._SeccionProgramaService
      .ObtenerCabeceraProgramaGeneral(this.datospago.idBusqueda)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          //console.log(x.programaCabeceraDetalleDTO.direccion==this.namePrograma.join('-'))
          window.location.replace(
            '/' +
              this.removeAccents(x.programaCabeceraDetalleDTO.areaDescripcion) +
              '/' +
              x.programaCabeceraDetalleDTO.direccion
          );
        },
        error: (e) => {
          this._router.navigate(['error404']);
        },
      });
  }

  MedioPagoActivoPasarelaPortal() {
    this._MedioPagoActivoPasarelaService
      .MedioPagoActivoPasarelaPortal(this.IdPais)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.validadorPagosMultiples = x.filter(
            (item: any) =>
              item.idPasarelaPago === 7 ||
              item.idPasarelaPago === 18 ||
              item.idPasarelaPago === 10
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
          //this.ListMontoPagoCompleto();
        },
      });
      this.dialogRef.close()
  }
  EventoInteraccionSelectClick(nombre: string) {
    this._HelperService.enviarMsjAcciones({
      Tag: 'Select',
      Nombre: nombre,
      Tipo: 'Click',
    });
  }
  EventoInteraccionSelect(nombre: string, valor: string) {
    this._HelperService.enviarMsjAcciones({
      Tag: 'Select',
      Nombre: nombre,
      Tipo: 'Select',
      Valor: valor,
    });
  }
  seleccionModalidad: boolean = false;
  changeModalidad() {
    this.seleccionModalidad = true;
    if (this.validadorPagosMultiples.length != 0) {
      if (
        this.seleccionFormaPago == true &&
        this.seleccionModalidad == true &&
        this.seleccionMetodoPago == true
      ) {
        this.botonContinuar = false;
      }
    }

    this.modalidadSeleccionada = this.modalidad.find(
      (e: any) => e.id == this.idPEspecifico
    );

    if (
      this.medioPagoSeleccionado != undefined &&
      this.idFormaPago != -1 &&
      this.idPEspecifico != 0
    ) {
      //this.ObtenerPreProcesoPagoOrganicoAlumno();
    }
    if (this.validadorPagosMultiples.length === 0) {
      if (this.seleccionFormaPago == true && this.seleccionModalidad == true) {
        this.botonContinuar = false;
      }
    }

  }
  seleccionMetodoPago: boolean = false;
  onChangeRadioButton(event: any) {
    this.pagoRecurrenteActivado=false;
    this.seleccionMetodoPago = true;
    if (this.validadorPagosMultiples.length != 0) {
      if (
        this.seleccionFormaPago == true &&
        this.seleccionModalidad == true &&
        this.seleccionMetodoPago == true
      ) {
        this.botonContinuar = false;
      }
    }


    this.medioPagoSeleccionado = event;
    this.medioCodigo = this.medioPagoSeleccionado.idFormaPago;
    //
    if (
      this.medioPagoSeleccionado != undefined &&
      this.idFormaPago != -1 &&
      this.idPEspecifico != 0
    ) {
      //this.ObtenerPreProcesoPagoOrganicoAlumno();
    }

    if (this.validadorPagosMultiples.length === 0) {
      if (this.seleccionFormaPago == true && this.seleccionModalidad == true) {
        this.botonContinuar = false;
      }
    }
  }
  public infoPago: any = {
    precio: '',
    moneda: '',
    version: '',
  };
  public pEspecifico: any;

  seleccionFormaPago: boolean = false;
  botonContinuar: boolean = true;
  changeForma() {
    console.log('cambio')
    this.seleccionFormaPago = true;
    if (this.validadorPagosMultiples.length != 0) {
      if (
        this.seleccionFormaPago == true &&
        this.seleccionModalidad == true &&
        this.seleccionMetodoPago == true
      ) {
        this.botonContinuar = false;
      }
    }


    var fp = this.formapago[this.idFormaPago];
    this.formaPagoSeleccion = this.formapago[this.idFormaPago];

    this.modalidad.forEach((e: any) => {
      if (e.id == this.idPEspecifico) {
        this.pEspecifico = e;
      }
    });

    var value = '';
    if (fp.paquete == 1) {
      value = 'Versión Basica,';
      this.infoPago.version = 'Versión Basica';
    }
    if (fp.paquete == 2) {
      value = 'Versión Profesional,';
      this.infoPago.version = 'Versión Profesional';
    }
    if (fp.paquete == 3) {
      value = 'Versión Gerencial,';
      this.infoPago.version = 'Versión Gerencial';
    }
    if (fp.paquete == 4) {
      value = 'Sin Version,';
      this.infoPago.version = '';
    }
    if (fp.idTipoPago == 1) {
      value += 'al Contado: ' + fp.simbolo + ' ' + fp.cuotas;
    }

    if (fp.idTipoPago == 2) {
      value +=
        'pago en 1 matricula de' +
        fp.simbolo +
        ' ' +
        fp.matricula +
        ' y ' +
        fp.nroCuotas +
        ' cuotas mensuales de ' +
        fp.simbolo +
        ' ' +
        fp.cuotas;
    }
    this.EventoInteraccionSelect('Selecciona tu forma de pago', value);

    if (this.formaPagoSeleccion.idTipoPago == 1) {
      this.infoPago.precio = this.formaPagoSeleccion.cuotas;
    } else {
      this.infoPago.precio = this.formaPagoSeleccion.matricula;
    }

    // if(this.formaPagoSeleccion.nroCuotas == 1){
    //   this.infoPago.precio= this.formaPagoSeleccion.cuotas

    //   //this.formaPagoSeleccion.matricula =='0.00' &&
    // }else{
    //   this.infoPago.precio= this.formaPagoSeleccion.matricula

    // }
    // if( this.medioPagoSeleccionado != undefined && this.idFormaPago != -1 && this.idPEspecifico != 0 ){
    //  // this.ObtenerPreProcesoPagoOrganicoAlumno();
    // }
    if (this.validadorPagosMultiples.length === 0) {
      if (this.seleccionFormaPago == true && this.seleccionModalidad == true) {
        this.botonContinuar = false;
      }
    }
  }
  dataPreprocesamiento: any;
  jsonPreproceaminetoData: any;
  continuarPago() {
    if (this.medioPagoSeleccionado == undefined) {
      this.medioPagoSeleccionado = this.tarjetas[0];
    }
    //var find=this.tarjetas.find((x:any)=>x.medioCodigo==this.medioCodigo)
    const dialogRefLoader = this.dialog.open(ChargeComponent, {
      panelClass: 'dialog-charge',
      disableClose: true,
    });
    //this.jsonEnvioPago.CodigoBanco=tarjeta.medioCodisgo;
    this.jsonEnvioPago.IdFormaPago = this.medioCodigo;
    //this.jsonEnvioPago.IdMontoPago=;
    this.jsonEnvioPago.IdPEspecifico = this.modalidadSeleccionada.id;
    this.jsonEnvioPago.IdPGeneral = this.idPegeneral;
    this.jsonEnvioPago.IdPais = this.IdPais;
    this.jsonEnvioPago.IdPasarelaPago =
      this.medioPagoSeleccionado.idPasarelaPago.toString();
    this.jsonEnvioPago.MedioCodigo = this.medioPagoSeleccionado.medioCodigo;
    this.jsonEnvioPago.MedioPago = this.medioPagoSeleccionado.medioPago;
    this.jsonEnvioPago.Moneda = this.formaPagoSeleccion.simbolo;
    this.jsonEnvioPago.MontoTotalPago = this.infoPago.precio;
    this.jsonEnvioPago.Inicio = this.pEspecifico?.fechaInicioTexto;
    this.jsonEnvioPago.Version = this.infoPago.version;
    this.jsonEnvioPago.Tipo = this.pEspecifico.tipo;
    this.jsonEnvioPago.TipoComprobante =this.DatosFacturacion.Comprobante;
    this.jsonEnvioPago.CodigoTributario = this.DatosFacturacion.RazonSocial ;
        //this.jsonEnvioPago.TipoProveedor=;
    this.jsonEnvioPago.WebMoneda = this.formaPagoSeleccion.webMoneda;
    var token = this._SessionStorageService.validateTokken();
    if (token) {
      this._FormaPagoService
        .PagoOrganicoDatosServicio(this.jsonEnvioPago) //PagoOrganicoAlumnoDTO
        .pipe(takeUntil(this.signal$))
        .subscribe({
          next: (x) => {
            console.log('resultcard', x);
            dialogRefLoader.close()

            this.jsonPreproceaminetoData = {
              identificadorTransaccion: x._Repuesta.identificadorTransaccion,
              requiereDatosTarjeta: x._Repuesta.requiereDatosTarjeta,
            };

            /////////logica abrir modales :D

            console.log(x);

            var sesion = x._Repuesta.identificadorTransaccion;
            this._SessionStorageService.SessionSetValue(
              sesion,
              x._Repuesta.requiereDatosTarjeta
            );
            console.log(parseInt(this.medioPagoSeleccionado.idPasarelaPago));
            this.medioPagoSeleccionado.idPasarelaPago=7
            this.medioCodigo = 48
            if (
              this.medioPagoSeleccionado.idPasarelaPago == 7 ||
              this.medioPagoSeleccionado.idPasarelaPago == 10
            ) {
              if (this.medioCodigo == 52) {
                console.log('ModalPagoVisaOrganicoComponent');

                /*Aperturamos el modal del pago*/
                const dialogRef = this.dialog.open(
                  ModalPagoVisaOrganicoComponent,
                  {
                    width: '600px',
                    data: {
                      Identificador: sesion,
                      // IdMatricula: this.idMatricula,
                      DatosFacturacion: this.DatosFacturacion,
                    },
                    panelClass: 'dialog-Tarjeta-Modal',
                    disableClose:true
                  }
                );

                // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/visa/'+sesion]);
              }
              if (this.medioCodigo == 48) {
                console.log('ModalPagoTarjetaOrganicoComponent');
                // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/tarjeta/'+sesion]);
                const dialogRef = this.dialog.open(
                  ModalPagoTarjetaOrganicoComponent,
                  {
                    width: '600px',
                    data: {
                      Identificador: sesion,
                      // IdMatricula: this.idMatricula,
                      DatosFacturacion: this.DatosFacturacion,
                    },
                    panelClass: 'dialog-Tarjeta-Modal',
                    disableClose:true
                  }
                );
              }
            }
            if (
              this.medioPagoSeleccionado.idPasarelaPago == 1 ||
              this.medioPagoSeleccionado.idPasarelaPago == 5
            ) {
              console.log('ModalPagoTarjetaMexicoOraganicoComponent');
              const dialogRef = this.dialog.open(
                ModalPagoTarjetaMexicoOraganicoComponent,
                {
                  width: '600px',
                  data: {
                    Identificador: sesion,
                    // IdMatricula: this.idMatricula,
                    DatosFacturacion: this.DatosFacturacion,
                  },
                  panelClass: 'dialog-Tarjeta-Modal',
                  // disableClose:true
                }
              );

              // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/tarjeta/'+sesion]);
            } else {
              if (parseInt(this.medioPagoSeleccionado.idPasarelaPago) == 2) {
                console.log('ModalPagoWompiOrganicoComponent');
                const dialogRef = this.dialog.open(
                  ModalPagoWompiOrganicoComponent,
                  {
                    width: '600px',
                    data: {
                      Identificador: sesion,
                      // IdMatricula: this.idMatricula,
                      DatosFacturacion: this.DatosFacturacion,
                    },
                    panelClass: 'dialog-Tarjeta-Modal',
                    disableClose:true
                  }
                );
                dialogRef
                  .afterClosed()
                  .pipe(takeUntil(this.signal$))
                  .subscribe((result) => {
                    console.log('Pago wompi', result);
                  });
                // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/wompi/'+sesion]);
              }
              if (parseInt(this.medioPagoSeleccionado.idPasarelaPago) == 6) {
                console.log('ModalPagoConektaOrganicoComponent');
                const dialogRef = this.dialog.open(
                  ModalPagoConektaOrganicoComponent,
                  {
                    width: '600px',
                    data: {
                      Identificador: sesion,
                      // IdMatricula: this.idMatricula,
                      DatosFacturacion: this.DatosFacturacion,
                    },
                    panelClass: 'dialog-Tarjeta-Modal',
                    // maxHeight: '90vh', //you can adjust the value as per your view
                    disableClose:true
                  }
                );
                // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/conekta/'+sesion]);
              }

              if (parseInt(this.medioPagoSeleccionado.idPasarelaPago) == 3) {
              }
              if (parseInt(this.medioPagoSeleccionado.idPasarelaPago) == 4) {
                // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/multipago/'+sesion]);
              }
              if (parseInt(this.medioPagoSeleccionado.idPasarelaPago) == 11) {
                console.log('ModalPagoWebpayOrganicoComponent');
                const dialogRef = this.dialog.open(
                  ModalPagoWebpayOrganicoComponent,
                  {
                    width: '600px',
                    data: {
                      Identificador: sesion,
                      // IdMatricula: this.idMatricula,
                      DatosFacturacion: this.DatosFacturacion,
                    },
                    panelClass: 'dialog-Tarjeta-Modal',
                    disableClose:true
                  }
                );
                // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/webpay/'+sesion]);
              }

              if (parseInt(this.medioPagoSeleccionado.idPasarelaPago) == 12) {
                // console.log(this.total);
                // if (this.total >= 50)
                //   // console.log(
                //   //   '/AulaVirtual/MisPagos/' +
                //   //     this.idMatricula +
                //   //     '/klap/' +
                //   //     sesion
                //   // );
                // // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/klap/'+sesion]);
                // else
                //   this._SnackBarServiceService.openSnackBar(
                //     'Lo sentimos, para iniciar un pago con Klap el monto mínimo es de 50 pesos.',
                //     'x',
                //     10,
                //     'snackbarCrucigramaerror'
                //   );
              }
              if (parseInt(this.medioPagoSeleccionado.idPasarelaPago) == 13) {
                console.log('ModalPagoIzipayOrganicoComponent');
                const dialogRef = this.dialog.open(
                  ModalPagoIzipayOrganicoComponent,
                  {
                    width: '600px',
                    data: {
                      Identificador: sesion,
                      // IdMatricula: this.idMatricula,
                      DatosFacturacion: this.DatosFacturacion,
                    },
                    panelClass: 'dialog-Tarjeta-Modal',
                    disableClose:true
                  }
                );
                // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/izipay/'+sesion]);
              }

              if (parseInt(this.medioPagoSeleccionado.idPasarelaPago) == 16) {
                console.log('ModalPagoOpenpayColombiaOrganicoComponent');
                const dialogRef = this.dialog.open(
                  ModalPagoOpenpayColombiaOrganicoComponent,
                  {
                    width: '600px',
                    data: {
                      Identificador: sesion,
                      // IdMatricula: this.idMatricula,
                      DatosFacturacion: this.DatosFacturacion,
                    },
                    panelClass: 'dialog-Tarjeta-Modal',
                    disableClose:true
                  }
                );
              }
              if (parseInt(this.medioPagoSeleccionado.idPasarelaPago) == 17) {
                //Mercado Pago
                console.log('ModalPagoMercadoPagoChileOrganicoComponent');
                const dialogRef = this.dialog.open(
                  ModalPagoMercadoPagoChileOrganicoComponent,
                  {
                    width: '600px',
                    data: {
                      Identificador: sesion,
                      // IdMatricula: this.idMatricula,
                      DatosFacturacion: this.DatosFacturacion,
                    },
                    panelClass: 'dialog-Tarjeta-Modal',
                    // maxHeight: '90vh', //you can adjust the value as per your view
                    disableClose:true
                  }
                );
                // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/mercadoPago/'+sesion]);
              }
              if (parseInt(this.medioPagoSeleccionado.idPasarelaPago) == 18) {
                console.log('ModalPagoOpenpayPeruOrganicoComponent');
                const dialogRef = this.dialog.open(
                  ModalPagoOpenpayPeruOrganicoComponent,
                  {
                    width: '600px',
                    data: {
                      Identificador: sesion,
                      // IdMatricula: this.idMatricula,
                      DatosFacturacion: this.DatosFacturacion,
                    },
                    panelClass: 'dialog-Tarjeta-Modal',
                    disableClose:true
                  }
                );
                // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/openpayPEN/'+sesion]);
              }
            }

            //////

            // this._FormaPagoService
            //   .ObtenerPreProcesoPagoOrganicoAlumno(this.jsonPreproceaminetoData)
            //   .pipe(takeUntil(this.signal$))
            //   .subscribe({
            //     next: (x) => {
            //       dialogRefLoader.close();
            //       console.log('aquise hizo el proecesamiento', x);
            //       this.resultCard = x._Repuesta;
            //     },
            //   });
          },
        });
    } else {
      this._SessionStorageService.SessionSetValue('redirect', 'pago');
      this._SessionStorageService.SessionSetValue(
        'datosTarjeta',
        JSON.stringify(this.jsonEnvioPago)
      );
      this._router.navigate(['/login']);
      this._SessionStorageService.SessionSetValueSesionStorage(
        'PagoPublicidad',
        '1'
      );
    }
  }
  OpenModalMetodoPagoSucripcion(): void {
    // var fechaActual = new Date();
    // var fechaVencimiento = new Date();
    // var stringActual= pipe.transform(new Date(), 'yyyy-MM-ddT00:00:00.000')
    // var stringVencimiento= pipe.transform(new Date(this.CronogramaPago.fechaVencimiento), 'yyyy-MM-ddT00:00:00.000')
    // if(stringActual)fechaActual=new Date(stringActual)
    // if(stringVencimiento)fechaVencimiento=new Date(stringVencimiento)
    // // if(fechaActual <= fechaVencimiento)
    // // {
    // // if(fechaActual <= fechaVencimiento)
    // // {
    //   let validador=0
    //   if(this.idPasarela==5){ //OpenPay
    //     let count=0
    //     let cuotaBase=0
    //     let fechaBase = new Date();
    //     this.CronogramaPago.registroCuota.forEach((e:any) => {
    //       if(e.cancelado==false){
    //         if(count==0){
    //           cuotaBase = e.cuota+e.moraCalculada
    //           fechaBase = new Date(e.fechaVencimiento)
    //         }
    //         let cuotaTotal:number =e.cuota+e.moraCalculada
    //         if(cuotaBase!==cuotaTotal)validador=1
    //         if(new Date(e.fechaVencimiento).getDate()!=fechaBase.getDate())validador=2
    //         count++
    //       }

    //     });
    //   }

    //   if(validador==2)
    //   {
    //     this._SnackBarServiceService.openSnackBar(
    //       "Lo sentimos, no puedes afiliarte al pago Recurrente, no todas las cuotas pendientes se pagan el mismo día de afiliación",
    //       'x',
    //       10,
    //       "snackbarCrucigramaerror");
    //   }
    //   else if(validador==1)
    //   {
    //     this._SnackBarServiceService.openSnackBar(
    //       "Lo sentimos, no puedes afiliarte al pago Recurrente, no todas las cuotas pendientes tiene el mismo monto",
    //       'x',
    //       10,
    //       "snackbarCrucigramaerror");
    //   }
    //   else if(validador==0)
    //   {
    //     const dialogRef = this.dialog.open(PagoTarjetaComponent, {

    //       width: '600px',
    //       data: { idMatricula: this.idMatricula,tituloBotonModal:'Ir a afiliarse',tipo:"AF"},
    //       panelClass: 'dialog-Tarjeta',
    //      disableClose:true
    //     });

    //     dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
    //       console.log("Suscripcion",result);
    //       if(result!=undefined){
    //         this.jsonSend.ListaCuota=[]
    //         this.PreProcesoAfiliacionPagoRecurrente(result);
    //       }
    //     });
    //   }
  }
  // PreProcesoAfiliacionPagoRecurrente(tarjeta:any){
  //   this.CronogramaPago.registroCuota.forEach((r:any) => {
  //     if(r.cancelado==false){
  //       var fecha=new Date(r.fechaVencimiento);
  //       this.jsonSend.ListaCuota.push({
  //         IdCuota: r.idCuota,
  //         NroCuota: r.nroCuota,
  //         TipoCuota: r.tipoCuota,
  //         Cuota: r.cuota,
  //         Mora: r.mora,
  //         MoraCalculada: r.moraCalculada,
  //         CuotaTotal: r.cuota+r.moraCalculada,
  //         FechaVencimiento:r.fechaVencimiento,
  //         Nombre:'Cuota N°'+r.nroCuota+' - '+ ('0' + fecha.getUTCDate()).slice(-2)+ "/" +("0" + (fecha.getUTCMonth()+1)).slice(-2) + "/" +fecha.getUTCFullYear()
  //       })
  //     }
  //   });
  //   this.jsonSend.IdFormaPago=tarjeta.idFormaPago
  //   this.jsonSend.IdPasarelaPago=tarjeta.idPasarelaPago
  //   this.jsonSend.MedioCodigo=tarjeta.medioCodigo
  //   this.jsonSend.MedioPago=tarjeta.medioPago
  //     const dialogRef =this.dialog.open(ChargeComponent,{
  //       panelClass:'dialog-charge',
  //       disableClose:true
  //     });
  //     this._FormaPagoService.PreProcesoAfiliacionAlumno(this.jsonSend).pipe(takeUntil(this.signal$)).subscribe({
  //       next:x=>{
  //         console.log(x)
  //         dialogRef.close();
  //         var sesion=x._Repuesta.identificadorTransaccion;
  //         this._SessionStorageService.SessionSetValue(sesion,x._Repuesta.requiereDatosTarjeta);
  //         console.log(parseInt(tarjeta.idPasarelaPago))

  //         if(tarjeta.idPasarelaPago==5 || tarjeta.idPasarelaPago==16 || tarjeta.idPasarelaPago==18){ //OpenPay
  //           this._router.navigate(['/AulaVirtual/MisPagos/Afiliacion/'+this.idMatricula+'/openpay/'+sesion]);
  //         }
  //         else if(tarjeta.idPasarelaPago==7){ //visa
  //           if(tarjeta.idFormaPago==52){
  //             this._router.navigate(['/AulaVirtual/MisPagos/Afiliacion/'+this.idMatricula+'/visa/'+sesion]);
  //           }
  //         }
  //         else if(tarjeta.idPasarelaPago==13){ //IziPay
  //             this._router.navigate(['/AulaVirtual/MisPagos/Afiliacion/'+this.idMatricula+'/izipay/'+sesion]);
  //         }
  //       },
  //       complete:()=>{
  //         dialogRef.close();
  //       },
  //       error:e=>{
  //         console.log(e)
  //         dialogRef.close();
  //       }
  //     })

  // }
}
