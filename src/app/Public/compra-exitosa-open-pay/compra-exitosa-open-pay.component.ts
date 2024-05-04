import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MensajeCorreoDTO } from 'src/app/Core/Models/LibroReclamacionesDTO';
import { RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { PasarelaPagoCorreoService } from 'src/app/Core/Shared/Services/PasarelaPagoCorreo/pasarela-pago-correo.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-compra-exitosa-open-pay',
  templateUrl: './compra-exitosa-open-pay.component.html',
  styleUrls: ['./compra-exitosa-open-pay.component.scss']
})
export class CompraExitosaOpenPayComponent implements OnInit {
  private signal$ = new Subject();
  isBrowser: boolean;

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _router:Router,
    @Inject(PLATFORM_ID) platformId: Object,
    private dialog:MatDialog,
    private _PasarelaPagoCorreoService:PasarelaPagoCorreoService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId); {}
  }

  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:true
  }
  dialogRef:any
  public tipoRespuesta = null
  public resultVisa:any
  public resultOpenPay :any
  public ruta='/AulaVirtual/MisPagos'
  intentos=0;
  img=1;
  imgAc=''
  public id=''
  public rutaPago='/AulaVirtual/MisPagos'
  public rutaCursos = '/AulaVirtual/MisCursos'
  public jsonCorreo: MensajeCorreoDTO = {
    Asunto: '',
    Contenido: '',
    Destinatario: '',
  };
  pipe = new DatePipe('es')
  public RutaCargada=false;
  public Matricula:any;
  public NombreCursoPago=''
  public CodigoMatricula=''

  ngOnInit(): void {
    if(this.isBrowser){
      this._ActivatedRoute.queryParams.pipe(takeUntil(this.signal$)).subscribe({
        next: (x) => {
          this.id = x['id'];
          this.tipoRespuesta = x['tipo']
          this.dialogRef =this.dialog.open(ChargeComponent,{
            panelClass:'dialog-charge',
            disableClose:true
          });
          this.ProcesamientoPagoOpenPay()
        },
      });

      this.imgInterval();
      // var interval2=setInterval(()=>{
      //   if(this.resultVisa!=undefined && this.resultVisa.estadoOperacion.toLowerCase()=='pending' && this.resultVisa.idPasarelaPago==5){
      //     this.ProcesamientoPagoOpenPay();
      //   }
      //   if(this.resultVisa!=undefined && this.resultVisa.estadoOperacion.toLowerCase()!='pending'){
      //     clearInterval(interval2);
      //   }
      // },15000)
    }

  }
  ProcesamientoPagoOpenPay(){
    if(this.tipoRespuesta=="AF")
    {
      this.json.IdentificadorTransaccion=this.id
      this.ObtenerPreProcesoPagoCuotaAlumno()
      this._FormaPagoService.ProcesamientoAfiliacionOpenPay(this.id).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)

          this.resultOpenPay = JSON.parse(x._Repuesta.pagoAfiliacion)
          console.log("ResultadoOpen", this.resultOpenPay)

        }
      })
    }
    else{
      this._FormaPagoService.ProcesamientoPagoOpenPay(this.id).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{

          this.json.IdentificadorTransaccion=x._Repuesta.identificadorTransaccion
          this.ObtenerPreProcesoPagoCuotaAlumno()
        }
      })
    }
  }

  ObtenerPreProcesoPagoCuotaAlumno(){
    console.log("PRUEBA")
    this.ruta='/AulaVirtual/MisPagos'
    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.dialogRef.close()
        if(x._Repuesta.registroAlumno==null){
          this.ObtenerPreProcesoPagoOrganicoAlumno()
        }else{
          if(x._Repuesta.estadoOperacion==null){
            this._router.navigate([this.ruta])
          }else{
            this.resultVisa=x._Repuesta;

            if(this.resultVisa.estadoOperacion=='Processed')
            {
              if(this.resultVisa.tipoPago=='Organico'){
                this.RegistrarMatriculaAlumnoOrganico()
              }
              else{
                if(this.resultVisa.idMatriculaCabecera>0 &&
                  this.resultVisa.idMatriculaCabecera!=null &&
                  this.resultVisa.idMatriculaCabecera!=undefined ){
                    this.rutaPago=this.rutaPago+'/'+this.resultVisa.idMatriculaCabecera
                    this.rutaCursos=this.rutaCursos+'/'+this.resultVisa.idMatriculaCabecera
                    this.CodigoMatricula=this.resultVisa.codigoMatricula
                    if(this.resultVisa.nombrePrograma==null || this.resultVisa.nombrePrograma=='null' || this.resultVisa.nombrePrograma==undefined){
                      this.NombreCursoPago='';
                    }
                    else{
                      this.NombreCursoPago=this.resultVisa.nombrePrograma
                    }
                }
                this.EnvioCorreoPagoExitoso()
                this.RutaCargada=true;
              }
              let comprobanteString = this._SessionStorageService.SessionGetValue('comprobante')
              if(comprobanteString!='')
              {
                let objComprobante = JSON.parse(comprobanteString)
                if(this.tipoRespuesta=="AF")
                {
                  var valor:any
                  objComprobante.listaCuota.forEach((l:any) => {
                    if(valor==undefined){
                      valor=l
                    }else{
                      if(valor.nroCuota>l.nroCuota){
                        valor=l
                      }
                    }
                  });
                  objComprobante.listaCuota = [valor]
                }
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
            }
          }
        }
        this.dialogRef.close()
      },
      error:e=>{
        //this._router.navigate([this.ruta])
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

  ObtenerPreProcesoPagoOrganicoAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoOrganicoAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x._Repuesta.estadoOperacion==null){
          //this._router.navigate([this.ruta])
        }else{
          this.resultVisa=x._Repuesta;
          if(this.resultVisa.estadoOperacion.toLowerCase()=='pending'){
          }
          this.resultVisa.registroAlumno=this.resultVisa.datoAlumno
        }
      }
    })
  }
  EnvioCorreoPagoExitoso() {
    console.log(this.resultVisa)
    console.log(this.resultVisa.registroAlumno)
    var paymentSummary = "";
    if(this.resultVisa.listaCuota.length==0){
      paymentSummary += "<div style='display:flex;border-bottom: 1px solid black;padding: 5px 0;'>"+
      "<div style='font-size:13px;font-weight:100;width: 66%;'>" + 'Matrícula' + "</div>" +
      "<div style='font-size:13px;width: 33%;text-align:right;'>" + this.resultVisa.montoTotal.toFixed(2) + " " + this.resultVisa.monedaCorreo + "</div></div>";
    }
    else{
      this.resultVisa.listaCuota.forEach((l:any) => {
        paymentSummary += "<div style='display:flex;border-bottom: 1px solid black;padding: 5px 0;'>"+
        "<div style='font-size:13px;font-weight:100;width: 66%;'>" + l.nombre + "</div>" +
        "<div style='font-size:13px;width: 33%;text-align:right;'>" + l.cuotaTotal.toFixed(2) + " " + this.resultVisa.monedaCorreo + "</div></div>";
      });
    }

    this.jsonCorreo.Asunto =
      'Confirmación de Pago '+this.resultVisa.nombrePasarela+'- BSG Institute';
    this.jsonCorreo.Destinatario = this.resultVisa.registroAlumno.correo;
    this.jsonCorreo.Contenido =
    "<div style='margin-left:8rem;margin-right:8rem'>"+
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
    'Error al Procesar tu Pago '+this.resultVisa.nombrePasarela+'- BSG Institute';
    this.jsonCorreo.Destinatario = this.resultVisa.registroAlumno.correo;
    this.jsonCorreo.Contenido =
    "<div style='margin-left:8rem;margin-right:8rem'>"+
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
  RegistrarMatriculaAlumnoOrganico(){
    this._FormaPagoService.RegistrarMatriculaAlumnoIzipayOrganico(this.json.IdentificadorTransaccion).pipe(takeUntil(this.signal$)).subscribe({
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
          this.EnvioCorreoPagoExitoso();
          this.EnvioCorreoRegularizarOportunidad()
        }, 5000)
      }
    })
  }

  EnvioCorreoRegularizarOportunidad() {
    console.log(this.Matricula)
    console.log(this.resultVisa)
    console.log(this.resultVisa.registroAlumno)
    var paymentSummary = "";
    let countLista=0
    if(this.resultVisa.listaCuota.length==0){
      paymentSummary += "<div style='display:flex;border-bottom: 1px solid black;padding: 5px 0;'>"+
      "<div style='font-size:13px;font-weight:100;width: 66%;'>" + 'Matrícula' + "</div>" +
      "<div style='font-size:13px;width: 33%;text-align:right;'>" + this.resultVisa.montoTotal.toFixed(2) + " " + this.resultVisa.monedaCorreo + "</div></div>";
    }
    else{
      this.resultVisa.listaCuota.forEach((l:any) => {
        if(countLista==0){
          paymentSummary += "<div style='display:flex;border-bottom: 1px solid black;padding: 5px 0;'>"+
                            "<div style='font-size:13px;font-weight:100;width: 66%;'>" + l.nombre + "</div>" +
                            "<div style='font-size:13px;width: 33%;text-align:right;'>" + l.cuotaTotal.toFixed(2) + " " + this.resultVisa.monedaCorreo + "</div></div>";
        }
        countLista++;
      });
    }

    this.jsonCorreo.Asunto =
      'NUEVA MATRICULA ORGANICA';
    this.jsonCorreo.Destinatario = 'matriculas@bsginstitute.com';
    // this.jsonCorreo.Destinatario = 'mmantilla@bsginstitute.com';
    this.jsonCorreo.Contenido =
    "<div style='margin-left:8rem;margin-right:8rem'>"+
    "<div style='display: flex; align-items: center; border-bottom: 2px solid black; padding-bottom: 4px; width: 80%;'>"+
    "<img src='https://bsginstitute.com/favicon.ico'style='width: 30px; height: 30px;'>"+
    "<div style='display: flex; font-size: 25px; color: #414140; margin-left: 7px;'>"+
    "<div style='letter-spacing: -4px;'>BSG</div>"+
    "<div style='margin-left: 7px;'>Institute</div>"+
    "</div></div>"+
  "<div style='font-weight:bold;font-size:15px;padding-top:20px'>Pago Orgánico realizado por el usuario: "+this.resultVisa.registroAlumno.nombre+","+
  "</div><br><div style='font-size:14px'>Porfavor regularizar el proceso para la generación de oportunidad y la asignación de su asesor correspondiente."+
  "</div><br><div style='background:#EBF1FF;border-radius:5px;width:80%'>"+
    "<div style='padding:25px'>"+
      "<div style='display:flex;border-bottom: 2px solid black;padding-bottom:3px;'>"+
      "<div style='font-size:13px;font-weight:bold;width: 66%;'>Resúmen de pago</div>"+
      "<div style='font-size:13px;width: 33%;text-align:right;'>"+this.pipe.transform(this.resultVisa.fechaTransaccion, 'dd \'de\' MMMM \'del\' yyyy')+"</div></div>"+
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
      this.resultVisa.montoTotal.toFixed(2) +" "+this.resultVisa.monedaCorreo+
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
}
