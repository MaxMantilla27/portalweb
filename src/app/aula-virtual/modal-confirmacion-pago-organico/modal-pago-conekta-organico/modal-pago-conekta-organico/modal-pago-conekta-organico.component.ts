import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroRespuestaPreProcesoPagoDTO, RegistroProcesoPagoAlumnoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mozdal-pago-conekta-organico',
  templateUrl: './modal-pago-conekta-organico.component.html',
  styleUrls: ['./modal-pago-conekta-organico.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalPagoConektaOrganicoComponent implements OnInit {
  private signal$ = new Subject();

  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _router:Router,
    private dialogRef: MatDialogRef<ModalPagoConektaOrganicoComponent>,
  ) { }

  public urlBase=environment.url_portal;
  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:true
  }
  public idMatricula=0
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
    listaCuotas:''
  }
  public BotonCargado=false;

  ngAfterViewInit(): void {
    console.log('ORGANICO 1:',this.data)
    if (this.data.Identificador){
      this.idMatricula = this.data.IdMatricula;
      this.json.IdentificadorTransaccion = this.data.Identificador;
      this.jsonSave.Comprobante = this.data.DatosFacturacion.Comprobante;
      this.jsonSave.CodigoTributario = this.data.DatosFacturacion.CodigoTributario;
      this.jsonSave.RazonSocial = this.data.DatosFacturacion.RazonSocial;
      var r= this._SessionStorageService.SessionGetValue(this.json.IdentificadorTransaccion);
      if(r!=''){
        this.json.RequiereDatosTarjeta=r=='false'?false:true;
      }
      this.url+=this.json.IdentificadorTransaccion
      this.ObtenerPreProcesoPagoOrganicoAlumno()
    }

  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {

  }
  ObtenerPreProcesoPagoOrganicoAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoOrganicoAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log('ORGANICO 2:',x)
        this.resultVisa=x._Repuesta;
        if(this.resultVisa.registroAlumno==null){
          this.resultVisa.registroAlumno=this.resultVisa.datoAlumno
        }
        this.DataComprobante.listaCuota = x._Repuesta.listaCuota
        this.resultVisa.total=0;
        this.jsonSave.IdentificadorTransaccion=this.json.IdentificadorTransaccion
        this.jsonSave.MedioCodigo=this.resultVisa.medioCodigo
        this.jsonSave.MedioPago=this.resultVisa.medioPago
        this.jsonSave.RequiereDatosTarjeta=this.json.RequiereDatosTarjeta
        this.jsonSave.TransactionToken=this.json.IdentificadorTransaccion
        this.jsonSave.IdPasarelaPago=this.resultVisa.idPasarelaPago
        this._SessionStorageService.SessionSetValue('datosWompi',JSON.stringify(this.jsonSave));
      },
      complete:()=>{
        if(this.resultVisa.estadoOperacion.toLowerCase()!='sent'){
          this._router.navigate(['/AulaVirtual/MisCursos/'+this.idMatricula])
        }else{
          setTimeout(()=>{
            this.addConekta()
          },1000)
        }
      }
    })
  }
  addConekta(){
    this.BotonCargado=false
    let script = this._renderer2.createElement('script');
    script.type="text/javascript"
    script.text = `
          window.ConektaCheckoutComponents.Integration({
            targetIFrame: "#conektaIframeContainer",
            checkoutRequestId: "`+this.resultVisa.tokenComercio+`",
            publicKey: "key_d5pmwruxvzxDYmHZiBbEbbA",
            options: {},
            styles: {},
            onCreateTokenSucceeded: function(token) {
              console.log(token)
            },
            onCreateTokenError: function(error) {
              console.log(error)
            },
            onFinalizePayment: function (event) {
                console.log(event);
                location.href="`+this.pagar()+`";
            }
        })
    `;
    console.log('ORGANICO 3:',script)
    this._renderer2.appendChild(this._document.getElementById('conekta'), script);
    this.BotonCargado=true
  }
  pagar(){
    console.log('ORGANICO 4:',this.resultVisa)
    this.DataComprobante.idComprobante=this.jsonSave.Comprobante==false?2:1
    this.DataComprobante.nroDoc = this.jsonSave.Comprobante==false? this.resultVisa.datoAlumno.numeroDocumento :this.jsonSave.CodigoTributario
    this.DataComprobante.razonSocial = this.jsonSave.RazonSocial
    this._SessionStorageService.SessionSetValue('comprobante',JSON.stringify(this.DataComprobante));
    return this.urlBase+'/AulaVirtual/PagoExitoso/'+this.json.IdentificadorTransaccion
  }
  cerraModal(){
    this.dialogRef.close();
  }
}

