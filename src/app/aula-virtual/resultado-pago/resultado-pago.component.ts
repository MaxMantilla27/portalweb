import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MensajeCorreoDTO } from 'src/app/Core/Models/LibroReclamacionesDTO';
import { RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { PasarelaPagoCorreoService } from 'src/app/Core/Shared/Services/PasarelaPagoCorreo/pasarela-pago-correo.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-resultado-pago',
  templateUrl: './resultado-pago.component.html',
  styleUrls: ['./resultado-pago.component.scss']
})
export class ResultadoPagoComponent implements OnInit,OnDestroy{
  private signal$ = new Subject();
  isBrowser: boolean;

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _PasarelaPagoCorreoService:PasarelaPagoCorreoService,
    private _SessionStorageService:SessionStorageService,
    private _router:Router,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId); {}
  }
  pipe = new DatePipe('es')
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:true
  }

  public resultVisa:any
  public ruta='/AulaVirtual/MisPagos'
  public rutaCursos = '/AulaVirtual/MisCursos'
  public rutaMisCursos='/AulaVirtual/MisCursos'
  public AreaCapacitacion=''
  public ProgramaNombre=''
  intentos=0;
  img=1;
  imgAc=''
  public jsonCorreo: MensajeCorreoDTO = {
    Asunto: '',
    Contenido: '',
    Destinatario: '',
  };
  ngOnInit(): void {
    console.log(this._router.url);
    if(this.isBrowser){
      this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
        next: (x) => {
          console.log("Identificador",x)
          this.json.IdentificadorTransaccion = x['Identificador'];
          this.ObtenerPreProcesoPagoCuotaAlumno()
        },
      });

      this.imgInterval();

      var interval2=setInterval(()=>{
        if(this.resultVisa!=undefined && this.resultVisa.estadoOperacion.toLowerCase()=='pending' && this.resultVisa.idPasarelaPago==5){
          this.ValidarProcesoPagoCuotaAlumnoOpenPAy();
        }
        if(this.resultVisa!=undefined && this.resultVisa.estadoOperacion.toLowerCase()!='pending'){
          clearInterval(interval2);
        }
      },15000)
    }
    this.obtenerUrlRedireccionErrorPago()
  }

  ValidarProcesoPagoCuotaAlumnoOpenPAy(){
    this._FormaPagoService.ValidarProcesoPagoCuotaAlumnoOpenPAy(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.ObtenerPreProcesoPagoCuotaAlumno()
      }
    })
  }
  ObtenerPreProcesoPagoCuotaAlumno(){
    this.ruta='/AulaVirtual/MisPagos'
    let comprobanteString = this._SessionStorageService.SessionGetValue('comprobante')

    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        // console.log("REPUESTA-PREPROCESO",x._Repuesta.listaCuota)
        // var menor = x._Repuesta.listaCuota[0].nombre
        // console.log("REPUESTA-PREPROCESO",menor)
        if(x._Repuesta.registroAlumno==null){
          this.ObtenerPreProcesoPagoOrganicoAlumno()
        }else{
          if(x._Repuesta.estadoOperacion==null){
            this._router.navigate([this.ruta])
          }else{
            this.resultVisa=x._Repuesta;
            console.log(this.resultVisa)
            if(this.resultVisa.idMatriculaCabecera>0 &&
              this.resultVisa.idMatriculaCabecera!=null &&
              this.resultVisa.idMatriculaCabecera!=undefined ){
                this.ruta=this.ruta+'/'+this.resultVisa.idMatriculaCabecera
                this.rutaCursos=this.rutaCursos+'/'+this.resultVisa.idMatriculaCabecera
            }
            if(this.resultVisa.estadoOperacion=='Processed'){
              this.EnvioCorreoPagoExitoso()
              if(comprobanteString!='')
              {
                let objComprobante = JSON.parse(comprobanteString)
                this._FormaPagoService.actualizarComprobantePagoLista(objComprobante).pipe(takeUntil(this.signal$)).subscribe({
                  next:x=>{
                  }
                })
              }
            }
            if(this.resultVisa.estadoOperacion =='No Process' ||
              this.resultVisa.estadoOperacion =='Declinado'){
                this.EnvioCorreoErrorPago()
            }

            if(this.resultVisa.estadoOperacion.toLowerCase()=='pending'){
              if(this.resultVisa.idPasarelaPago==6){
                this.verificarEstado(1)
              }
            }
            if(this.resultVisa.estadoOperacion.toLowerCase()=='sent' ){
              if(this.resultVisa.idPasarelaPago==2 && this.intentos<3)
              {
                var json=JSON.parse(this._SessionStorageService.SessionGetValue('datosWompi'));
                console.log(this._router.url.split('id=')[1].split('&')[0]);
                json.TransactionToken=this._router.url.split('id=')[1].split('&')[0]
                this.ProcesarPagoCuotaAlumno(json)
              }else{
                if(this.resultVisa.idPasarelaPago==6){
                  var js={
                    IdentificadorTransaccion:this.json.IdentificadorTransaccion,
                    RequiereDatosTarjeta:this.json.RequiereDatosTarjeta,
                    tipo:1
                  }
                  this.ChangeToPending(js);
                }else{
                  //this._router.navigate([this.ruta])
                }
              }
            }
          }
        }
      },
      error:e=>{
        //this._router.navigate([this.ruta])
      }
    })
  }
  ChangeToPending(js:any){
    this._FormaPagoService.ChangeToPending(js).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.resultVisa=x._registro;
        if(this.resultVisa.estadoOperacion.toLowerCase()=='pending'){
          this.verificarEstado(js.tipo);
          this.imgInterval();
        }
        if(js.tipo==2){
          this.resultVisa.registroAlumno=this.resultVisa.datoAlumno;
        }
      }
    })
  }
  imgInterval(){

    var interval=setInterval(() => {

      this.img++
      if(this.img>11){
        this.img=1
      }
      this.imgAc=this.img+'.png'
      if(this.resultVisa!=undefined && this.resultVisa.estadoOperacion.toLowerCase()!='pending'){
        clearInterval(interval);
      }
    }, 80);
  }
  verificarEstado(tipo:number){
    var interval=setInterval(() => {
      this.ObtenerPreProcesoPagoCuotaAlumno();

      console.log(this.resultVisa)
      if(this.resultVisa!=undefined && this.resultVisa.estadoOperacion.toLowerCase()!='pending'){
        clearInterval(interval);
      }
    }, 30000);
  }
  ObtenerPreProcesoPagoOrganicoAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoOrganicoAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x._Repuesta.estadoOperacion==null){
          //this._router.navigate([this.ruta])
        }else{
          this.resultVisa=x._Repuesta;
          if(this.resultVisa.estadoOperacion.toLowerCase()=='pending'){
            if(this.resultVisa.idPasarelaPago==6){
              this.verificarEstado(2)
            }
          }
          this.resultVisa.registroAlumno=this.resultVisa.datoAlumno;
          if(this.resultVisa.estadoOperacion.toLowerCase()=='sent' ){
            if(this.resultVisa.idPasarelaPago==2 && this.intentos<3)
            {
              var json=JSON.parse(this._SessionStorageService.SessionGetValue('datosWompi'));
              console.log(this._router.url.split('id=')[1].split('&')[0]);
              json.TransactionToken=this._router.url.split('id=')[1].split('&')[0]
              this.ProcesarPagoAlumnoOrganico(json)

            }else{
              if(this.resultVisa.idPasarelaPago==6){
                var js={
                  IdentificadorTransaccion:this.json.IdentificadorTransaccion,
                  RequiereDatosTarjeta:this.json.RequiereDatosTarjeta,
                  tipo:2
                }
                this.ChangeToPending(js);
              }else{
                //this._router.navigate([this.ruta])
              }
            }
          }
        }
      }
    })
  }
  ProcesarPagoAlumnoOrganico(json:any){
    this.intentos++;
    this._FormaPagoService.ProcesarPagoAlumnoOrganico(json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.ObtenerPreProcesoPagoCuotaAlumno()
      }
    })
  }
  ProcesarPagoCuotaAlumno(json:any){
    this.intentos++;
    this._FormaPagoService.ProcesarPagoCuotaAlumno(json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.ObtenerPreProcesoPagoCuotaAlumno()
      }
    })
  }
  obtenerUrlRedireccionErrorPago(){
    var DatosFormulario = this._SessionStorageService.SessionGetValue('urlRedireccionErrorPago');
    console.log(DatosFormulario)
    if(DatosFormulario!=''){
      var datos = JSON.parse(DatosFormulario);
      console.log(datos)
      this.AreaCapacitacion = datos.AreaCapacitacion;
      this.ProgramaNombre = datos.ProgramaNombre;
    }
  }
  RedireccionarModalIntentoPago(){
    this._SessionStorageService.SessionSetValue('urlRedireccionErrorPagoModal','true');
    this._router.navigate(['/'+ this.AreaCapacitacion + '/' + this.ProgramaNombre])

  }
  EnvioCorreoPagoExitoso() {
    console.log(this.resultVisa)
    console.log(this.resultVisa.registroAlumno)
    var paymentSummary = "";
    this.resultVisa.listaCuota.forEach((l:any) => {
      paymentSummary += "<div style='display:flex;border-bottom: 1px solid black;padding: 5px 0;'>"+
      "<div style='font-size:13px;font-weight:100;width: 66%;'>" + l.nombre + "</div>" +
      "<div style='font-size:13px;width: 33%;text-align:right;'>" + l.cuotaTotal.toFixed(2) + " " + this.resultVisa.monedaCorreo + "</div></div>";
    });
    this.jsonCorreo.Asunto =
      'Confirmación de Pago - BSG Institute';
    this.jsonCorreo.Destinatario = 'mmantilla@bsginstitute.com';
    this.jsonCorreo.Contenido =
    "<div style='display: flex; align-items: center; border-bottom: 2px solid black; padding-bottom: 4px; width: 80%;'>"+
    "<img src='https://bsginstitute.com/favicon.ico'style='width: 30px; height: 30px;'>"+
    "<div style='display: flex; font-size: 25px; color: #414140; margin-left: 7px;'>"+
    "<div style='letter-spacing: -4px;'>BSG</div>"+
    "<div style='margin-left: 7px;'>Institute</div>"+
    "</div></div>"+
  "<div style='font-weight:bold;font-size:15px;padding-top:20px'>Hola "+this.resultVisa.registroAlumno.nombre+","+
  "</div><br><div style='font-size:14px'>Es un gusto saludarte. Te informamos que tu pago se ha realizado con éxito."+
  "</div><br><div style='background:#EBF1FF;border-radius:5px;width:80%'>"+
    "<div style='padding:25px'>"+
      "<div style='display:flex;border-bottom: 2px solid black;padding-bottom:3px;'>"+
      "<div style='font-size:13px;font-weight:bold;width: 66%;'>Resúmen de pago</div>"+
      "<div style='font-size:13px;width: 33%;text-align:right;'>"+
      this.pipe.transform(this.resultVisa.fechaTransaccion, 'dd \'de\' MMMM \'del\' yyyy')+
      "</div></div>"+
      "<div style='padding-bottom:15px;padding-top:15px'>"+
        "<div style='font-size:14px;font-weight:bold'>"+
        this.resultVisa.nombrePrograma+
        "</div> Código de matrícula: "+this.resultVisa.codigoMatricula+
        "<div></div>"+
      "</div>"+
      "<div style='display:flex;border-bottom: 1px solid black;padding: 5px 0;'>"+
      "<div style='font-size:13px;font-weight:100;width: 66%;'>Concepto</div>"+
      "<div style='font-size:13px;width: 33%;text-align:right;'>Monto</div>"+
      "</div>"+
      paymentSummary+
      "<div style='display:flex;padding-bottom:20px;'>"+
      "<div style='font-size:13px;font-weight:bold;width: 66%;'>Total del pago</div>"+
      "<div style='font-size:13px;justify-content:flex-end;font-weight:bold;width: 33%;text-align:right;'>"+
      this.resultVisa.montoTotal.toFixed(2) +" "+this.resultVisa.monedaCorreo+
      "</div></div>"+
      // "<div style='font-size:13px'> Método de pago: Tarjeta Visa N° xxxx xxxx xxxx 1542"+
      // "</div>"+
      // "<div style='font-size:13px'> Comprobante solicitado: Factura - RUC XXXXXXXX / Boleta - DNI"+
      // "</div>"+
      // "<div style='font-size:13px'> Te has afiliado a pagos recurrentes"+
      // "</div>"+
    "</div>"+
  "</div><br><div style='font-size:13px'>!Si necesitas ayuda no dudes en contactarte con tu asesor académico!"+
  "</div><div style='font-size:13px'>o envía un correo a: <strong>matriculas@bsginstitute.com</strong>"+
  "</div><br><br><div style='font-size:13px'>Atentamente,"+
  "</div><div style='font-size:13px;padding-bottom:25px'>BSG Institute"+
  "</div>"+
  "<div style='background:#DDDDDD;border-radius:5px;width:80%;text-align:center'>"+
    "<div style='padding:15px'>"+
      "<div>"+
        "<a href='www.bsginstitute.com/termino-uso-web'>Términos de uso</a> | <a href='www.bsginstitute.com/politica-privacidad'>Política de Privacidad</a>"+
      "</div>"+
      "<div>© 2023 BSG Institute, todos los derechos reservados</div>"+
      "<div><a href='www.bsginstitute.com'>www.bsginstitute.com</a></div>"+
    "</div>"+
  "</div>"
    this._PasarelaPagoCorreoService.EnvioCorreo(this.jsonCorreo).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x);

      },
    });
  }
  EnvioCorreoErrorPago(){
    this.jsonCorreo.Asunto =
      'Error al Procesar tu Pago - BSG Institute';
    this.jsonCorreo.Destinatario = 'mmantilla@bsginstitute.com';
    this.jsonCorreo.Contenido =
    "<div style='display: flex; align-items: center; border-bottom: 2px solid black; padding-bottom: 4px; width: 80%;'>"+
    "<img src='https://bsginstitute.com/favicon.ico'style='width: 30px; height: 30px;'>"+
    "<div style='display: flex; font-size: 25px; color: #414140; margin-left: 7px;'>"+
    "<div style='letter-spacing: -4px;'>BSG</div>"+
    "<div style='margin-left: 7px;'>Institute</div>"+
    "</div></div>"+
  "<div style='font-weight:bold;font-size:15px;padding-top:20px'>Hola "+this.resultVisa.registroAlumno.nombre+","+
  "</div><br><div style='font-size:14px'>Hubo un problema al procesar tu pago."+
  "</div><br><div style='font-size:14px'>"+
      "<div>Considera los siguientes consejos:"+
    "</div>"+
 "<ul style='margin-top:5px;padding-left:20px'>"+
        "<li>Intenta nuevamente y asegurate de ingresar la información correcta.</li>"+
        "<li>Asegúrate de que la tarjeta tenga saldo suficiente.</li>"+
        "<li>Contacta a tu banco para comprobar que no haya ningún bloqueo.</li>"+
    "</ul></div><br><div style='font-size:13px'>!Si necesitas ayuda no dudes en contactarte con tu asesor académico!"+
  "</div><div style='font-size:13px'>o envía un correo a: <strong>matriculas@bsginstitute.com</strong>"+
  "</div><br><br><div style='font-size:13px'>Atentamente,"+
  "</div><div style='font-size:13px;padding-bottom:25px'>BSG Institute"+
  "</div>"+
  "<div style='background:#DDDDDD;border-radius:5px;width:80%;text-align:center'>"+
    "<div style='padding:15px'>"+
      "<div>"+
        "<a href='www.bsginstitute.com/termino-uso-web'>Términos de uso</a> | <a href='www.bsginstitute.com/politica-privacidad'>Política de Privacidad</a>"+
      "</div>"+
      "<div>© 2023 BSG Institute, todos los derechos reservados</div>"+
      "<div><a href='www.bsginstitute.com'>www.bsginstitute.com</a></div>"+
    "</div></div>"
    this._PasarelaPagoCorreoService.EnvioCorreo(this.jsonCorreo).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x);

      },
    });
  }
}
