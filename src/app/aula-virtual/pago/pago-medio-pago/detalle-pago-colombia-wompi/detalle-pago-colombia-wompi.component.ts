import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroRespuestaPreProcesoPagoDTO, RegistroProcesoPagoAlumnoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { ImagenTarjetas } from 'src/app/Core/Shared/ImagenTarjetas';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { MedioPagoActivoPasarelaService } from 'src/app/Core/Shared/Services/MedioPagoActivoPasarela/medio-pago-activo-pasarela.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-detalle-pago-colombia-wompi',
  templateUrl: './detalle-pago-colombia-wompi.component.html',
  styleUrls: ['./detalle-pago-colombia-wompi.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetallePagoColombiaWompiComponent implements  OnInit,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _router: Router,
    private _MedioPagoActivoPasarelaService: MedioPagoActivoPasarelaService,
    private _t: ImagenTarjetas,
    private _HelperService: HelperService,

  ) { }
  public urlBase=environment.url_portal;
  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:true
  }
  public resultPreProceso:any
  public IdMatriculaCabecera=0
  public url='/AulaVirtual/PagoExitoso/'
  public jsonSave:RegistroProcesoPagoAlumnoDTO={
    IdentificadorTransaccion:'',
    MedioCodigo:'',
    MedioPago:'',
    RequiereDatosTarjeta:true,
    TransactionToken:'',
    Estado:null,
    Comprobante:false,
    CodigoTributario:'',
    RazonSocial:'',
    IdPasarelaPago:0,
    PagoPSE:false,
    TarjetaHabiente:{
      Aniho:'',
      CodigoVV:'',
      Mes:'',
      NumeroDocumento:'',
      NumeroTarjeta:'',
      Titular:'',
      fecha:'',
    },
  }
  public DatosFacturacion: any = {};
  public IdPasarelaPago = 0;
  public tarjetas: any;
  public CompletamenteCargado = false;

  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngAfterViewChecked(): void {
    if (!this.CompletamenteCargado) {
      const headerElement = this._document.getElementById('wompi');
      if (headerElement) {
        this.CompletamenteCargado = true;
        this.addWompi();
      }
    }
  }
  ngOnInit(): void {
    setTimeout(() => {
      document.documentElement.scrollTop=0;
    }, 1000);
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
    var localDatosFacturacion = this._SessionStorageService.SessionGetValue('DatosFacturacionPagos');
    console.log(localDatosFacturacion)
    if(localDatosFacturacion!=''){
      this.DatosFacturacion = JSON.parse(localDatosFacturacion);
      this.jsonSave.Comprobante = this.DatosFacturacion.Comprobante;
      this.jsonSave.CodigoTributario = this.DatosFacturacion.CodigoTributario;
      this.jsonSave.RazonSocial = this.DatosFacturacion.RazonSocial;
    }
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.jsonSave.TarjetaHabiente.Titular =x.datosAlumno.nombres+' '+x.datosAlumno.apellidos;
      this.jsonSave.TarjetaHabiente.NumeroDocumento =x.datosAlumno.dni;
    });
  }
  ObtenerPreProcesoPagoCuotaAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.resultPreProceso=x._Repuesta;
        if(this.resultPreProceso.estadoOperacion.toLowerCase()!='sent'){
          this._router.navigate(['/AulaVirtual/MisCursos/'+this.IdMatriculaCabecera])
        }
        this.resultPreProceso.total=0;
        if (this.resultPreProceso.listaCuota != undefined) {
          this.resultPreProceso.listaCuota.forEach((l: any) => {
            this.resultPreProceso.total += l.cuotaTotal;
          });
        } else {
          this.resultPreProceso.total = this.resultPreProceso.montoTotal;
        }
        this.jsonSave.IdentificadorTransaccion=this.json.IdentificadorTransaccion
        this.jsonSave.MedioCodigo=this.resultPreProceso.medioCodigo
        this.jsonSave.MedioPago=this.resultPreProceso.medioPago
        this.jsonSave.RequiereDatosTarjeta=this.json.RequiereDatosTarjeta
        this.jsonSave.TransactionToken=this.json.IdentificadorTransaccion
        this.jsonSave.IdPasarelaPago=this.resultPreProceso.idPasarelaPago
        this._SessionStorageService.SessionSetValue('datosWompi',JSON.stringify(this.jsonSave));
      }
    })
  }
  addWompi(){

    let script = this._renderer2.createElement('script');
    script.src='https://checkout.wompi.co/widget.js'
    script.setAttribute('data-render','button')
    script.setAttribute('data-public-key','pub_prod_DM8suO85aqiUndaaZVIeQAErQehwf7xE')
    script.setAttribute('data-currency','COP');
    script.setAttribute('data-amount-in-cents',Math.floor(this.resultPreProceso.montoTotal*100))
    script.setAttribute('data-reference',this.json.IdentificadorTransaccion)
    script.setAttribute('data-redirect-url',this.urlBase+'AulaVirtual/PagoExitoso/'+this.json.IdentificadorTransaccion)

    this._renderer2.appendChild(this._document.getElementById('wompi'), script);
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
