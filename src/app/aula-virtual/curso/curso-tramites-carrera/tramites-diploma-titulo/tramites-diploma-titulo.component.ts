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

import * as moment  from 'moment';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { CronogramaPagoService } from 'src/app/Core/Shared/Services/CronogramaPago/cronograma-pago.service';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
@Component({
  selector: 'app-tramites-diploma-titulo',
  templateUrl: './tramites-diploma-titulo.component.html',
  styleUrls: ['./tramites-diploma-titulo.component.scss']
})
export class TramitesDiplomaTituloComponent implements OnInit ,OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public select=1
  constructor(
    private _HelperService:HelperService,
    private _CertificadoService:CertificadoService,
    public dialog: MatDialog,
    public _FormaPagoService:FormaPagoService,
    private _router:Router,
    private _SessionStorageService:SessionStorageService,
    private _DatosPerfilService:DatosPerfilService,
    private _CronogramaPagoService:CronogramaPagoService,
    private _ProgramaContenidoService: ProgramaContenidoService,



  ) { }

  @Input() IdMatriculaCabecera=0;
  @Input() TramiteSeleccionado:any;
  @Input() IdPGeneral=0;
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
  public fechaSelec=new Date()
  public fechaMin=new Date()
  public fechaMax=new Date()
  public PagoTotalTramite=0;
  public SimboloMoneda='';
  public InformacionActualizada=false;
  public GradoBachillerCompletado=false;
  public DeudasPendientes=false;
  public ActividadSustentacion=true;
  public HabilitarPago=false
  ngOnInit(): void {
    const hoy = moment(new Date);
    this.fechaSelec=new Date(hoy.add(90,'days').format('YYYY-MM-DD hh:mm:ss a'))
    console.log(this.fechaSelec)
    this.fechaMin=new Date(moment(new Date).add(0,'days').format('YYYY-MM-DD hh:mm:ss a'))
    this.fechaMax=new Date(moment(new Date).add(90,'days').format('YYYY-MM-DD hh:mm:ss a'))
    console.log(this.IdMatriculaCabecera)
    console.log(this.TramiteSeleccionado)
    this.ValidarInformacionActualizada()
    this.CalcularMontoTotal()
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
        if(this.select==1){
          this.CongelarExamenSuficienciaCarrerasProfesionales();
        }
        else{
          this.CongelarTrabajoAplicacionCarrerasProfesionales();
        }
        this._HelperService.enviarActivarTipoExamen(this.select==0?2:1)
        //this.PreProcesoPagoTramiteAlumno(result);
      }
    });
  }

  PreProcesoPagoTramiteAlumno(tarjeta:any){
    const dialogRef =this.dialog.open(ChargeComponent,{
      panelClass:'dialog-charge',
      disableClose:true
    });
    this.jsonSend.ListaCuota=[];
    if(this.TramiteSeleccionado.pagar==true){
      this.jsonSend.ListaCuota.push({
        IdCuota: this.TramiteSeleccionado.idTarifarioDetalle,
        NroCuota: 0,
        TipoCuota: this.TramiteSeleccionado.tipoCantidad,
        Cuota: this.TramiteSeleccionado.tarifario,
        Mora: 0,
        MoraCalculada: 0,
        CuotaTotal: this.TramiteSeleccionado.tarifario,
        Nombre:this.TramiteSeleccionado.concepto
      })
    }
    // this.jsonSend.ListaCuota.push({
    //   IdCuota: 119,
    //   NroCuota: 0,
    //   TipoCuota:"1",
    //   Cuota: 10,
    //   Mora: 0,
    //   MoraCalculada: 0,
    //   CuotaTotal:10,
    //   Nombre:"Constancia de Nota / Calificación"
    // })
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
  CalcularMontoTotal(){
    this.PagoTotalTramite=0;
    this.SimboloMoneda=''
    if(this.TramiteSeleccionado.pagar==true){
      this.PagoTotalTramite=this.PagoTotalTramite+this.TramiteSeleccionado.tarifario;
      this.SimboloMoneda=this.TramiteSeleccionado.codigo
    }
    this.jsonSend.IdPGeneral=this.IdPGeneral
    this.jsonSend.IdMatriculaCabecera=this.IdMatriculaCabecera
    this.jsonSend.Moneda=this.TramiteSeleccionado.moneda
    this.jsonSend.SimboloMoneda=this.TramiteSeleccionado.simboloMoneda
    this.jsonSend.WebMoneda=this.TramiteSeleccionado.webMoneda
  }
  ValidarInformacionActualizada(){
    this._DatosPerfilService.ValidarInformacionActualizada(this.IdMatriculaCabecera).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.InformacionActualizada=x;
      },
      complete:()=>{
        this.ValidarGradoBachillerCompletado()
      }
    })
  }
  ValidarGradoBachillerCompletado(){
    this._DatosPerfilService.ValidarGradoBachillerCompletado(this.IdMatriculaCabecera).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.GradoBachillerCompletado=x;
      },
      complete:()=>{
        this.ValidarDeudasPendientes()
      }
    })
  }

  ValidarDeudasPendientes(){
    this._CronogramaPagoService.ValidacionDeudasPendientesMatricula(this.IdMatriculaCabecera).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.DeudasPendientes=x;
      },
      complete:()=>{
        this.PagoActivo()
      }
    })
  }
  PagoActivo(){
    if(this.InformacionActualizada && this.GradoBachillerCompletado && this.DeudasPendientes && this.ActividadSustentacion){
      this.HabilitarPago=true;
    }
    else{
      this.HabilitarPago=false;
    }
    console.log(this.HabilitarPago)
  }
  CongelarTrabajoAplicacionCarrerasProfesionales(){
    this._ProgramaContenidoService.CongelarTrabajoAplicacionCarrerasProfesionales(this.IdMatriculaCabecera,moment(new Date(this.fechaSelec!)).format('yyyy-MM-DDTHH:mm:ss')).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log('Trabajo de aplicación profesional congelado')
      }
    })
  }
  CongelarExamenSuficienciaCarrerasProfesionales(){
    this._ProgramaContenidoService.CongelarExamenSuficienciaCarrerasProfesionales(this.IdMatriculaCabecera,moment(new Date(this.fechaSelec!)).format('yyyy-MM-DDTHH:mm:ss')).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log('Examen de suficiencia profesional congelado')
      }
    })
  }

}
