import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroProcesoPagoAlumnoDTO, RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { ChargeTextComponent } from 'src/app/Core/Shared/Containers/Dialog/charge-text/charge-text.component';
import { ImagenTarjetas } from 'src/app/Core/Shared/ImagenTarjetas';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { MedioPagoActivoPasarelaService } from 'src/app/Core/Shared/Services/MedioPagoActivoPasarela/medio-pago-activo-pasarela.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-afiliacion-visa',
  templateUrl: './afiliacion-visa.component.html',
  styleUrls: ['./afiliacion-visa.component.scss']
})
export class AfiliacionVisaComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _router:Router,
    private _HelperService:HelperService,
    private dialog:MatDialog,
    private _MedioPagoActivoPasarelaService: MedioPagoActivoPasarelaService,
    private _t: ImagenTarjetas,
  ) {}
  public urlBase=environment.url_portal;
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public dialogRef:any
  public IdMatriculaCabecera=0
  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:true
  }
  public resultNiubiz:any
  public url='/AulaVirtual/PagoExitoso/'
  public RutaProcesoPago=environment.url_portalv3
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
  public DataComprobante:any=
  {
    idComprobante:'',
    nroDoc:'',
    razonSocial:'',
    listaCuot:''
  }
  public tarjetas: any;
  ngOnInit(): void {
    setTimeout(() => {
      document.documentElement.scrollTop=0;
    }, 1000);
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.IdMatriculaCabecera = parseInt(x['IdMatricula']);
        this.json.IdentificadorTransaccion = x['Identificador'];
        var r= this._SessionStorageService.SessionGetValue(this.json.IdentificadorTransaccion);
        if(r!=''){
          this.json.RequiereDatosTarjeta=r=='false'?false:true;
          //this._SessionStorageService.SessionDeleteValue(this.json.IdentificadorTransaccion);
        }

        this.url+=this.json.IdentificadorTransaccion
        this.ObtenerPreProcesoPagoCuotaAlumno()
        this.ObtenerTarjetasMedioPago()
      },
    });
  }
  ObtenerPreProcesoPagoCuotaAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log("RESPUESTAVISA _:",x._Repuesta)
        this.resultNiubiz=x._Repuesta;
        this.DataComprobante.listaCuota = x._Repuesta.listaCuota
        if(this.resultNiubiz.estadoOperacion.toLowerCase()!='sent'){
          this._router.navigate(['/AulaVirtual/MisCursos/'+this.IdMatriculaCabecera])
        }
        this.resultNiubiz.total=0;
        let count=0
        this.resultNiubiz.listaCuota.forEach((l:any) => {
          if(count==0){
            this.resultNiubiz.total+=l.cuotaTotal
          }
          count++
        });
        this.jsonSave.IdentificadorTransaccion=this.json.IdentificadorTransaccion
        this.jsonSave.MedioCodigo=this.resultNiubiz.medioCodigo
        this.jsonSave.MedioPago=this.resultNiubiz.medioPago
        this.jsonSave.RequiereDatosTarjeta=this.json.RequiereDatosTarjeta
        this.jsonSave.TransactionToken=this.resultNiubiz.procesoPagoBotonVisa.transactionToken

        // let scriptHeader1 = this._renderer2.createElement('script');
        // scriptHeader1.type="text/javascript"
        // scriptHeader1.src='https://static-content-qas.vnforapps.com/vTokenSandbox/js/checkout.js'
        // this._renderer2.appendChild(this._document.getElementById('header'), scriptHeader1);
        let scriptHeader1 = this._renderer2.createElement('script');
        scriptHeader1.type="text/javascript"
        scriptHeader1.src='https://static-content.vnforapps.com/vToken/js/checkout.js'
        this._renderer2.appendChild(this._document.getElementById('header'), scriptHeader1);
      }
    })
  }

  addVisa(){
    this.DataComprobante.idComprobante=this.jsonSave.Comprobante==false?2:1
    this.DataComprobante.nroDoc = this.jsonSave.Comprobante==false? this.resultNiubiz.registroAlumno.numeroDocumento :this.jsonSave.CodigoTributario
    this.DataComprobante.razonSocial = this.jsonSave.RazonSocial
    this._SessionStorageService.SessionSetValue('comprobante',JSON.stringify(this.DataComprobante));

    let action = this.RutaProcesoPago+'ProcesoPagoVisa/Recurrente?IdTransaccion='+this.json.IdentificadorTransaccion
    let timeouturl = this.urlBase+'AulaVirtual/MisPagos/'+this.IdMatriculaCabecera
    let logo = 'https://img.bsginstitute.com/repositorioweb/img/logobsg-visa.svg'
    let scriptHeader2 = this._renderer2.createElement('script');
    scriptHeader2.type="text/javascript"
    scriptHeader2.text = `
    function checkout() {
      VisanetCheckout.configure({
       action:"`+action+`",
       sessiontoken:"`+this.resultNiubiz.procesoPagoBotonVisa.sessionKey+`",
       channel: 'paycard',
       merchantid: "`+this.resultNiubiz.procesoPagoBotonVisa.merchanId+`",
       purchasenumber: "`+this.resultNiubiz.procesoPagoBotonVisa.orderVisa.purchaseNumber+`",
       amount: "`+parseFloat(this.resultNiubiz.procesoPagoBotonVisa.amount+'.00')+`",
       cardholdername: "`+this.resultNiubiz.registroAlumno.nombre+`",
       cardholderlastname: "`+this.resultNiubiz.registroAlumno.apellido+`",
       cardholderemail:"`+this.resultNiubiz.registroAlumno.correo+`",
       usertoken: "`+this.resultNiubiz.registroAlumno.idAlumno+`",
       expirationminutes: "5",
       timeouturl: "`+timeouturl+`",
       merchantlogo:"`+logo+`",
       merchantname:"BSG Institute",
       formbuttoncolor: "#eea236",
       formbuttontext: "Continuar",
       complete: function(params) {
         alert(JSON.stringify(params));
        }
      });
        VisanetCheckout.open();
     }
    `;
    this._renderer2.appendChild(this._document.getElementById('header'), scriptHeader2);

    let scriptboton = this._renderer2.createElement('script');
    scriptboton.type="text/javascript"
    scriptboton.text = `
        checkout();
    `;

    this._renderer2.appendChild(this._document.getElementById('body'), scriptboton);

    //}
  }
  RegresarPasarela(): void {
    this._router.navigate(['/AulaVirtual/MisPagos/', this.IdMatriculaCabecera, 7]);
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
