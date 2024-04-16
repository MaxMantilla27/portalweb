import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-compra-exitosa-open-pay-colombia',
  templateUrl: './compra-exitosa-open-pay-colombia.component.html',
  styleUrls: ['./compra-exitosa-open-pay-colombia.component.scss']
})
export class CompraExitosaOpenPayColombiaComponent implements OnInit {
  private signal$ = new Subject();
  isBrowser: boolean;

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _router:Router,
    @Inject(PLATFORM_ID) platformId: Object,
    private dialog:MatDialog
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
      this._FormaPagoService.ProcesamientoAfiliacionColombiaOpenPay(this.id).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)

          this.resultOpenPay = JSON.parse(x._Repuesta.pagoAfiliacion)
          console.log("ResultadoOpen", this.resultOpenPay)

        }
      })
    }
    else{
      this._FormaPagoService.ProcesamientoPagoColombiaOpenPay(this.id).pipe(takeUntil(this.signal$)).subscribe({
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
            if(this.resultVisa.idMatriculaCabecera>0 &&
              this.resultVisa.idMatriculaCabecera!=null &&
              this.resultVisa.idMatriculaCabecera!=undefined ){
                this.rutaPago=this.rutaPago+'/'+this.resultVisa.idMatriculaCabecera
                this.rutaCursos=this.rutaCursos+'/'+this.resultVisa.idMatriculaCabecera
            }
            if(this.resultVisa.estadoOperacion=='Processed')
            {
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
}
