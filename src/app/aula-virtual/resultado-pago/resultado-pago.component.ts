import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-resultado-pago',
  templateUrl: './resultado-pago.component.html',
  styleUrls: ['./resultado-pago.component.scss']
})
export class ResultadoPagoComponent implements OnInit {
  private signal$ = new Subject();
  isBrowser: boolean;

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _FormaPagoService:FormaPagoService,
    private _SessionStorageService:SessionStorageService,
    private _router:Router,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId); {}
  }

  public json:RegistroRespuestaPreProcesoPagoDTO={
    IdentificadorTransaccion:'',
    RequiereDatosTarjeta:true
  }
  public resultVisa:any
  public ruta=''
  intentos=0;
  img=1;
  imgAc=''
  ngOnInit(): void {
    if(this.isBrowser){
      this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
        next: (x) => {
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
    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x._Repuesta.registroAlumno==null){
          this.ObtenerPreProcesoPagoOrganicoAlumno()
        }else{
          if(x._Repuesta.estadoOperacion==null){
            this._router.navigate([this.ruta])
          }else{
            this.resultVisa=x._Repuesta;
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
}
