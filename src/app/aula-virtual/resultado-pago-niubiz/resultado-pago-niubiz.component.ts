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
  selector: 'app-resultado-pago-niubiz',
  templateUrl: './resultado-pago-niubiz.component.html',
  styleUrls: ['./resultado-pago-niubiz.component.scss'],
  providers: [FormatoMilesDecimalesPipe]
})
export class ResultadoPagoNiubizComponent implements OnInit {
  private signal$ = new Subject();
  isBrowser: boolean;

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _router:Router,
    @Inject(PLATFORM_ID) platformId: Object,
    private _PasarelaPagoCorreoService:PasarelaPagoCorreoService,
    private FormatoMilesDecimales: FormatoMilesDecimalesPipe
  ) {
    this.isBrowser = isPlatformBrowser(platformId); {}
  }
  public RutaCargada=false;

  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public resultVisa:any
  public ruta=''
  public rutaMisCursos='/AulaVirtual/MisCursos'
  public AreaCapacitacion=''
  public ProgramaNombre=''
  intentos=0;
  img=1;
  imgAc=''
  public rutaPago='/AulaVirtual/MisPagos'
  public rutaCursos = '/AulaVirtual/MisCursos'
  public jsonCorreo: MensajeCorreoDTO = {
    Asunto: '',
    Contenido: '',
    Destinatario: '',
  };
  pipe = new DatePipe('es')
  public Matricula:any;
  public NombreCursoPago=''
  public CodigoMatricula=''
  public correoMatriculas='matriculas@bsginstitute.com'
  public IdentificadorTransaccion='';
  ngOnInit(): void {
    if(this.isBrowser){
      this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
        next: (x) => {
          this.IdentificadorTransaccion = x['Identificador'];
          this.ProcesarPagoTokenizado()
        },
      });
    }
  }


  ProcesarPagoTokenizado(){
    this.ruta='/AulaVirtual/MisPagos'
    let comprobanteString = this._SessionStorageService.SessionGetValue('comprobante')
    let json={
      IdentificadorTransaccion:this.IdentificadorTransaccion,
      RequiereDatosTarjeta:true
    }

    this._FormaPagoService.RegistroPagoCuotaAlumnoVisaProcesarToken(this.IdentificadorTransaccion).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        // this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(json).pipe(takeUntil(this.signal$)).subscribe({
        //   next:x=>{
        //     this.resultVisa=x._Repuesta
        //   },
        //   complete:()=>{
        //     if(this.resultVisa.estadoOperacion=='Processed'){
        //       if(this.resultVisa.tipoPago=='Organico'||this.resultVisa.idMatriculaCabecera==0){
        //         this.RegistrarMatriculaAlumnoOrganico()
        //       }
        //       else{
        //         if(this.resultVisa.idMatriculaCabecera>0 &&
        //           this.resultVisa.idMatriculaCabecera!=null &&
        //           this.resultVisa.idMatriculaCabecera!=undefined ){
        //             this.rutaPago=this.rutaPago+'/'+this.resultVisa.idMatriculaCabecera
        //             this.rutaCursos=this.rutaCursos+'/'+this.resultVisa.idMatriculaCabecera
        //             this.CodigoMatricula=this.resultVisa.codigoMatricula
        //             if(this.resultVisa.nombrePrograma==null || this.resultVisa.nombrePrograma=='null' || this.resultVisa.nombrePrograma==undefined){
        //               this.NombreCursoPago='';
        //             }
        //             else{
        //               this.NombreCursoPago=this.resultVisa.nombrePrograma
        //             }
        //         }
        //         this.RutaCargada=true;
        //       }
        //       var valor:any
        //       let objComprobante = JSON.parse(comprobanteString)

        //       objComprobante.listaCuota.forEach((l:any) => {
        //         if(valor==undefined){
        //           valor=l
        //         }else{
        //           if(valor.nroCuota<l.nroCuota){
        //             valor=l
        //           }
        //         }
        //       });
        //       objComprobante.listaCuota = [valor]
        //       this._FormaPagoService.actualizarComprobantePagoLista(objComprobante).pipe(takeUntil(this.signal$)).subscribe({
        //         next:x=>{
        //         }
        //       })
        //     }
        //     if(this.resultVisa.estadoOperacion =='No Process' ||
        //       this.resultVisa.estadoOperacion =='Declinado'){
        //     }
        //   }
        // })
      }
    })
  }
  RedireccionarModalIntentoPago(){
    this._SessionStorageService.SessionSetValue('urlRedireccionErrorPagoModal','true');
    this._router.navigate(['/'+ this.AreaCapacitacion + '/' + this.ProgramaNombre])
  }

  RegistrarMatriculaAlumnoOrganico(){
    this._FormaPagoService.RegistrarMatriculaAlumnoOrganico(this.IdentificadorTransaccion).pipe(takeUntil(this.signal$)).subscribe({
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
    console.log(this.resultVisa)
    console.log(this.resultVisa.registroAlumno)
    var paymentSummary = "";
    let countLista=0
    if(this.resultVisa.listaCuota.length==0){
      paymentSummary += "<div style='display:flex;border-bottom: 1px solid black;padding: 5px 0;'>"+
                            "<div style='font-size:13px;font-weight:100;width: 66%;'>" + 'Matrícula' + "</div>" +
                            "<div style='font-size:13px;width: 33%;text-align:right;'>" + this.FormatoMilesDecimales.transform(this.resultVisa.montoTotal) + " " + this.resultVisa.monedaCorreo + "</div></div>";
    }
    else{
      this.resultVisa.listaCuota.forEach((l:any) => {
        if(countLista==0){
          paymentSummary += "<div style='display:flex;border-bottom: 1px solid black;padding: 5px 0;'>"+
                            "<div style='font-size:13px;font-weight:100;width: 66%;'>" + this.reemplazarRazonPago(l.nombre) + "</div>" +
                            "<div style='font-size:13px;width: 33%;text-align:right;'>" + this.FormatoMilesDecimales.transform(l.cuotaTotal) + " " + this.resultVisa.monedaCorreo + "</div></div>";
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
      this.FormatoMilesDecimales.transform(this.resultVisa.montoTotal) +" "+this.resultVisa.monedaCorreo+
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

