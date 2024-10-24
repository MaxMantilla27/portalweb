import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
  AfterViewChecked,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import {
  RegistroProcesoPagoAlumnoDTO,
  RegistroRespuestaPreProcesoPagoDTO,
} from 'src/app/Core/Models/ProcesoPagoDTO';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { environment } from 'src/environments/environment';
import { MedioPagoActivoPasarelaService } from 'src/app/Core/Shared/Services/MedioPagoActivoPasarela/medio-pago-activo-pasarela.service';
import { ImagenTarjetas } from 'src/app/Core/Shared/ImagenTarjetas';

@Component({
  selector: 'app-detalle-pago-internacional-niubiz',
  templateUrl: './detalle-pago-internacional-niubiz.component.html',
  styleUrls: ['./detalle-pago-internacional-niubiz.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetallePagoInternacionalNiubizComponent implements OnInit, OnDestroy, AfterViewChecked {
  private signal$ = new Subject<void>();
  public resultNiubiz: any;
  public jsonSave: RegistroProcesoPagoAlumnoDTO = this.inicializarJsonSave();
  public dialogRef: any;
  public IdMatriculaCabecera = 0;
  public json: RegistroRespuestaPreProcesoPagoDTO = {
    IdentificadorTransaccion: '',
    RequiereDatosTarjeta: true,
  };
  public url = '/AulaVirtual/PagoExitoso/';
  public urlBase = environment.url_portal;
  public urlProcesoPago = environment.url_portalv3;
  public kryptonScriptLoaded = false;
  public CompletamenteCargado = false;
  public DataComprobante: any = {};
  public IdPasarelaPago = 0;
  public tarjetas: any;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _FormaPagoService: FormaPagoService,
    private _SessionStorageService: SessionStorageService,
    private _router: Router,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private _MedioPagoActivoPasarelaService: MedioPagoActivoPasarelaService,
    private _t: ImagenTarjetas,
  ) {}

  ngOnInit(): void {
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (params) => {
        this.IdMatriculaCabecera = +params['idmatricula'];
        this.IdPasarelaPago = +params['idpasarelapago'];
        this.json.IdentificadorTransaccion = params['identificador'];
        this.json.RequiereDatosTarjeta = this._SessionStorageService.SessionGetValue(this.json.IdentificadorTransaccion) !== 'false';

        this.url += this.json.IdentificadorTransaccion;
        this.ObtenerPreProcesoPagoCuotaAlumno();
        this.ObtenerTarjetasMedioPago();
      },
    });
  }

  ngAfterViewChecked(): void {
    if (!this.CompletamenteCargado) {
      const visaElement = this._document.getElementById('visa');
      if (visaElement) {
        this.CompletamenteCargado = true;
        this.loadVisanetCheckoutScript();
      }
    }
  }

  ngOnDestroy(): void {
    this.signal$.next();
    this.signal$.complete();
    const visaScript = this._document.getElementById('visa');
    if (visaScript) {
      this._renderer2.removeChild(this._document.body, visaScript);
    }
  }

  private inicializarJsonSave(): RegistroProcesoPagoAlumnoDTO {
    return {
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
  }

  ObtenerPreProcesoPagoCuotaAlumno(): void {
    this._FormaPagoService
      .ObtenerPreProcesoPagoCuotaAlumno(this.json)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (response) => {
          this.resultNiubiz = response._Repuesta;
          console.log(this.resultNiubiz);
          if (this.resultNiubiz.estadoOperacion.toLowerCase() !== 'sent') {
            this._router.navigate(['/AulaVirtual/MisCursos/', this.IdMatriculaCabecera]);
          }
          this.resultNiubiz.total=0;
          if(this.resultNiubiz.listaCuota!=undefined){
            this.resultNiubiz.listaCuota.forEach((l:any) => {
              this.resultNiubiz.total+=l.cuotaTotal
            });
          }
          else{
            this.resultNiubiz.total=this.resultNiubiz.montoTotal
          }
          this.actualizarJsonSave();
        },
      });
  }

  private actualizarJsonSave(): void {
    this.jsonSave = {
      ...this.jsonSave,
      IdentificadorTransaccion: this.json.IdentificadorTransaccion,
      MedioCodigo: this.resultNiubiz.medioCodigo,
      MedioPago: this.resultNiubiz.medioPago,
      RequiereDatosTarjeta: this.json.RequiereDatosTarjeta,
      TransactionToken: this.resultNiubiz.procesoPagoBotonVisa.transactionToken,
    };
  }

  loadVisanetCheckoutScript(): void {
    if (this.kryptonScriptLoaded) return;

    const script = this._renderer2.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://static-content.vnforapps.com/vToken/js/checkout.js';
    script.onload = () => {
      this.kryptonScriptLoaded = true;
      console.log('Script de Visa Checkout cargado con éxito.');
    };
    script.onerror = () => {
      console.error('Error al cargar el script de Visa Checkout.');
    };
    this._renderer2.appendChild(this._document.body, script);
  }

  openForm(): void {
    this.DataComprobante.idComprobante = this.jsonSave.Comprobante ? 1 : 2;
    this.DataComprobante.nroDoc = this.jsonSave.Comprobante
      ? this.jsonSave.CodigoTributario
      : this.resultNiubiz.registroAlumno.numeroDocumento;
    this.DataComprobante.razonSocial = this.jsonSave.Comprobante ? this.jsonSave.RazonSocial : '';

    this._SessionStorageService.SessionSetValue('comprobante', JSON.stringify(this.DataComprobante));

    if (!this.kryptonScriptLoaded || typeof VisanetCheckout === 'undefined' || typeof VisanetCheckout.configure !== 'function') {
      console.error('El script o la configuración de Visa Checkout no están disponibles.');
      return;
    }

    try {
      VisanetCheckout.configure({
        sessiontoken: this.resultNiubiz.procesoPagoBotonVisa.sessionKey,
        channel: 'web',
        merchantid: this.resultNiubiz.procesoPagoBotonVisa.merchanId,
        purchasenumber: 'BSG Institute',
        amount: parseFloat(`${this.resultNiubiz.procesoPagoBotonVisa.amount}.00`),
        expirationminutes: '5',
        timeouturl: `${this.urlBase}/AulaVirtual/MisPagos/${this.IdMatriculaCabecera}`,
        merchantlogo: 'https://img.bsginstitute.com/repositorioweb/img/logobsg-visa.svg',
        formbuttoncolor: '#eea341',
        showamount: 'false',
        countable: false,
        cardholdername: `${this.resultNiubiz.registroAlumno.nombre}`,
        cardholderlastname: `${this.resultNiubiz.registroAlumno.apellido}`,
        cardholderemail: `${this.resultNiubiz.registroAlumno.correo}`,
        usertoken: `${this.resultNiubiz.registroAlumno.idAlumno}`,
        action: `${this.urlProcesoPago}ProcesoPagoVisa/Index?IdTransaccion=${this.json.IdentificadorTransaccion}`,
        complete: (params: any) => {
          console.log(params);
          alert(JSON.stringify(params));
        },
      });
      VisanetCheckout.open();
    } catch (error) {
      console.error('Error al abrir el formulario de Visa Checkout:', error);
    }
  }

  RegresarPasarela(): void {
    this._router.navigate(['/AulaVirtual/MisPagos/', this.IdMatriculaCabecera, this.IdPasarelaPago]);
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
}

// Declaración de tipo para VisanetCheckout
declare var VisanetCheckout: any;
