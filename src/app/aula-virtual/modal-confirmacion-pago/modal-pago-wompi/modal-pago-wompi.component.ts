import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroRespuestaPreProcesoPagoDTO, RegistroProcesoPagoAlumnoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-pago-wompi',
  templateUrl: './modal-pago-wompi.component.html',
  styleUrls: ['./modal-pago-wompi.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalPagoWompiComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<any>,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _router:Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  public urlBase=environment.url_portal;
  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:true
  }
  public resultVisa:any
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
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
    if (this.data.Identificador){
      this.json.IdentificadorTransaccion = this.data.Identificador;
      this.jsonSave.Comprobante = this.data.DatosFacturacion.Comprobante;
      this.jsonSave.CodigoTributario = this.data.DatosFacturacion.CodigoTributario;
      this.jsonSave.RazonSocial = this.data.DatosFacturacion.RazonSocial;
      this.IdMatriculaCabecera = this.data.IdMatricula;
      var r= this._SessionStorageService.SessionGetValue(this.json.IdentificadorTransaccion);
      if(r!=''){
        this.json.RequiereDatosTarjeta=r=='false'?false:true;
      }
      this.url+=this.json.IdentificadorTransaccion
      this.ObtenerPreProcesoPagoCuotaAlumno()
    }
  }
  cerraModal(){
    this.dialogRef.close();
  }
  ObtenerPreProcesoPagoCuotaAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.resultVisa=x._Repuesta;
        if(this.resultVisa.estadoOperacion.toLowerCase()!='sent'){
          this._router.navigate(['/AulaVirtual/MisCursos/'+this.IdMatriculaCabecera])
        }
        this.resultVisa.total=0;
        this.jsonSave.IdentificadorTransaccion=this.json.IdentificadorTransaccion
        this.jsonSave.MedioCodigo=this.resultVisa.medioCodigo
        this.jsonSave.MedioPago=this.resultVisa.medioPago
        this.jsonSave.RequiereDatosTarjeta=this.json.RequiereDatosTarjeta
        this.jsonSave.TransactionToken=this.json.IdentificadorTransaccion
        this.jsonSave.IdPasarelaPago=this.resultVisa.idPasarelaPago
        this._SessionStorageService.SessionSetValue('datosWompi',JSON.stringify(this.jsonSave));
        this.addWompi()
      }
    })
  }
  addWompi(){

    let script = this._renderer2.createElement('script');
    script.src='https://checkout.wompi.co/widget.js'
    script.setAttribute('data-render','button')
    script.setAttribute('data-public-key','pub_prod_DM8suO85aqiUndaaZVIeQAErQehwf7xE')
    script.setAttribute('data-currency','COP');
    script.setAttribute('data-amount-in-cents',Math.floor(this.resultVisa.montoTotal*100))
    script.setAttribute('data-reference',this.json.IdentificadorTransaccion)
    script.setAttribute('data-redirect-url',this.urlBase+'AulaVirtual/PagoExitoso/'+this.json.IdentificadorTransaccion)

    this._renderer2.appendChild(this._document.getElementById('wompi'), script);
  }
  closeModal(){
    this.dialogRef.close(this.jsonSave)
  }
}
