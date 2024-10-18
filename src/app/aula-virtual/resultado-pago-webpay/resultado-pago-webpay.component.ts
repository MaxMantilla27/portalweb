import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MensajeCorreoDTO } from 'src/app/Core/Models/LibroReclamacionesDTO';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { FormatoMilesDecimalesPipe } from 'src/app/Core/Shared/Pipes/formato-miles-decimales.pipe';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { PasarelaPagoCorreoService } from 'src/app/Core/Shared/Services/PasarelaPagoCorreo/pasarela-pago-correo.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-resultado-pago-webpay',
  templateUrl: './resultado-pago-webpay.component.html',
  styleUrls: ['./resultado-pago-webpay.component.scss'],
  providers: [FormatoMilesDecimalesPipe]
})
export class ResultadoPagoWebpayComponent implements OnInit {

  private signal$ = new Subject()
  constructor(
    private _FormaPagoService:FormaPagoService,
    private _ActivatedRoute:ActivatedRoute,
    public dialog:MatDialog,
    private _SessionStorageService:SessionStorageService,
    private _PasarelaPagoCorreoService:PasarelaPagoCorreoService,
    private FormatoMilesDecimales: FormatoMilesDecimalesPipe,
    private _router:Router,
  ) { }
  public json={
    IdentificadorTransaccion:null,
    TokenComercio:''
  }

  resultProceso:any;
  resultWebpay:any;
  public ruta = '/AulaVirtual/MisPagos'
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
  public correoMatriculas='matriculas@bsginstitute.com'
  public CargandoWebPay=true
  public IdMatriculaCabecera=0;

  ngOnInit(): void {
    this._ActivatedRoute.queryParams.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log("ngOninni")
        this.json.TokenComercio = x['token_ws'];
        if(this.json.TokenComercio==undefined || this.json.TokenComercio==null)
          this.json.TokenComercio = x['TBK_TOKEN'];
        // this.json.IdentificadorTransaccion = null;
        if(this.json.TokenComercio==undefined || this.json.TokenComercio==null || this.json.TokenComercio.length<=1)
          this.json.TokenComercio = this._SessionStorageService.SessionGetValue('token_ws')
        this.ObtenerResultadoProcesopagoWebpay()
      },
    });
  }

  ObtenerPreProcesoPagoOrganicoAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoAlumnoWebPay(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log("RespuetaOtra :",x)
        this.resultProceso=x._Repuesta;
        this.resultProceso.total=0;
        if(this.resultProceso.registroAlumno==null){
          this.resultProceso.registroAlumno=this.resultProceso.datoAlumno
        }
        if(this.resultProceso.estadoOperacion=='Processed'){
          if(this.resultProceso.tipoPago=='Organico'||this.resultProceso.idMatriculaCabecera==0){
            this.RegistrarMatriculaAlumnoOrganico()
          }
          else{
            if(this.resultProceso.idMatriculaCabecera>0 &&
              this.resultProceso.idMatriculaCabecera!=null &&
              this.resultProceso.idMatriculaCabecera!=undefined ){
                this.IdMatriculaCabecera=this.resultProceso.idMatriculaCabecera
                this.rutaPago=this.rutaPago+'/'+this.resultProceso.idMatriculaCabecera
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
        }
        else{
                this.IdMatriculaCabecera=this.resultProceso.idMatriculaCabecera
        }
      },
      error:()=>{
        this.CargandoWebPay=false;
        this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera]);
      },
      complete:()=>{
        this.CargandoWebPay=false;
        this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera]);
      }
    })
  }

  ObtenerResultadoProcesopagoWebpay(){
    let token_ws =(this.json.TokenComercio).toString()
    this._FormaPagoService.ObtenerConfirmacionWebPay(token_ws).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log("RespuestaWEbpay",x)
        this.resultWebpay = x._Repuesta;
        this.IdMatriculaCabecera=this.resultProceso.idMatriculaCabecera
      },
      complete:()=>{
        this.ObtenerPreProcesoPagoOrganicoAlumno()
      }
    })
  }

  redireccionarAPagos(){
    //let url = "https://img.bsgrupo.com/AulaVirtual/MisPagos";
    let url = "https://bsginstitute.com/AulaVirtual/MisPagos";
    window.location.href =url;
  }


  RegistrarMatriculaAlumnoOrganico(){
    console.log(this.json)
    if(this.json.IdentificadorTransaccion==null){
      this.json.IdentificadorTransaccion=this.resultProceso.identificadorTransaccion
    }
    this._FormaPagoService.RegistrarMatriculaAlumnoOrganico(this.json.IdentificadorTransaccion!).pipe(takeUntil(this.signal$)).subscribe({
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
        this.IdMatriculaCabecera=this.Matricula.id
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
