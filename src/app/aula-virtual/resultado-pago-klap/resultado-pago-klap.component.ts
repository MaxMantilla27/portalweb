import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MensajeCorreoDTO } from 'src/app/Core/Models/LibroReclamacionesDTO';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { PasarelaPagoCorreoService } from 'src/app/Core/Shared/Services/PasarelaPagoCorreo/pasarela-pago-correo.service';

@Component({
  selector: 'app-resultado-pago-klap',
  templateUrl: './resultado-pago-klap.component.html',
  styleUrls: ['./resultado-pago-klap.component.scss']
})
export class ResultadoPagoKlapComponent implements OnInit {

  private signal$ = new Subject()
  constructor(
    private _FormaPagoService:FormaPagoService,
    private _ActivatedRoute:ActivatedRoute,
    public dialog: MatDialog,
    private _PasarelaPagoCorreoService:PasarelaPagoCorreoService,
  ) { }

  resultProceso:any;
  resultKlap:any;
  url=''
  dialogRef:any

  public json={
    IdentificadorTransaccion:'',
  }
  public ruta='/AulaVirtual/MisPagos'
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
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.json.IdentificadorTransaccion = x['Identificador'];
        this.ObtenerResultadoProcesopagoKlap()
        this.dialogRef =this.dialog.open(ChargeComponent,{
          panelClass:'dialog-charge',
          disableClose:true
        });
      },
    });
  }

  ObtenerResultadoProcesopagoKlap(){
    this._FormaPagoService.ConsultarPagoKlap(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x._Repuesta==true)
        {
          this.ObtenerPreProcesoPagoCuotaAlumno()
        }

      }
    })
  }

  ObtenerPreProcesoPagoCuotaAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno({
      IdentificadorTransaccion: this.json.IdentificadorTransaccion,
      RequiereDatosTarjeta: false
    }).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.resultProceso=x._Repuesta;
      },
      complete:()=>{
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
                this.NombreCursoPago=this.resultProceso.nombrePrograma
            }
            this.EnvioCorreoPagoExitoso()
            this.RutaCargada=true;
          }
        }
        if(this.resultProceso.estadoOperacion =='No Process' ||
              this.resultProceso.estadoOperacion =='Declinado'){
                this.EnvioCorreoErrorPago()
            }
        this.dialogRef.close()
      }
    })
  }



  redireccionarAPagos(){
    let url = "http://localhost:4200/AulaVirtual/MisPagos";
    //let url = "https://bsginstitute.com/AulaVirtual/MisPagos";
    window.location.href =url;
  }

  EnvioCorreoPagoExitoso() {
    console.log(this.resultProceso)
    console.log(this.resultProceso.registroAlumno)
    var paymentSummary = "";
    if(this.resultProceso.listaCuota.length==0){
      paymentSummary += "<div style='display:flex;border-bottom: 1px solid black;padding: 5px 0;'>"+
      "<div style='font-size:13px;font-weight:100;width: 66%;'>" + 'Matrícula' + "</div>" +
      "<div style='font-size:13px;width: 33%;text-align:right;'>" + this.resultProceso.montoTotal.toFixed(2) + " " + this.resultProceso.monedaCorreo + "</div></div>";
    }
    else{
      this.resultProceso.listaCuota.forEach((l:any) => {
        paymentSummary += "<div style='display:flex;border-bottom: 1px solid black;padding: 5px 0;'>"+
        "<div style='font-size:13px;font-weight:100;width: 66%;'>" + l.nombre + "</div>" +
        "<div style='font-size:13px;width: 33%;text-align:right;'>" + l.cuotaTotal.toFixed(2) + " " + this.resultProceso.monedaCorreo + "</div></div>";
      });
    }

    this.jsonCorreo.Asunto =
      'Confirmación de Pago '+this.resultProceso.nombrePasarela+'- BSG Institute';
    this.jsonCorreo.Destinatario = this.resultProceso.registroAlumno.correo;
    this.jsonCorreo.Contenido =
    "<div style='margin-left:8rem;margin-right:8rem'>"+
    "<div style='display: flex; align-items: center; border-bottom: 2px solid black; padding-bottom: 4px; width: 80%;'>"+
    "<img src='https://bsginstitute.com/favicon.ico'style='width: 30px; height: 30px;'>"+
    "<div style='display: flex; font-size: 25px; color: #414140; margin-left: 7px;'>"+
    "<div style='letter-spacing: -4px;'>BSG</div>"+
    "<div style='margin-left: 7px;'>Institute</div>"+
    "</div></div>"+
  "<div style='font-weight:bold;font-size:15px;padding-top:20px'>Hola "+this.resultProceso.registroAlumno.nombre+","+
  "</div><br><div style='font-size:14px'>Es un gusto saludarte. Te informamos que tu pago se ha realizado con éxito."+
  "</div><br><div style='background:#EBF1FF;border-radius:5px;width:80%'>"+
    "<div style='padding:25px'>"+
      "<div style='display:flex;border-bottom: 2px solid black;padding-bottom:3px;'>"+
      "<div style='font-size:13px;font-weight:bold;width: 66%;'>Resúmen de pago</div>"+
      "<div style='font-size:13px;width: 33%;text-align:right;'>"+
      this.pipe.transform(this.resultProceso.fechaTransaccion, 'dd \'de\' MMMM \'del\' yyyy')+
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
      this.resultProceso.montoTotal.toFixed(2) +" "+this.resultProceso.monedaCorreo+
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
      'Error al Procesar tu Pago '+this.resultProceso.nombrePasarela+'- BSG Institute';
    this.jsonCorreo.Destinatario = this.resultProceso.registroAlumno.correo;
    this.jsonCorreo.Contenido =
    "<div style='margin-left:8rem;margin-right:8rem'>"+
    "<div style='display: flex; align-items: center; border-bottom: 2px solid black; padding-bottom: 4px; width: 80%;'>"+
    "<img src='https://bsginstitute.com/favicon.ico'style='width: 30px; height: 30px;'>"+
    "<div style='display: flex; font-size: 25px; color: #414140; margin-left: 7px;'>"+
    "<div style='letter-spacing: -4px;'>BSG</div>"+
    "<div style='margin-left: 7px;'>Institute</div>"+
    "</div></div>"+
  "<div style='font-weight:bold;font-size:15px;padding-top:20px'>Hola "+this.resultProceso.registroAlumno.nombre+","+
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
    console.log(this.resultProceso)
    console.log(this.resultProceso.registroAlumno)
    var paymentSummary = "";
    let countLista=0
    if(this.resultProceso.listaCuota.length==0){
      paymentSummary += "<div style='display:flex;border-bottom: 1px solid black;padding: 5px 0;'>"+
                            "<div style='font-size:13px;font-weight:100;width: 66%;'>" + 'Matrícula' + "</div>" +
                            "<div style='font-size:13px;width: 33%;text-align:right;'>" + this.resultProceso.montoTotal.toFixed(2) + " " + this.resultProceso.monedaCorreo + "</div></div>";
    }
    else{
      this.resultProceso.listaCuota.forEach((l:any) => {
        if(countLista==0){
          paymentSummary += "<div style='display:flex;border-bottom: 1px solid black;padding: 5px 0;'>"+
                            "<div style='font-size:13px;font-weight:100;width: 66%;'>" + l.nombre + "</div>" +
                            "<div style='font-size:13px;width: 33%;text-align:right;'>" + l.cuotaTotal.toFixed(2) + " " + this.resultProceso.monedaCorreo + "</div></div>";
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
      this.resultProceso.montoTotal.toFixed(2) +" "+this.resultProceso.monedaCorreo+
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
