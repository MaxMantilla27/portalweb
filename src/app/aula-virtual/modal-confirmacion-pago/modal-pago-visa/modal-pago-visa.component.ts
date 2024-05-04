import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroProcesoPagoAlumnoDTO, RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { environment } from 'src/environments/environment';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-pago-visa',
  templateUrl: './modal-pago-visa.component.html',
  styleUrls: ['./modal-pago-visa.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ModalPagoVisaComponent implements OnInit {
  private signal$ = new Subject();

  constructor(
    private _renderer2: Renderer2,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _router:Router,
    @Inject(DOCUMENT) private _document: Document,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalPagoVisaComponent>
  ) { }


  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:true
  }
  public resultVisa:any
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
  public urlBase=environment.url_portal;
  public idMatricula=0
  public DataComprobante:any=
  {
    idComprobante:'',
    nroDoc:'',
    razonSocial:'',
    listaCuota:''
  }
  public intervcal:any
  private kryptonScriptLoaded: boolean = false;
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  ngOnInit(): void {
    if (this.data.Identificador){
      this.idMatricula =  this.data.IdMatricula
      this.json.IdentificadorTransaccion=this.data.Identificador

      this.jsonSave.Comprobante = this.data.DatosFacturacion.Comprobante;
      this.jsonSave.CodigoTributario = this.data.DatosFacturacion.CodigoTributario;
      this.jsonSave.RazonSocial = this.data.DatosFacturacion.RazonSocial;

      var r= this._SessionStorageService.SessionGetValue(this.json.IdentificadorTransaccion);
      if (r!='') {
        this.json.RequiereDatosTarjeta=r=='false'?false:true;
      }
      this.ObtenerPreProcesoPagoCuotaAlumno();
    }
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
  pagar(){
    this.DataComprobante.idComprobante=this.jsonSave.Comprobante==false?2:1
    this.DataComprobante.nroDoc =this.jsonSave.Comprobante==false? this.resultVisa.registroAlumno.numeroDocumento :this.jsonSave.CodigoTributario
    this.DataComprobante.razonSocial = this.jsonSave.RazonSocial
    this._SessionStorageService.SessionSetValue('comprobante',JSON.stringify(this.DataComprobante));
  }
  cerraModal(){
    this.dialogRef.close(true);
    this.kryptonScriptLoaded=false;

  }
}
