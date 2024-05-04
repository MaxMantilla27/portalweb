import { DOCUMENT } from '@angular/common';
import { stringify } from '@angular/compiler/src/util';
import { Component, Inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroProcesoPagoAlumnoDTO, RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { environment } from 'src/environments/environment';

declare var payform:any;
declare var VisanetCheckout:any;
@Component({
  selector: 'app-confirmacion-pago-tarjeta-visa',
  templateUrl: './confirmacion-pago-tarjeta-visa.component.html',
  styleUrls: ['./confirmacion-pago-tarjeta-visa.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmacionPagoTarjetaVisaComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _router:Router
  ) {}
  public urlBase=environment.url_portal;
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public idMatricula=0
  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:true
  }
  public resultVisa:any
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

  public DataComprobante:any=
  {
    idComprobante:'',
    nroDoc:'',
    razonSocial:'',
    listaCuota:''
  }
  public intervcal:any
  private kryptonScriptLoaded: boolean = false;
  ngOnInit(): void {
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.idMatricula = parseInt(x['IdMatricula']);
        this.json.IdentificadorTransaccion = x['Identificador'];
        var r= this._SessionStorageService.SessionGetValue(this.json.IdentificadorTransaccion);
        if(r!=''){
          this.json.RequiereDatosTarjeta=r=='false'?false:true;
          //this._SessionStorageService.SessionDeleteValue(this.json.IdentificadorTransaccion);
        }

        this.url+=this.json.IdentificadorTransaccion
        this.ObtenerPreProcesoPagoCuotaAlumno()
      },
    });
  }
  ObtenerPreProcesoPagoCuotaAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log("VISAs",x)
        this.resultVisa=x._Repuesta;
        this.DataComprobante.listaCuota = x._Repuesta.listaCuota
        if(this.resultVisa.estadoOperacion.toLowerCase()!='sent'){
          this._router.navigate(['/AulaVirtual/MisCursos/'+this.idMatricula])
        }
        this.resultVisa.total=0;
        this.resultVisa.listaCuota.forEach((l:any) => {
          this.resultVisa.total+=l.cuotaTotal
        });


        this.jsonSave.IdentificadorTransaccion=this.json.IdentificadorTransaccion
        this.jsonSave.MedioCodigo=this.resultVisa.medioCodigo
        this.jsonSave.MedioPago=this.resultVisa.medioPago
        this.jsonSave.RequiereDatosTarjeta=this.json.RequiereDatosTarjeta
        this.jsonSave.TransactionToken=this.resultVisa.procesoPagoBotonVisa.transactionToken

        //this._SessionStorageService.SessionSetValue('datos',JSON.stringify(this.jsonSave));
        this.addVisa()
        this.intervcal=setTimeout(() => {
          var buttons=this._document.getElementById('visa')?.getElementsByTagName('button')
          console.log(buttons)
          if(buttons !=undefined && buttons?.length>0){
            clearTimeout(this.intervcal)
          }else{
            window.location.reload()
          }
        }, 5000);
        //this.SetConfiguration()
      }
    })
  }

  addVisa(){
    this.kryptonScriptLoaded=false;
    if (!this.kryptonScriptLoaded) {
      let script = this._renderer2.createElement('script');
      script.src='https://static-content.vnforapps.com/v2/js/checkout.js'
      script.setAttribute('data-sessiontoken',this.resultVisa.procesoPagoBotonVisa.sessionKey)
      script.setAttribute('data-channel','web')
      script.setAttribute('data-merchantid',this.resultVisa.procesoPagoBotonVisa.merchanId)
      script.setAttribute('data-buttonsize','DEFAULT')
      script.setAttribute('data-merchantlogo','https://img.bsginstitute.com/repositorioweb/img/logobsg-visa.svg')
      script.setAttribute('data-formbuttoncolor','#eea236')
      script.setAttribute('data-merchantname','BSG Institute')
      script.setAttribute('data-purchasenumber',this.resultVisa.procesoPagoBotonVisa.orderVisa.purchaseNumber)
      script.setAttribute('data-amount',parseFloat(this.resultVisa.procesoPagoBotonVisa.amount+'.00'))
      script.setAttribute('data-expirationminutes','5')
      script.setAttribute('data-timeouturl',this.urlBase+'/AulaVirtual/MisPagos/'+this.idMatricula)

      this._renderer2.appendChild(this._document.getElementById('visa'), script);
      this.kryptonScriptLoaded=true;
    }

  }
  addvisa2(){
    VisanetCheckout.configure({
      sessiontoken:this.resultVisa.procesoPagoBotonVisa.sessionKey,
      channel:'web',
      merchantid:this.resultVisa.procesoPagoBotonVisa.merchanId,
      purchasenumber:this.resultVisa.procesoPagoBotonVisa.orderVisa.purchaseNumber,
      amount:parseFloat(this.resultVisa.procesoPagoBotonVisa.amount+'.00'),
      expirationminutes:'5',
      timeouturl:this.urlBase+'/AulaVirtual/MisPagos',
      merchantlogo:'https://img.bsginstitute.com/repositorioweb/img/logobsg.svg',
      formbuttoncolor:'#eea236',
      action:'paginaRespuesta',
      complete: function(params:any) {
        console.log(params)
      }
    });
    VisanetCheckout.open();
  }

  // SetConfiguration(){
  //   console.log(this.resultVisa.procesoPagoBotonVisa)
  //   var elementStyles = {
  //     base: {
  //      color: '#666666',
  //      fontWeight: 700,
  //      fontFamily: "'Montserrat', sans-serif",
  //      fontSize: '16px',
  //      fontSmoothing: 'antialiased',
  //      placeholder: {
  //       color: '#999999',
  //      },
  //      autofill: {
  //       color: '#e39f48',
  //      },
  //     },
  //    invalid: {
  //     color: '#E25950',
  //     '::placeholder': {
  //      color: '#FFCCA5',
  //      },
  //     },
  //    };
  //   var cardNumber = payform.createElement('cardNumber', {
  //     style: elementStyles,
  //     placeholder: 'Nro. Tarjeta',
  //   }, 'txtNumeroTarjeta');

  //   var cardExpiry = payform.createElement('cardExpiry', {
  //     style: elementStyles,
  //     placeholder: 'Mes / Año',
  //   }, 'txtNumeroTarjeta');

  //   var cardCVV = payform.createElement('cardCVV', {
  //     style: elementStyles,
  //     placeholder: 'CVV2',
  //   }, 'txtCVV');

  //   var configuration = {
  //     callbackurl: 'paginaRespuesta',
  //     sessionkey:this.resultVisa.procesoPagoBotonVisa.sessionKey,
  //     channel: 'pasarela',
  //     merchantid: this.resultVisa.procesoPagoBotonVisa.merchanId,
  //     purchasenumber: this.resultVisa.procesoPagoBotonVisa.orderVisa.purchaseNumber,
  //     amount: parseFloat(this.resultVisa.procesoPagoBotonVisa.amount+'.00'),
  //     language: 'es',
  //     recurrencemaxamount: ''
  //    };
  //    payform.setConfiguration(configuration);
  //    payform.createToken([cardNumber, cardExpiry, cardCVV]).then(function (response:any) {
  //     console.log(response)
  //     }).catch(function (error:any) {
  //       console.log(error)
  //     });
  //    console.log(payform)
  // }
  // pay(){
  //   var data = {
  //     name: 'Juan',
  //     lastName: 'Perez',
  //     email: 'jperez@test.com'
  //     };
  //  /* Caso de uso: Controles independientes */
  //  payform.createToken(['4551708161768059','03/2028','111'], data).then(function(response:any){
  //       console.log(response)
  //     }).catch(function(){
  //     /* Tú código aquí */
  //     });
  // }
  pagar(){
    this.DataComprobante.idComprobante=this.jsonSave.Comprobante==false?2:1
    this.DataComprobante.nroDoc =this.jsonSave.Comprobante==false? this.resultVisa.registroAlumno.numeroDocumento :this.jsonSave.CodigoTributario
    this.DataComprobante.razonSocial = this.jsonSave.RazonSocial
    this._SessionStorageService.SessionSetValue('comprobante',JSON.stringify(this.DataComprobante));

  }


}
