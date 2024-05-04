import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-modal-pago-izipay-organico',
  templateUrl: './modal-pago-izipay-organico.component.html',
  styleUrls: ['./modal-pago-izipay-organico.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalPagoIzipayOrganicoComponent implements OnInit {
  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _ActivatedRoute: ActivatedRoute,
    private _FormaPagoService: FormaPagoService,
    private _SessionStorageService: SessionStorageService,
    private dialogRefModal: MatDialogRef<ModalPagoIzipayOrganicoComponent>,
    private _router: Router
  ) { }
  private kryptonScriptLoaded: boolean = false;
  private signal$ = new Subject();
  hidenBotom=true
  public intervcal:any
  public dialogRef: any;
  public idMatricula = 0;
  public json: RegistroRespuestaPreProcesoPagoDTO = {
    IdentificadorTransaccion: '',
    RequiereDatosTarjeta: false,
  };
  public resultPreValidacion: any;

  ngAfterViewInit():void{
    if (this.data.Identificador){
      this.idMatricula =  this.data.IdMatricula
      this.json.IdentificadorTransaccion=this.data.Identificador
      var r= this._SessionStorageService.SessionGetValue(this.json.IdentificadorTransaccion);
      if (r!='') {
        this.json.RequiereDatosTarjeta=r=='false'?false:true;
      }
      this.ObtenerPreProcesoPagoOrganicoAlumno();
    }
  }
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  ngOnInit(): void {
  /*Evalua usar solo en Ngonit*/
  }
  ObtenerPreProcesoPagoOrganicoAlumno() {
    this._FormaPagoService
      .ObtenerPreProcesoPagoOrganicoAlumnoIziPay(this.json)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.resultPreValidacion = x;
        },
        complete:()=>{
          this.iniciarScripsIzipay();
        }
      });
  }
  iniciarScripsIzipay() {
    this.kryptonScriptLoaded=false;
    if (!this.kryptonScriptLoaded) {
      let script1 = this._renderer2.createElement('script');
      script1.src = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js';
      script1.setAttribute('kr-public-key', this.resultPreValidacion.procesoPagoBotonIziPay.publicKey);
      script1.setAttribute('kr-post-url-success', 'https://proceso-pago.bsginstitute.com/ProcesoPagoIziPay/Cronograma?IdTransaccion=' + this.json.IdentificadorTransaccion);
      script1.setAttribute('kr-post-url-refused', 'https://proceso-pago.bsginstitute.com/ProcesoPagoIziPay/Cronograma?IdTransaccion=' + this.json.IdentificadorTransaccion);
      script1.setAttribute('kr-lang', 'es');
      this._renderer2.appendChild(this._document.getElementById('header'), script1);

      let script2 = this._renderer2.createElement('script');
      script2.src = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic.js';
      this._renderer2.appendChild(this._document.getElementById('header'), script2);

      // Marcar el script como cargado
      this.kryptonScriptLoaded = true;
    }


    let divForm = this._renderer2.createElement('div');
    divForm = this._document.getElementById('FormBody');
    divForm.setAttribute(
      'kr-form-token',
      this.resultPreValidacion.procesoPagoBotonIziPay.formToken
    );
    this.intervcal=setInterval(() => {
      var data=document.getElementsByClassName('kr-popin-button');
      if(data !=undefined && data?.length>0){
        this.customForm()
        clearInterval(this.intervcal)
      }else{
        window.location.reload()
      }
    }, 5000);
  }
  customForm(){
    var boton=document.getElementsByClassName('kr-popin-button');
    if(typeof(boton) != 'undefined' && boton != null && boton.length>0)
      boton[0].setAttribute("style",
      "background-color: #F8893F;color: white;padding: 0 6px 0 6px;margin: 6px 8px 6px 8px;min-width: 88px;border-radius: 3px;font-size: 14px;"+
      "text-align: center;text-transform: uppercase;text-decoration:none;border: none;outline: none;box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);&:hover {background-color: #b26a3b}"
      );

    var botonPago =document.getElementsByClassName('kr-payment-button');
    if(typeof(botonPago) != 'undefined' && botonPago != null && botonPago.length>0)
      botonPago[0].setAttribute("style",
      "background-color: #F8893F;padding: 0 6px 0 6px;margin: 6px 8px 6px 8px;min-width: 88px;border-radius: 3px;font-size: 14px;"+
      "text-align: center;text-transform: uppercase;text-decoration:none;border: none;outline: none;box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);&:hover {background-color: #b26a3b}"
      );

    var logo=document.getElementsByClassName('kr-header-logo');
    if(typeof(logo) != 'undefined' && logo != null && logo.length>0)
      logo[1].setAttribute("src","../../../assets/imagenes/logo-bsg.png");

    var spanNombre= document.getElementsByClassName('kr-popin-shop-name');
    if(typeof(spanNombre) != 'undefined' && spanNombre != null && spanNombre.length>0)
      spanNombre[0].className="";

    var modalHeader = document.getElementsByClassName('kr-popin-modal-header');
    if(typeof(modalHeader) != 'undefined' && modalHeader != null && modalHeader.length>0)
      modalHeader[0].setAttribute("style", "margin-bottom: 0px;height: 70px;");

    this.hidenBotom=false
  }
  cerraModal(){
    this.dialogRefModal.close(true);
    this.kryptonScriptLoaded=false;


  }
}
