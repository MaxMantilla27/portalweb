import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-afiliacion-izipay',
  templateUrl: './afiliacion-izipay.component.html',
  styleUrls: ['./afiliacion-izipay.component.scss']
})
export class AfiliacionIzipayComponent implements OnInit, OnDestroy, AfterViewInit
{
  private signal$ = new Subject();
  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private _ActivatedRoute: ActivatedRoute,
    private _FormaPagoService: FormaPagoService,
    private _SessionStorageService: SessionStorageService,
    private _router: Router
  ) {}
  ngAfterViewInit(): void {
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.idMatricula = parseInt(x['IdMatricula']);
        this.json.IdentificadorTransaccion = x['Identificador'];
        var r = this._SessionStorageService.SessionGetValue(
          this.json.IdentificadorTransaccion
        );
        if (r != '') {
          this.json.RequiereDatosTarjeta = r == 'false' ? false : true;
        }
        this.ObtenerPreProcesoPagoCuotaAlumno();
      },
    });
  }
  public dialogRef: any;
  public idMatricula = 0;
  public json: RegistroRespuestaPreProcesoPagoDTO = {
    IdentificadorTransaccion: '',
    RequiereDatosTarjeta: false,
  };
  public resultPreValidacion: any;

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  ngOnInit(): void {
  }
  ObtenerPreProcesoPagoCuotaAlumno() {
    this._FormaPagoService
      .ObtenerPreProcesoPagoCuotaAlumno(this.json)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.resultPreValidacion = x._Repuesta;
          this.resultPreValidacion.total=0;
          this.resultPreValidacion.listaCuota.forEach((l:any) => {
            this.resultPreValidacion.total+=l.cuotaTotal
          });
          this.iniciarScripsIzipay();
          // KR.setFormConfig(config);
        },
      });
  }

  iniciarScripsIzipay() {
    let script1 = this._renderer2.createElement('script');
    script1.src =
      'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js';
    script1.setAttribute(
      'kr-public-key',
      this.resultPreValidacion.procesoPagoBotonIziPay.publicKey
    );
    script1.setAttribute('kr-post-url-success', 
    'https://proceso-pago.bsginstitute.com/ProcesoPagoIziPay/Recurrente?IdTransaccion='+this.json.IdentificadorTransaccion);
    script1.setAttribute('kr-post-url-refused', 
    'https://proceso-pago.bsginstitute.com/ProcesoPagoIziPay/Recurrente?IdTransaccion='+this.json.IdentificadorTransaccion);
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

    let divForm = this._renderer2.createElement('div');
    divForm = this._document.getElementById('FormBody');
    divForm.setAttribute(
      'kr-form-token',
      this.resultPreValidacion.procesoPagoBotonIziPay.formToken
    );
  }
}
