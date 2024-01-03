import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { AprovacionComponent } from 'src/app/Core/Shared/Containers/Dialog/aprovacion/aprovacion.component';
import { ChargeTextComponent } from 'src/app/Core/Shared/Containers/Dialog/charge-text/charge-text.component';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { ImagenTarjetas } from 'src/app/Core/Shared/ImagenTarjetas';
import { CronogramaPagoService } from 'src/app/Core/Shared/Services/CronogramaPago/cronograma-pago.service';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { MedioPagoActivoPasarelaService } from 'src/app/Core/Shared/Services/MedioPagoActivoPasarela/medio-pago-activo-pasarela.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { PagoTarjetaComponent } from './pago-tarjeta/pago-tarjeta.component';
import { DatePipe } from '@angular/common';

const pipe = new DatePipe('en-US')

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss'],
})
export class PagoComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _HelperService: HelperService,
    private _CronogramaPagoService:CronogramaPagoService,
    private _ActivatedRoute:ActivatedRoute,
    private _SnackBarServiceService:SnackBarServiceService,
    public dialog: MatDialog,
    public _FormaPagoService:FormaPagoService,
    private _t:ImagenTarjetas,
    private _router:Router,
    private _SessionStorageService:SessionStorageService,
    private _MedioPagoActivoPasarelaService:MedioPagoActivoPasarelaService,
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public migaPan = [
    {
      titulo: 'Mis pagos',
      urlWeb: '/AulaVirtual/MisPagos',
    }
  ];
  public jsonSend:RegistroPreProcesoPagoDTO={
    IdFormaPago:0,
    IdMatriculaCabecera:0,
    IdPasarelaPago:0,
    IdPGeneral:0,
    ListaCuota:[],
    MedioCodigo:'',
    MedioPago:'',
    Moneda:'',
    SimboloMoneda:'',
    WebMoneda:'',
  }
  public idPasarela:number=0
  public dialogRef:any
  public idMatricula=0
  public textoBienvenido = '';
  public CronogramaPago:any
  public total=0;
  public EstadoAfiliado:any;
  public idPais=0
  public email=""
  public idAlumno:any=0
  public tarjetas:any;
  public validadorPagosMultiples:any;
  public medioPagoSeleccionado:any;

  ngOnInit(): void {
    let i=0
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.textoBienvenido = x.datosAlumno.nombres+
      ', aquí podrás realizar los pagos de tus cronogramas de cuotas';
      this.email =x.datosAlumno.email
      this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
        next: (param) => {
          if(i==0){
            this.idMatricula = parseInt(param['IdMatricula']);
            this.idPais = x.datosAlumno.idPais
            this.ObtenerPasarela()
            this.ObtenerCronogramaPagoMatricula()
            i++
          }
        },
      });
      this.obtenerTarjetas();
    })

  }

  EliminarAfiliacion(){
    this.dialogRef =this.dialog.open(ChargeTextComponent,{
      panelClass:'dialog-charge-text',
      data: { text: 'Procesando Desafiliación' },
      disableClose:true
    });
    this._FormaPagoService.EliminarSuscripcion(this.idMatricula,this.idPasarela).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log("RespuestaEliminacion :",x)
        console.log(x._Repuesta.estadoOperacion)
        if(x._Repuesta.estadoOperacion==true)
        {
          this.VerificarEstadoAfiliacion()
        }
        else{
          this.dialogRef.close()
          this._SnackBarServiceService.openSnackBar("Lo sentimos, ocurrio un error al tratar de eliminar la afiliación.",'x',10,"snackbarCrucigramaerror");
        }
      }
    })
  }

  VerificarEstadoAfiliacion(){
    if(this.idPais==51 || this.idPais==52 || this.idPais==57)
      {
        this._FormaPagoService.ValidacionSuscripcion(this.idMatricula,this.idPasarela).pipe(takeUntil(this.signal$)).subscribe({
          next:x=>{
            if(x._Repuesta!="ERROR")
            {
              this.EstadoAfiliado = x._Repuesta;
              if(this.dialogRef!=undefined) this.dialogRef.close()
            }
            else{
              this._SnackBarServiceService.openSnackBar("Lo sentimos, ocurrio un error al verificar el estado de afiliación.",'x',10,"snackbarCrucigramaerror");
              if(this.dialogRef!=undefined) this.dialogRef.close()
            }
          }
        })
      }
  }
  ObtenerCronogramaPagoMatricula(){
    this._CronogramaPagoService.ObtenerCronogramaPagoMatricula(this.idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x.cronogramas!=undefined){
          this.CronogramaPago=x.cronogramas.listaCronogramaAlumno
          this.idAlumno = this.CronogramaPago.idAlumno

          this.migaPan.push({
            titulo: x.cronogramas.listaCronogramaAlumno.pGeneral,
            urlWeb: '/AulaVirtual/MisPagos/'+this.idMatricula,
          })
        }
        this.jsonSend.IdPGeneral=this.CronogramaPago.idPGeneral
        this.jsonSend.IdMatriculaCabecera=this.CronogramaPago.idMatriculaCabecera
        if(this.CronogramaPago.registroCuota.length>0){
          this.jsonSend.Moneda=this.CronogramaPago.registroCuota[0].nombreMoneda
          this.jsonSend.SimboloMoneda=this.CronogramaPago.registroCuota[0].simbolo
          this.jsonSend.WebMoneda=this.CronogramaPago.registroCuota[0].webMoneda;
        }
      }
    })
  }
  ChangeEstadoCronograma(index:number){
    var select=this.CronogramaPago.registroCuota[index];
    if(select.cancelado!=true){
      if(select.estado==true){
        let i=0;
        this.CronogramaPago.registroCuota.forEach((r:any) => {
          if(i>=index){
            r.estado=false
          }
          i++
        });
      }else{
        if(index>0){
          var ant=this.CronogramaPago.registroCuota[index-1];
          if(ant.cancelado==true){
            select.estado=true;
          }else{
            if(ant.estado==true){
              select.estado=true;
            }else{
              this._SnackBarServiceService.openSnackBar("Lo sentimos, debes pagar la cuota anterior para poder pagar la siguiente.",'x',10,"snackbarCrucigramaerror");
            }
          }
        }else{
          select.estado=true
        }
      }
    }
    this.sumarMotos()
  }

  sumarMotos(){
    this.total=0
    this.CronogramaPago.registroCuota.forEach((r:any) => {
      if(r.estado==true){
        this.total+=r.cuota
      }
    });
  }
  ObtenerPasarela(){
    this._MedioPagoActivoPasarelaService.MedioPagoPasarelaPortalRecurrente(this.idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log("tarjeta",x)
        this.idPasarela=x[0].idPasarelaPago?x[0].idPasarelaPago:0

        this.VerificarEstadoAfiliacion()

      },
      error:e=>{
        console.log(e)
        this.idPasarela=0
      }
    })
  }
  onChangeRadioButton(event:any){
    this.medioPagoSeleccionado=event;
  }
  OpenModal(): void {
    console.log("Medio Pago",this.medioPagoSeleccionado)
    if(this.medioPagoSeleccionado!=undefined){
      this.jsonSend.ListaCuota=[]
      this.PreProcesoPagoCuotaAlumnoV2(this.medioPagoSeleccionado);
    }
    //jaj const dialogRef = this.dialog.open(PagoTarjetaComponent, {
    //   width: '600px',
    //   data: { idMatricula: this.idMatricula },
    //   panelClass: 'dialog-Tarjeta',
    //  // disableClose:true
    // });

    // dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
    //   console.log("preprocesoPago",result);
    //   if(result!=undefined){
    //     this.jsonSend.ListaCuota=[]
    //     this.PreProcesoPagoCuotaAlumno(result);
    //   }
    // });
  }
  obtenerTarjetas(){
    this._MedioPagoActivoPasarelaService.MedioPagoPasarelaPortalCronograma(this.idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.validadorPagosMultiples = x.filter((item:any) => item.idPasarelaPago === 7 || item.idPasarelaPago === 18 || item.idPasarelaPago === 10);

        this.tarjetas=x
        this.tarjetas.forEach((e:any) => {
          e.img=this._t.GetTarjeta(e.medioCodigo)
        });
        console.log("Tarjetas por alumno",this.tarjetas)
      }
    })
  }

  OpenModalMetodoPagoSucripcion(): void {
    var fechaActual = new Date();
    var fechaVencimiento = new Date();
    var stringActual= pipe.transform(new Date(), 'yyyy-MM-ddT00:00:00.000')
    var stringVencimiento= pipe.transform(new Date(this.CronogramaPago.fechaVencimiento), 'yyyy-MM-ddT00:00:00.000')
    if(stringActual)fechaActual=new Date(stringActual)
    if(stringVencimiento)fechaVencimiento=new Date(stringVencimiento)
    if(fechaActual <= fechaVencimiento)
    {
      let validador=0
      // if(this.idPasarela==5){ //OpenPay
      //   let count=0
      //   let cuotaBase=0
      //   let fechaBase = new Date();
      //   this.CronogramaPago.registroCuota.forEach((e:any) => {
      //     if(e.cancelado==false){
      //       if(count==0){
      //         cuotaBase = e.cuota+e.moraCalculada
      //         fechaBase = new Date(e.fechaVencimiento)
      //       }
      //       let cuotaTotal:number =e.cuota+e.moraCalculada
      //       if(cuotaBase!==cuotaTotal)validador=1
      //       if(new Date(e.fechaVencimiento).getDate()!=fechaBase.getDate())validador=2
      //       count++
      //     }

      //   });
      // }

      if(validador==2)
      {
        this._SnackBarServiceService.openSnackBar(
          "Lo sentimos, no puedes afiliarte al pago Recurrente, no todas las cuotas pendientes se pagan el mismo día de afiliación",
          'x',
          10,
          "snackbarCrucigramaerror");
      }
      else if(validador==1)
      {
        this._SnackBarServiceService.openSnackBar(
          "Lo sentimos, no puedes afiliarte al pago Recurrente, no todas las cuotas pendientes tiene el mismo monto",
          'x',
          10,
          "snackbarCrucigramaerror");
      }
      else if(validador==0)
      {
        const dialogRef = this.dialog.open(PagoTarjetaComponent, {

          width: '600px',
          data: { idMatricula: this.idMatricula,tituloBotonModal:'Ir a afiliarse',tipo:"AF"},
          panelClass: 'dialog-Tarjeta',
         // disableClose:true
        });

        dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
          console.log("Suscripcion",result);
          if(result!=undefined){
            this.jsonSend.ListaCuota=[]
            this.PreProcesoAfiliacionPagoRecurrente(result);
          }
        });
      }
    }
    else{
      this._SnackBarServiceService.openSnackBar("Lo sentimos, para afiliarte al pago recurrente es obligatorio estar al dia con los pagos cronograma.",'x',10,"snackbarCrucigramaerror");
    }

  }

  OpenModalEliminarSuscripcion(): void {
    const dialogRef = this.dialog.open(AprovacionComponent, {
      width: '600px',
      data: { contenido: "¿Está seguro de desafiliarse de los pagos recurrentes?" },
      panelClass: 'dialog-Tarjeta',
     // disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      if(result!=undefined){
        if(result==true) this.EliminarAfiliacion()
      }
    });
  }



  PreProcesoAfiliacionPagoRecurrente(tarjeta:any){
    this.CronogramaPago.registroCuota.forEach((r:any) => {
      if(r.cancelado==false){
        var fecha=new Date(r.fechaVencimiento);
        this.jsonSend.ListaCuota.push({
          IdCuota: r.idCuota,
          NroCuota: r.nroCuota,
          TipoCuota: r.tipoCuota,
          Cuota: r.cuota,
          Mora: r.mora,
          MoraCalculada: r.moraCalculada,
          CuotaTotal: r.cuota+r.moraCalculada,
          FechaVencimiento:r.fechaVencimiento,
          Nombre:'Cuota N°'+r.nroCuota+' - '+ ('0' + fecha.getUTCDate()).slice(-2)+ "/" +("0" + (fecha.getUTCMonth()+1)).slice(-2) + "/" +fecha.getUTCFullYear()
        })
      }
    });
    this.jsonSend.IdFormaPago=tarjeta.idFormaPago
    this.jsonSend.IdPasarelaPago=tarjeta.idPasarelaPago
    this.jsonSend.MedioCodigo=tarjeta.medioCodigo
    this.jsonSend.MedioPago=tarjeta.medioPago
      const dialogRef =this.dialog.open(ChargeComponent,{
        panelClass:'dialog-charge',
        disableClose:true
      });
      this._FormaPagoService.PreProcesoAfiliacionAlumno(this.jsonSend).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          dialogRef.close();
          var sesion=x._Repuesta.identificadorTransaccion;
          this._SessionStorageService.SessionSetValue(sesion,x._Repuesta.requiereDatosTarjeta);
          console.log(parseInt(tarjeta.idPasarelaPago))

          if(tarjeta.idPasarelaPago==5 || tarjeta.idPasarelaPago==16){ //OpenPay
            this._router.navigate(['/AulaVirtual/MisPagos/Afiliacion/'+this.idMatricula+'/openpay/'+sesion]);
          }
          else if(tarjeta.idPasarelaPago==7){ //visa
            if(tarjeta.idFormaPago==52){
              this._router.navigate(['/AulaVirtual/MisPagos/Afiliacion/'+this.idMatricula+'/visa/'+sesion]);
            }
          }
          else if(tarjeta.idPasarelaPago==13){ //IziPay
              this._router.navigate(['/AulaVirtual/MisPagos/Afiliacion/'+this.idMatricula+'/izipay/'+sesion]);
          }
        },
        complete:()=>{
          dialogRef.close();
        },
        error:e=>{
          console.log(e)
          dialogRef.close();
        }
      })

  }

  PreProcesoPagoCuotaAlumnoV2(tarjeta:any){
    this.CronogramaPago.registroCuota.forEach((r:any) => {
      if(r.estado==true){
        var fecha=new Date(r.fechaVencimiento);
        this.jsonSend.ListaCuota.push({
          IdCuota: r.idCuota,
          NroCuota: r.nroCuota,
          TipoCuota: r.tipoCuota,
          Cuota: r.cuota,
          Mora: r.mora,
          MoraCalculada: r.moraCalculada,
          CuotaTotal: r.cuota+r.moraCalculada,
          FechaVencimiento:r.fechaVencimiento,
          Nombre:'Cuota N°'+r.nroCuota+' - '+ ('0' + fecha.getUTCDate()).slice(-2)+ "/" +("0" + (fecha.getUTCMonth()+1)).slice(-2) + "/" +fecha.getUTCFullYear()
        })
      }
    });
    this.jsonSend.IdFormaPago=tarjeta.idFormaPago
    this.jsonSend.IdPasarelaPago=tarjeta.idPasarelaPago
    this.jsonSend.MedioCodigo=tarjeta.medioCodigo
    this.jsonSend.MedioPago=tarjeta.medioPago
    this._FormaPagoService.PreProcesoPagoCuotaAlumno(this.jsonSend).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        var sesion=x._Repuesta.identificadorTransaccion;
        this._SessionStorageService.SessionSetValue(sesion,x._Repuesta.requiereDatosTarjeta);
        console.log(parseInt(tarjeta.idPasarelaPago))
        if(tarjeta.idPasarelaPago==7 || tarjeta.idPasarelaPago==10){
          if(tarjeta.idFormaPago==52){
            console.log('/AulaVirtual/MisPagos/'+this.idMatricula+'/visa/'+sesion)
            // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/visa/'+sesion]);
          }
          if(tarjeta.idFormaPago==48){
            console.log('/AulaVirtual/MisPagos/'+this.idMatricula+'/tarjeta/'+sesion)
            // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/tarjeta/'+sesion]);
          }
        }
        if(tarjeta.idPasarelaPago==1 || tarjeta.idPasarelaPago==5){
          console.log('/AulaVirtual/MisPagos/'+this.idMatricula+'/tarjeta/'+sesion)
          // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/tarjeta/'+sesion]);
        }
        else{
          if(parseInt(tarjeta.idPasarelaPago)==2){
            console.log('/AulaVirtual/MisPagos/'+this.idMatricula+'/wompi/'+sesion)
            // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/wompi/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==6){
            console.log('/AulaVirtual/MisPagos/'+this.idMatricula+'/conekta/'+sesion)
            // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/conekta/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==3){}
          if(parseInt(tarjeta.idPasarelaPago)==4){
            console.log('/AulaVirtual/MisPagos/'+this.idMatricula+'/multipago/'+sesion)
            // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/multipago/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==11){
            console.log('/AulaVirtual/MisPagos/'+this.idMatricula+'/webpay/'+sesion)
            // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/webpay/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==12){
            console.log(this.total)
            if(this.total>=50)
            console.log('/AulaVirtual/MisPagos/'+this.idMatricula+'/klap/'+sesion)
            // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/klap/'+sesion]);
            else
            this._SnackBarServiceService.openSnackBar("Lo sentimos, para iniciar un pago con Klap el monto mínimo es de 50 pesos.",'x',10,"snackbarCrucigramaerror");
          }
          if(parseInt(tarjeta.idPasarelaPago)==13){
            console.log('/AulaVirtual/MisPagos/'+this.idMatricula+'/izipay/'+sesion)
            // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/izipay/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==16){
            console.log('/AulaVirtual/MisPagos/'+this.idMatricula+'/openpayCOP/'+sesion)
            // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/openpayCOP/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==17){//Mercado Pago
            console.log('/AulaVirtual/MisPagos/'+this.idMatricula+'/mercadoPago/'+sesion)
            // this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/mercadoPago/'+sesion]);
          }
        }
      }
    })
  }

  PreProcesoPagoCuotaAlumno(tarjeta:any){
    const dialogRef =this.dialog.open(ChargeComponent,{
      panelClass:'dialog-charge',
      disableClose:true
    });
    this.CronogramaPago.registroCuota.forEach((r:any) => {
      if(r.estado==true){
        var fecha=new Date(r.fechaVencimiento);
        this.jsonSend.ListaCuota.push({
          IdCuota: r.idCuota,
          NroCuota: r.nroCuota,
          TipoCuota: r.tipoCuota,
          Cuota: r.cuota,
          Mora: r.mora,
          MoraCalculada: r.moraCalculada,
          CuotaTotal: r.cuota+r.moraCalculada,
          FechaVencimiento:r.fechaVencimiento,
          Nombre:'Cuota N°'+r.nroCuota+' - '+ ('0' + fecha.getUTCDate()).slice(-2)+ "/" +("0" + (fecha.getUTCMonth()+1)).slice(-2) + "/" +fecha.getUTCFullYear()
        })
      }
    });
    this.jsonSend.IdFormaPago=tarjeta.idFormaPago
    this.jsonSend.IdPasarelaPago=tarjeta.idPasarelaPago
    this.jsonSend.MedioCodigo=tarjeta.medioCodigo
    this.jsonSend.MedioPago=tarjeta.medioPago
    this._FormaPagoService.PreProcesoPagoCuotaAlumno(this.jsonSend).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        dialogRef.close();
        var sesion=x._Repuesta.identificadorTransaccion;
        this._SessionStorageService.SessionSetValue(sesion,x._Repuesta.requiereDatosTarjeta);
        console.log(parseInt(tarjeta.idPasarelaPago))
        if(tarjeta.idPasarelaPago==7 || tarjeta.idPasarelaPago==10){
          if(tarjeta.idFormaPago==52){
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/visa/'+sesion]);
          }
          if(tarjeta.idFormaPago==48){
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/tarjeta/'+sesion]);
          }
        }
        if(tarjeta.idPasarelaPago==1 || tarjeta.idPasarelaPago==5){
          this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/tarjeta/'+sesion]);
        }else{
          if(parseInt(tarjeta.idPasarelaPago)==2){
            console.log(1)
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/wompi/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==6){
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/conekta/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==3){}
          if(parseInt(tarjeta.idPasarelaPago)==4){

            this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/multipago/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==11){
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/webpay/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==12){
            console.log(this.total)
            if(this.total>=50)
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/klap/'+sesion]);
            else
            this._SnackBarServiceService.openSnackBar("Lo sentimos, para iniciar un pago con Klap el monto mínimo es de 50 pesos.",'x',10,"snackbarCrucigramaerror");
            //
          }
          if(parseInt(tarjeta.idPasarelaPago)==13){
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/izipay/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==16){
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/openpayCOP/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==17){//Mercado Pago
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/mercadoPago/'+sesion]);
          }
        }
      },
      complete:()=>{
        dialogRef.close();
      },
      error:e=>{
        console.log(e)
        dialogRef.close();
      }
    })
  }
}
