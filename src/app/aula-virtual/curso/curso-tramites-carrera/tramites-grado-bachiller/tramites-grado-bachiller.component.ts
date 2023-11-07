import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { CertificadoService } from 'src/app/Core/Shared/Services/Certificado/certificado.service';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { PagoTarjetaComponent } from 'src/app/aula-virtual/pago/pago-tarjeta/pago-tarjeta.component';

@Component({
  selector: 'app-tramites-grado-bachiller',
  templateUrl: './tramites-grado-bachiller.component.html',
  styleUrls: ['./tramites-grado-bachiller.component.scss']
})
export class TramitesGradoBachillerComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }


  constructor(
    private _HelperService:HelperService,
    private _CertificadoService:CertificadoService,
    public dialog: MatDialog,
    public _FormaPagoService:FormaPagoService,
    private _router:Router,
    private _SessionStorageService:SessionStorageService,
  ) { }

  @Input() IdMatriculaCabecera=0;
  @Output() Volver= new EventEmitter<number>();


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
  ngOnInit(): void {
  }
  Pagar(){
    const dialogRef = this.dialog.open(PagoTarjetaComponent, {
      width: '500px',
      data: { idMatricula: this.IdMatriculaCabecera,tituloBotonModal:'Continuar' },
      panelClass: 'dialog-Tarjeta',
     // disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result);
      if(result!=undefined){
        this.PreProcesoPagoTramiteAlumno(result);
      }
    });
  }

  PreProcesoPagoTramiteAlumno(tarjeta:any){
    const dialogRef =this.dialog.open(ChargeComponent,{
      panelClass:'dialog-charge',
      disableClose:true
    });
    this.jsonSend.ListaCuota=[];
    this.jsonSend.ListaCuota.push({
      IdCuota: 119,
      NroCuota: 0,
      TipoCuota:"1",
      Cuota: 10,
      Mora: 0,
      MoraCalculada: 0,
      CuotaTotal:10,
      Nombre:"Constancia de Nota / Calificación"
    })
    this.jsonSend.IdFormaPago=tarjeta.idFormaPago
    this.jsonSend.IdPasarelaPago=tarjeta.idPasarelaPago
    this.jsonSend.MedioCodigo=tarjeta.medioCodigo
    this.jsonSend.MedioPago=tarjeta.medioPago
    this._FormaPagoService.PreProcesoPagoTramiteAlumno(this.jsonSend).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        dialogRef.close();
        var sesion=x._Repuesta.identificadorTransaccion;
        this._SessionStorageService.SessionSetValue(sesion,x._Repuesta.requiereDatosTarjeta);
        console.log(tarjeta.idFormaPago)
        if(tarjeta.idPasarelaPago==7 || tarjeta.idPasarelaPago==10){
          if(tarjeta.idFormaPago==52){
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/visa/'+sesion]);
          }
          if(tarjeta.idFormaPago==48){
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/tarjeta/'+sesion]);
          }
        }
        if(tarjeta.idPasarelaPago==1 || tarjeta.idPasarelaPago==5){
          this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/tarjeta/'+sesion]);
        }else{
          if(parseInt(tarjeta.idPasarelaPago)==2){
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/wompi/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==6){
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatriculaCabecera+'/conekta/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==3){}
          if(parseInt(tarjeta.idPasarelaPago)==4){}
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
