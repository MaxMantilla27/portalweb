import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { ImagenTarjetas } from 'src/app/Core/Shared/ImagenTarjetas';
import { CronogramaPagoService } from 'src/app/Core/Shared/Services/CronogramaPago/cronograma-pago.service';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { PagoTarjetaComponent } from './pago-tarjeta/pago-tarjeta.component';

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
    private _SessionStorageService:SessionStorageService
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
  public idMatricula=0
  public textoBienvenido = '';
  public CronogramaPago:any
  public total=0;
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {

      this.textoBienvenido =x.datosAlumno.nombres+
      ', aquí podrás realizar los pagos de tus cronogramas de cuotas';
    })

    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.idMatricula = parseInt(x['IdMatricula']);
        this.ObtenerCronogramaPagoMatricula()
      },
    });
  }
  ObtenerCronogramaPagoMatricula(){
    this._CronogramaPagoService.ObtenerCronogramaPagoMatricula(this.idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x.cronogramas!=undefined){
          this.CronogramaPago=x.cronogramas.listaCronogramaAlumno
          this.migaPan.push({
            titulo: x.cronogramas.listaCronogramaAlumno.pGeneral,
            urlWeb: '/AulaVirtual/MisPagos/'+this.idMatricula,
          })
        }
        this.jsonSend.IdPGeneral=this.CronogramaPago.idPGeneral
        this.jsonSend.IdMatriculaCabecera=this.CronogramaPago.idMatriculaCabecera
        if(this.CronogramaPago.registroCuota.length>0){
          this.jsonSend.Moneda=this.CronogramaPago.registroCuota[0].moneda
          this.jsonSend.SimboloMoneda=this.CronogramaPago.registroCuota[0].simbolo
          this.jsonSend.WebMoneda=this._t.GetWebMoneda(this.CronogramaPago.registroCuota[0].moneda).toString();
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
  OpenModal(): void {
    const dialogRef = this.dialog.open(PagoTarjetaComponent, {
      width: '600px',
      data: { idMatricula: this.idMatricula },
      panelClass: 'dialog-Tarjeta',
     // disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result);
      if(result!=undefined){
        this.PreProcesoPagoCuotaAlumno(result);
      }
    });
  }
  PreProcesoPagoCuotaAlumno(tarjeta:any){
    const dialogRef =this.dialog.open(ChargeComponent,{
      panelClass:'dialog-charge',
      disableClose:true
    });
    this.CronogramaPago.registroCuota.forEach((r:any) => {
      if(r.estado==true){
        this.jsonSend.ListaCuota.push({
          IdCuota: r.idCuota,
          NroCuota: r.nroCuota,
          TipoCuota: r.tipoCuota,
          Cuota: r.cuota,
          Mora: r.mora,
          MoraCalculada: r.moraCalculada,
          CuotaTotal: r.cuota+r.moraCalculada,
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
        if(this.jsonSend.MedioCodigo.toLowerCase()=='vs'){
          this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/visa/'+sesion]);
        }else{
          this._router.navigate(['/AulaVirtual/MisPagos/'+this.idMatricula+'/tarjeta/'+sesion]);
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
