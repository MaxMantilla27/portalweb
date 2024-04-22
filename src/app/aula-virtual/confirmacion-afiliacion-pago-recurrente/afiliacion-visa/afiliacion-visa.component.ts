import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroProcesoPagoAlumnoDTO, RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { ChargeTextComponent } from 'src/app/Core/Shared/Containers/Dialog/charge-text/charge-text.component';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
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
    private dialog:MatDialog
  ) {}
  public urlBase=environment.url_portal;
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public dialogRef:any
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
    listaCuot:''
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
        console.log("RESPUESTAVISA _:",x._Repuesta)
        this.resultVisa=x._Repuesta;
        this.DataComprobante.listaCuota = x._Repuesta.listaCuota
        if(this.resultVisa.estadoOperacion.toLowerCase()!='sent'){
          this._router.navigate(['/AulaVirtual/MisCursos/'+this.idMatricula])
        }
        this.resultVisa.total=0;
        let count=0
        this.resultVisa.listaCuota.forEach((l:any) => {
          if(count==0){
            this.resultVisa.total+=l.cuotaTotal
          }
          count++
        });
        this.jsonSave.IdentificadorTransaccion=this.json.IdentificadorTransaccion
        this.jsonSave.MedioCodigo=this.resultVisa.medioCodigo
        this.jsonSave.MedioPago=this.resultVisa.medioPago
        this.jsonSave.RequiereDatosTarjeta=this.json.RequiereDatosTarjeta
        this.jsonSave.TransactionToken=this.resultVisa.procesoPagoBotonVisa.transactionToken

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
    this.DataComprobante.nroDoc = this.jsonSave.Comprobante==false? this.resultVisa.registroAlumno.numeroDocumento :this.jsonSave.CodigoTributario
    this.DataComprobante.razonSocial = this.jsonSave.RazonSocial
    this._SessionStorageService.SessionSetValue('comprobante',JSON.stringify(this.DataComprobante));

    let action = 'https://proceso-pago.bsginstitute.com/ProcesoPagoVisa/Recurrente?IdTransaccion='+this.json.IdentificadorTransaccion
    //let action = 'https://localhost:44373/ProcesoPagoVisa/Recurrente?IdTransaccion='+this.json.IdentificadorTransaccion
    let timeouturl = this.urlBase+'AulaVirtual/MisPagos/'+this.idMatricula
    let logo = 'https://img.bsginstitute.com/repositorioweb/img/logobsg-visa.svg'
    let scriptHeader2 = this._renderer2.createElement('script');
    scriptHeader2.type="text/javascript"
    scriptHeader2.text = `
    function checkout() {
      VisanetCheckout.configure({
       action:"`+action+`",
       sessiontoken:"`+this.resultVisa.procesoPagoBotonVisa.sessionKey+`",
       channel: 'paycard',
       merchantid: "`+this.resultVisa.procesoPagoBotonVisa.merchanId+`",
       purchasenumber: "`+this.resultVisa.procesoPagoBotonVisa.orderVisa.purchaseNumber+`",
       amount: "`+parseFloat(this.resultVisa.procesoPagoBotonVisa.amount+'.00')+`",
       cardholdername: "`+this.resultVisa.registroAlumno.nombre+`",
       cardholderlastname: "`+this.resultVisa.registroAlumno.apellido+`",
       cardholderemail:"`+this.resultVisa.registroAlumno.correo+`",
       usertoken: "`+this.resultVisa.registroAlumno.idAlumno+`",
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
  pagar(){}

}
