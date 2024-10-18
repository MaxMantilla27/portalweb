import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MensajeCorreoDTO } from 'src/app/Core/Models/LibroReclamacionesDTO';
import { RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { FormatoMilesDecimalesPipe } from 'src/app/Core/Shared/Pipes/formato-miles-decimales.pipe';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { PasarelaPagoCorreoService } from 'src/app/Core/Shared/Services/PasarelaPagoCorreo/pasarela-pago-correo.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-resultado-pago-pse',
  templateUrl: './resultado-pago-pse.component.html',
  styleUrls: ['./resultado-pago-pse.component.scss'],
  providers: [FormatoMilesDecimalesPipe]
})
export class ResultadoPagoPSEComponent implements OnInit,OnDestroy{
  private signal$ = new Subject();
  isBrowser: boolean;

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _PasarelaPagoCorreoService:PasarelaPagoCorreoService,
    private _SessionStorageService:SessionStorageService,
    private _router:Router,
    @Inject(PLATFORM_ID) platformId: Object,
    private FormatoMilesDecimales: FormatoMilesDecimalesPipe
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

  public resultProceso:any
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
  public RutaCargada=false;
  public Matricula:any;
  public NombreCursoPago=''
  public CodigoMatricula=''
  public correoMatriculas='matriculas@bsginstitute.com'
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
        if(this.resultProceso!=undefined && this.resultProceso.estadoOperacion.toLowerCase()=='pending' && this.resultProceso.idPasarelaPago==5){
          this.ValidarProcesoPagoCuotaAlumnoOpenPAy();
        }
        if(this.resultProceso!=undefined && this.resultProceso.estadoOperacion.toLowerCase()!='pending'){
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
        console.log(x)
        // console.log("REPUESTA-PREPROCESO",x._Repuesta.listaCuota)
        // var menor = x._Repuesta.listaCuota[0].nombre
        // console.log("REPUESTA-PREPROCESO",menor)
        if(x._Repuesta.registroAlumno==null){
          this.ObtenerPreProcesoPagoOrganicoAlumno()
        }else{
          if(x._Repuesta.estadoOperacion==null){
            this._router.navigate([this.ruta])
          }else{
            this.resultProceso=x._Repuesta;
            console.log(this.resultProceso)
            if(this.resultProceso.estadoOperacion=='Processed'){
              if(this.resultProceso.tipoPago=='Organico'||this.resultProceso.idMatriculaCabecera==0){
                this.RegistrarMatriculaAlumnoOrganico()
              }
              else{
                if(this.resultProceso.idMatriculaCabecera>0 &&
                  this.resultProceso.idMatriculaCabecera!=null &&
                  this.resultProceso.idMatriculaCabecera!=undefined ){
                    this.ruta=this.ruta+'/'+this.resultProceso.idMatriculaCabecera
                    this.rutaCursos=this.rutaCursos+'/'+this.resultProceso.idMatriculaCabecera
                    this.CodigoMatricula=this.resultProceso.codigoMatricula
                    if(this.resultProceso.nombrePrograma==null || this.resultProceso.nombrePrograma=='null' || this.resultProceso.nombrePrograma==undefined){
                      this.NombreCursoPago='';
                    }
                    else{
                      this.NombreCursoPago=this.resultProceso.nombrePrograma
                    }
                }
                this.RutaCargada=true;
              }
              if(comprobanteString!='')
              {
                let objComprobante = JSON.parse(comprobanteString)
                this._FormaPagoService.actualizarComprobantePagoLista(objComprobante).pipe(takeUntil(this.signal$)).subscribe({
                  next:x=>{
                  }
                })
              }
            }
            if(this.resultProceso.estadoOperacion =='No Process' ||
              this.resultProceso.estadoOperacion =='Declinado'||
              this.resultProceso.estadoOperacion =='Declined'||
              this.resultProceso.estadoOperacion =='No Processed'||
              this.resultProceso.estadoOperacion =='ERROR'){
                this.NombreCursoPago=this.resultProceso.nombrePrograma
                this.ruta=this.ruta+'/'+this.resultProceso.idMatriculaCabecera
            }

            if(this.resultProceso.estadoOperacion.toLowerCase()=='pending'){
              if(this.resultProceso.idPasarelaPago==6){
                this.verificarEstado(1)
              }
            }
            if(this.resultProceso.estadoOperacion.toLowerCase()=='sent' ){
              console.log('ACTUALIZA EL PAGO WOMPI')
              if(this.resultProceso.idPasarelaPago==2 && this.intentos<3)
              {
                var json=JSON.parse(this._SessionStorageService.SessionGetValue('datosWompi'));
                console.log(this._router.url.split('id=')[1].split('&')[0]);
                json.TransactionToken=this._router.url.split('id=')[1].split('&')[0]
                this.ProcesarPagoCuotaAlumno(json)
              }else{
                if(this.resultProceso.idPasarelaPago==6){
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
        this.resultProceso=x._registro;
        if(this.resultProceso.estadoOperacion.toLowerCase()=='pending'){
          this.verificarEstado(js.tipo);
          this.imgInterval();
        }
        if(js.tipo==2){
          this.resultProceso.registroAlumno=this.resultProceso.datoAlumno;
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
      if(this.resultProceso!=undefined && this.resultProceso.estadoOperacion.toLowerCase()!='pending'){
        clearInterval(interval);
      }
    }, 80);
  }
  verificarEstado(tipo:number){
    var interval=setInterval(() => {
      this.ObtenerPreProcesoPagoCuotaAlumno();

      console.log(this.resultProceso)
      if(this.resultProceso!=undefined && this.resultProceso.estadoOperacion.toLowerCase()!='pending'){
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
          this.resultProceso=x._Repuesta;
          if(this.resultProceso.estadoOperacion.toLowerCase()=='pending'){
            if(this.resultProceso.idPasarelaPago==6){
              this.verificarEstado(2)
            }
          }
          this.resultProceso.registroAlumno=this.resultProceso.datoAlumno;
          if(this.resultProceso.estadoOperacion.toLowerCase()=='sent' ){
            if(this.resultProceso.idPasarelaPago==2 && this.intentos<3)
            {
              var json=JSON.parse(this._SessionStorageService.SessionGetValue('datosWompi'));
              console.log(this._router.url.split('id=')[1].split('&')[0]);
              json.TransactionToken=this._router.url.split('id=')[1].split('&')[0]
              this.ProcesarPagoAlumnoOrganico(json)

            }else{
              if(this.resultProceso.idPasarelaPago==6){
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
  RegistrarMatriculaAlumnoOrganico(){
    this._FormaPagoService.RegistrarMatriculaAlumnoOrganico(this.json.IdentificadorTransaccion).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.Matricula=x
        if(this.Matricula.nombrePGeneral==null || this.Matricula.nombrePGeneral=='null' || this.Matricula.nombrePGeneral==undefined){
          this.NombreCursoPago='';
        }
        else{
          this.NombreCursoPago=this.Matricula.nombrePGeneral;
          this.CodigoMatricula=this.Matricula.codigoMatricula;
        }
      },
      error:e=>{
      },
      complete:()=>{
        this.ruta=this.ruta+'/'+this.Matricula.id
        this.rutaCursos=this.rutaCursos+'/'+this.Matricula.id
        this.RutaCargada=true;
        this.CongelarPEspecificoMatriculaAlumnoOrganico()
        setTimeout(() => {
          this.EnvioCorreoRegularizarOportunidad()
        }, 5000)
      }
    })
  }

  EnvioCorreoRegularizarOportunidad() {
    console.log(this.Matricula)
    console.log(this.resultProceso)
    console.log(this.resultProceso.registroAlumno)
    var paymentSummary = "";
    let countLista=0
    if(this.resultProceso.listaCuota.length==0){
      paymentSummary += "<div style='display:flex;border-bottom: 1px solid black;padding: 5px 0;'>"+
      "<div style='font-size:13px;font-weight:100;width: 66%;'>" + 'Matrícula' + "</div>" +
      "<div style='font-size:13px;width: 33%;text-align:right;'>" + this.FormatoMilesDecimales.transform(this.resultProceso.montoTotal) + " " + this.resultProceso.monedaCorreo + "</div></div>";
    }
    else{
      this.resultProceso.listaCuota.forEach((l:any) => {
        if(countLista==0){
          paymentSummary += "<div style='display:flex;border-bottom: 1px solid black;padding: 5px 0;'>"+
                            "<div style='font-size:13px;font-weight:100;width: 66%;'>" + this.reemplazarRazonPago(l.nombre) + "</div>" +
                            "<div style='font-size:13px;width: 33%;text-align:right;'>" + this.FormatoMilesDecimales.transform(l.cuotaTotal) + " " + this.resultProceso.monedaCorreo + "</div></div>";
        }
        countLista++;
      });
    }

    this.jsonCorreo.Asunto =
      'NUEVA MATRICULA ORGANICA';
    this.jsonCorreo.Destinatario = this.correoMatriculas;
    // this.jsonCorreo.Destinatario = 'mmantilla@bsginstitute.com';
    this.jsonCorreo.Contenido =
    "<div style='margin-left:8rem;margin-right:8rem'>"+
    "<div style='display: flex; align-items: center; border-bottom: 2px solid black; padding-bottom: 4px; width: 80%;'>"+
    "<img src='https://bsginstitute.com/favicon.ico'style='width: 30px; height: 30px;'>"+
    "<div style='display: flex; font-size: 25px; color: #414140; margin-left: 7px;'>"+
    "<div style='letter-spacing: -4px;'>BSG</div>"+
    "<div style='margin-left: 7px;'>Institute</div>"+
    "</div></div>"+
  "<div style='font-weight:bold;font-size:15px;padding-top:20px'>Pago Orgánico realizado por el usuario: "+this.resultProceso.registroAlumno.nombre+","+
  "</div><br><div style='font-size:14px'>Porfavor regularizar el proceso para la generación de oportunidad y la asignación de su asesor correspondiente."+
  "</div><br><div style='background:#EBF1FF;border-radius:5px;width:80%'>"+
    "<div style='padding:25px'>"+
      "<div style='display:flex;border-bottom: 2px solid black;padding-bottom:3px;'>"+
      "<div style='font-size:13px;font-weight:bold;width: 66%;'>Resúmen de pago</div>"+
      "<div style='font-size:13px;width: 33%;text-align:right;'>"+this.pipe.transform(this.resultProceso.fechaTransaccion, 'dd \'de\' MMMM \'del\' yyyy')+"</div></div>"+
      "<div style='padding-bottom:15px;padding-top:15px'>"+
        "<div style='font-size:14px;font-weight:bold'>"+
        this.NombreCursoPago+
        "</div> Código de matrícula: "+this.CodigoMatricula+
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
      this.FormatoMilesDecimales.transform(this.resultProceso.montoTotal) +" "+this.resultProceso.monedaCorreo+
      "</div></div>"+
      // "<div style='font-size:13px'> Método de pago: Tarjeta Visa N° xxxx xxxx xxxx 1542"+
      // "</div>"+
      // "<div style='font-size:13px'> Comprobante solicitado: Factura - RUC XXXXXXXX / Boleta - DNI"+
      // "</div>"+
      // "<div style='font-size:13px'> Te has afiliado a pagos recurrentes"+
      // "</div>"+
    "</div>"+
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
    this._PasarelaPagoCorreoService.EnvioCorreoMatriculaOrganica(this.jsonCorreo).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x);

      },
    });
  }
  CongelarPEspecificoMatriculaAlumnoOrganico(){
    this._FormaPagoService.CongelarPEspecificoMatriculaAlumnoOrganico(this.Matricula.codigoMatricula,this.Matricula.id).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x);

      },
    });
  }
  reemplazarRazonPago(stringOriginal: string): string {
    return stringOriginal.replace(/\//g, "/");
  }
}
