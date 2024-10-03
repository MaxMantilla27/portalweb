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

@Component({
  selector: 'app-pago-medio-pago-detalle',
  templateUrl: './pago-medio-pago-detalle.component.html',
  styleUrls: ['./pago-medio-pago-detalle.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PagoMedioPagoDetalleComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  private signal$ = new Subject();
  public resultNiubiz: any;
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
  public dialogRef: any;
  public idMatricula = 0;
  public json: RegistroRespuestaPreProcesoPagoDTO = {
    IdentificadorTransaccion: '',
    RequiereDatosTarjeta: true,
  };
  public url = '/AulaVirtual/PagoExitoso/';
  public urlBase = environment.url_portal;
  private kryptonScriptLoaded: boolean = false;
  public CompletamenteCargado: boolean = false; // Nueva variable
  public DataComprobante: any = {}; // Inicialización de DataComprobante

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _FormaPagoService: FormaPagoService,
    private _SessionStorageService: SessionStorageService,
    private _router: Router,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document
  ) {}

  ngOnInit(): void {
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.idMatricula = parseInt(x['idmatricula']);
        this.json.IdentificadorTransaccion = x['identificador'];
        const r = this._SessionStorageService.SessionGetValue(
          this.json.IdentificadorTransaccion
        );
        this.json.RequiereDatosTarjeta = r === 'false' ? false : true;

        this.url += this.json.IdentificadorTransaccion;
        this.ObtenerPreProcesoPagoCuotaAlumno();
      },
    });
  }

  ngAfterViewChecked(): void {
    if (!this.CompletamenteCargado) {
      const visaElement = this._document.getElementById('visa');
      if (visaElement) {
        this.CompletamenteCargado = true;
        this.loadVisanetCheckoutScript(); // Cargar el script de Visa Checkout
      }
    }
  }

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  ObtenerPreProcesoPagoCuotaAlumno() {
    this._FormaPagoService
      .ObtenerPreProcesoPagoCuotaAlumno(this.json)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.resultNiubiz = x._Repuesta;
          console.log(this.resultNiubiz)
          if (this.resultNiubiz.estadoOperacion.toLowerCase() !== 'sent') {
            this._router.navigate(['/AulaVirtual/MisCursos/' + this.idMatricula]);
          }
          this.resultNiubiz.total = 0;
          this.resultNiubiz.listaCuota.forEach((l: any, index: number) => {
            if (index === 0) {
              this.resultNiubiz.total += l.cuotaTotal;
            }
          });
          this.jsonSave = {
            ...this.jsonSave,
            IdentificadorTransaccion: this.json.IdentificadorTransaccion,
            MedioCodigo: this.resultNiubiz.medioCodigo,
            MedioPago: this.resultNiubiz.medioPago,
            RequiereDatosTarjeta: this.json.RequiereDatosTarjeta,
            TransactionToken: this.resultNiubiz.procesoPagoBotonVisa.transactionToken,
          };
        },
      });
  }

  loadVisanetCheckoutScript() {
    if (!this.kryptonScriptLoaded) {
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
  }

  openForm() {
    this.DataComprobante.idComprobante = this.jsonSave.Comprobante ? 1 : 2;
    this.DataComprobante.nroDoc = this.jsonSave.Comprobante
      ? this.jsonSave.CodigoTributario
      : this.resultNiubiz.registroAlumno.numeroDocumento;
    this.DataComprobante.razonSocial = this.jsonSave.Comprobante ? this.jsonSave.RazonSocial : '';

    this._SessionStorageService.SessionSetValue('comprobante', JSON.stringify(this.DataComprobante));
    if (!this.kryptonScriptLoaded) {
      console.error('El script de Visa Checkout no se ha cargado aún.');
      return;
    }

    if (typeof VisanetCheckout === 'undefined') {
      console.error('VisanetCheckout no está disponible. Asegúrate de que el script se haya cargado correctamente.');
      return;
    }

    // Verifica si la función configure existe
    if (typeof VisanetCheckout.configure !== 'function') {
      console.error('La función configure no está disponible en VisanetCheckout.');
      return;
    }

    try {
      VisanetCheckout.configure({
        sessiontoken: this.resultNiubiz.procesoPagoBotonVisa.sessionKey,
        channel: 'web',
        merchantid: this.resultNiubiz.procesoPagoBotonVisa.merchanId,
        purchasenumber: 'web',
        amount: parseFloat(this.resultNiubiz.procesoPagoBotonVisa.amount + '.00'),
        expirationminutes: '5',
        timeouturl: `${this.urlBase}/AulaVirtual/MisPagos/${this.idMatricula}`,
        merchantlogo: 'https://img.bsginstitute.com/repositorioweb/img/logobsg-visa.svg',
        formbuttoncolor: '#eea236',
        showamount: 'false',
        formbuttontext: "Continuar",
        action: 'https://localhost:44373/ProcesoPagoVisa/Index?IdTransaccion=' +
            this.json.IdentificadorTransaccion,
        cardholdername: `${this.resultNiubiz.registroAlumno.nombre}`,
        cardholderlastname: `${this.resultNiubiz.registroAlumno.apellido}`,
        cardholderemail:`${this.resultNiubiz.registroAlumno.correo}`,
        usertoken: `${this.resultNiubiz.registroAlumno.idAlumno}`,

        complete: (params:any) => {
          alert(JSON.stringify(params)); // Manejar la respuesta de Visa aquí
        },
      });
      VisanetCheckout.open(); // Abre el formulario de pago
    } catch (error) {
      console.error('Error al abrir el formulario de Visa Checkout:', error);
    }
  }

  FormatoMilesDecimales(num: number): string {
    const parts = Number(num).toFixed(2).split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1];
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return integerPart + '.' + decimalPart;
  }
}

// Declaración de tipo para VisanetCheckout
declare var VisanetCheckout: any;
