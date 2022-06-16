import { DOCUMENT } from '@angular/common';
import { stringify } from '@angular/compiler/src/util';
import { Component, Inject, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroProcesoPagoAlumnoDTO, RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-confirmacion-pago-tarjeta-visa',
  templateUrl: './confirmacion-pago-tarjeta-visa.component.html',
  styleUrls: ['./confirmacion-pago-tarjeta-visa.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmacionPagoTarjetaVisaComponent implements OnInit {
  private signal$ = new Subject();
  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService
  ) {}
  public urlBase=environment.url_portal;
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
    TarjetaHabiente:{
      Aniho:'',
      CodigoVV:'',
      Mes:'',
      NumeroDocumento:'',
      NumeroTarjeta:'',
      Titular:'',
    },
  }
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
        console.log(x)
        this.resultVisa=x._Repuesta;
        this.resultVisa.total=0;
        this.resultVisa.listaCuota.forEach((l:any) => {
          this.resultVisa.total+=l.cuotaTotal
        });


        this.jsonSave.IdentificadorTransaccion=this.json.IdentificadorTransaccion
        this.jsonSave.MedioCodigo=this.resultVisa.medioCodigo
        this.jsonSave.MedioPago=this.resultVisa.medioPago
        this.jsonSave.RequiereDatosTarjeta=this.json.RequiereDatosTarjeta
        this.jsonSave.TransactionToken=this.resultVisa.procesoPagoBotonVisa.transactionToken

        this._SessionStorageService.SessionSetValue('datos',JSON.stringify(this.jsonSave));
        this.addVisa()
      }
    })
  }
  addVisa(){

    let script = this._renderer2.createElement('script');
    script.src='https://static-content.vnforapps.com/v2/js/checkout.js'
    script.setAttribute('data-sessiontoken',this.resultVisa.procesoPagoBotonVisa.sessionKey)
    script.setAttribute('data-channel','web')
    script.setAttribute('data-merchantid',this.resultVisa.procesoPagoBotonVisa.merchanId)
    script.setAttribute('data-buttonsize','DEFAULT')
    script.setAttribute('data-merchantlogo','https://img.bsginstitute.com/repositorioweb/img/logobsg.svg')
    script.setAttribute('data-formbuttoncolor','#eea236')
    script.setAttribute('data-merchantname','BSG Institute')
    script.setAttribute('data-purchasenumber',this.resultVisa.procesoPagoBotonVisa.orderVisa.purchaseNumber)
    script.setAttribute('data-amount',parseFloat(this.resultVisa.procesoPagoBotonVisa.amount+'.00'))
    script.setAttribute('data-expirationminutes','5')
    script.setAttribute('data-timeouturl',this.urlBase+'/AulaVirtual/MisPagos')
    this._renderer2.appendChild(this._document.getElementById('visa'), script);
  }
  pagar(){
    console.log('asdasdasd')
  }
}
