import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { MedioPagoActivoPasarelaService } from 'src/app/Core/Shared/Services/MedioPagoActivoPasarela/medio-pago-activo-pasarela.service';
import { ImagenTarjetas } from 'src/app/Core/Shared/ImagenTarjetas';

@Component({
  selector: 'app-detalle-pago-peru-izipay',
  templateUrl: './detalle-pago-peru-izipay.component.html',
  styleUrls: ['./detalle-pago-peru-izipay.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetallePagoPeruIzipayComponent
  implements OnInit, OnDestroy
{
  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private _ActivatedRoute: ActivatedRoute,
    private _FormaPagoService: FormaPagoService,
    private _SessionStorageService: SessionStorageService,
    private _router: Router,
    private _MedioPagoActivoPasarelaService: MedioPagoActivoPasarelaService,
    private _t: ImagenTarjetas
  ) {

  }

  private kryptonScriptLoaded: boolean = false;

  private signal$ = new Subject();
  hidenBotom = true;
  public intervcal: any;
  public dialogRef: any;
  public idMatricula = 0;
  public json: RegistroRespuestaPreProcesoPagoDTO = {
    IdentificadorTransaccion: '',
    RequiereDatosTarjeta: false,
  };
  public resultPreProceso: any;
  public url = '/AulaVirtual/PagoExitoso/';
  public urlBase = environment.url_portal;
  public urlProcesoPago = environment.url_portalv3;
  public CompletamenteCargado = false;
  public DataComprobante: any = {};
  public IdPasarelaPago = 0;
  public tarjetas: any;
  public IdMatriculaCabecera = 0;


  ngAfterViewChecked(): void {
    if (!this.CompletamenteCargado) {
      const headerElement = this._document.getElementById('header');
      console.log('HEADER', headerElement);
      const bodyElement = this._document.getElementById('FormBody');
      console.log('BODY', headerElement);

      if (headerElement && bodyElement) {
        this.CompletamenteCargado = true;
        this.iniciarScripsIzipay();
      }
    }
  }
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  ngOnInit(): void {
    /*Evalua usar solo en Ngonit*/
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (params) => {
        this.IdMatriculaCabecera = +params['idmatricula'];
        this.IdPasarelaPago = +params['idpasarelapago'];
        this.json.IdentificadorTransaccion = params['identificador'];
        this.json.RequiereDatosTarjeta =
          this._SessionStorageService.SessionGetValue(
            this.json.IdentificadorTransaccion
          ) !== 'false';

        this.url += this.json.IdentificadorTransaccion;
        this.ObtenerPreProcesoPagoCuotaAlumno();
        this.ObtenerTarjetasMedioPago();
      },
    });
  }
  ObtenerPreProcesoPagoCuotaAlumno() {
    this._FormaPagoService
      .ObtenerPreProcesoPagoCuotaAlumno(this.json)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.resultPreProceso = x._Repuesta;
          this.resultPreProceso.total = 0;
          if (this.resultPreProceso.listaCuota != undefined) {
            this.resultPreProceso.listaCuota.forEach((l: any) => {
              this.resultPreProceso.total += l.cuotaTotal;
            });
          } else {
            this.resultPreProceso.total = this.resultPreProceso.montoTotal;
          }
        },
        complete: () => {},
      });
  }
  iniciarScripsIzipay() {
    console.log(this.resultPreProceso);
    this.kryptonScriptLoaded = false;
    if (!this.kryptonScriptLoaded) {
      let script1 = this._renderer2.createElement('script');
      script1.src =
        'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js';
      script1.setAttribute(
        'kr-public-key',
        this.resultPreProceso.procesoPagoBotonIziPay.publicKey
      );
      script1.setAttribute(
        'kr-post-url-success', this.urlProcesoPago+
          'ProcesoPagoIziPay/Cronograma?IdTransaccion=' +
          this.json.IdentificadorTransaccion
      );
      script1.setAttribute(
        'kr-post-url-refused', this.urlProcesoPago+
          'ProcesoPagoIziPay/Cronograma?IdTransaccion=' +
          this.json.IdentificadorTransaccion
      );
      script1.setAttribute('kr-language', 'es-ES');
      this._renderer2.appendChild(
        this._document.getElementById('header'),
        script1
      );

      let script2 = this._renderer2.createElement('script');
      script2.src =
        'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic.js';
      this._renderer2.appendChild(
        this._document.getElementById('header'),
        script2
      );

      // Marcar el script como cargado
      this.kryptonScriptLoaded = true;
    }

    let divForm = this._renderer2.createElement('div');
    divForm = this._document.getElementById('FormBody');
    divForm.setAttribute(
      'kr-form-token',
      this.resultPreProceso.procesoPagoBotonIziPay.formToken
    );
    this.intervcal = setInterval(() => {
      var data = document.getElementsByClassName('kr-popin-button');
      if (data != undefined && data?.length > 0) {
        this.customForm();
        clearInterval(this.intervcal);
      }
      else{
      window.location.reload()
      }
    }, 500);
  }
  customForm() {
    var boton = document.getElementsByClassName('kr-popin-button');
    if (typeof boton != 'undefined' && boton != null && boton.length > 0)
      boton[0].setAttribute(
        'style',
        'background-color: #F8893F;color: white;padding: 0 6px 0 6px;margin: 0px;min-width: 88px;border-radius: 3px;font-size: 14px;' +
          'text-align: center;text-transform: uppercase;text-decoration:none;border: none;outline: none;box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);&:hover {background-color: #b26a3b}'
      );

    var botonPago = document.getElementsByClassName('kr-payment-button');
    if (
      typeof botonPago != 'undefined' &&
      botonPago != null &&
      botonPago.length > 0
    )
      botonPago[0].setAttribute(
        'style',
        'background-color: #F8893F;padding: 0 6px 0 6px;margin: 6px 8px 6px 8px;min-width: 88px;border-radius: 3px;font-size: 14px;' +
          'text-align: center;text-transform: uppercase;text-decoration:none;border: none;outline: none;box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);&:hover {background-color: #b26a3b}'
      );

    var logo = document.getElementsByClassName('kr-header-logo');
    if (typeof logo != 'undefined' && logo != null && logo.length > 0)
      logo[1].setAttribute(
        'src',
        '../../../../../assets/imagenes/logo-bsg.png'
      );
    // logo[1].setAttribute("src","https://img.bsginstitute.com/repositorioweb/img/logobsg-visa.svg");

    var spanNombre = document.getElementsByClassName('kr-popin-shop-name');
    if (
      typeof spanNombre != 'undefined' &&
      spanNombre != null &&
      spanNombre.length > 0
    )
      spanNombre[0].className = '';

    var modalHeader = document.getElementsByClassName('kr-popin-modal-header');
    if (
      typeof modalHeader != 'undefined' &&
      modalHeader != null &&
      modalHeader.length > 0
    )
      modalHeader[0].setAttribute('style', 'margin-bottom: 0px;height: 70px;');
    var modalWeapper = document.getElementsByClassName('kr-popin-wrapper');
    if (
      typeof modalWeapper != 'undefined' &&
      modalWeapper != null &&
      modalWeapper.length > 0
    )
      modalWeapper[0].setAttribute('style', 'padding-top: 5rem;');
    this.hidenBotom = false;
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
