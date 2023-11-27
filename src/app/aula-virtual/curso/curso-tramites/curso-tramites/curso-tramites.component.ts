import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PagoTarjetaComponent } from 'src/app/aula-virtual/pago/pago-tarjeta/pago-tarjeta.component';
import { RegistroPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-curso-tramites',
  templateUrl: './curso-tramites.component.html',
  styleUrls: ['./curso-tramites.component.scss']
})
export class CursoTramitesComponent implements OnInit,OnDestroy {

  private signal$ = new Subject();
  constructor(
    private _DatosPerfilService: DatosPerfilService,
    public dialog: MatDialog,
    public _FormaPagoService:FormaPagoService,
    private _router:Router,
    private _SessionStorageService:SessionStorageService,
    private _HelperService:HelperService
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  @Input() Capitulo='';
  @Input() IdMatricula=0;
  @Input() idPGeneral=0;
  public TramitesCurso:Array<any>=[];
  public PagoTotalTramite=0;
  public SimboloMoneda='';
  public tramitesSolicitado:any
  public charge=false

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
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdMatricula!=0 && !this.charge){
      this.ObtenerTramitesSolicitadosPorMatricula();
      this.CalcularMontoTotal();
      this.ObtenerTramitesMatricula()
    }
  }
  ObtenerTramitesSolicitadosPorMatricula(){
    this.charge=true
    this._DatosPerfilService.ObtenerTramitesSolicitadosPorMatricula(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x);
        this.tramitesSolicitado=x;
      }
    })
  }
  ObtenerTramitesMatricula(){
    this._DatosPerfilService.ListaTramiteAdministrativoProgramaMatriculadoRegistrado(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.TramitesCurso=x;
        this.TramitesCurso.forEach((y:any)=>{
          y.pagar=false;
        })

        this.jsonSend.IdPGeneral=this.idPGeneral
        this.jsonSend.IdMatriculaCabecera=this.IdMatricula
        if(this.TramitesCurso.length>0){
          this.jsonSend.Moneda=this.TramitesCurso[0].moneda
          this.jsonSend.SimboloMoneda=this.TramitesCurso[0].simboloMoneda
          this.jsonSend.WebMoneda=this.TramitesCurso[0].webMoneda
        }
      }
    })
  }
  CalcularMontoTotal(){
    this.PagoTotalTramite=0;
    this.SimboloMoneda=''
    this.TramitesCurso.forEach((y:any)=>{
      if(y.pagar==true){
        this.PagoTotalTramite=this.PagoTotalTramite+y.tarifario;
        this.SimboloMoneda=y.simboloMoneda
      }
    })
  }
  cambiarEstadoPago(i:number){
    console.log(this.TramitesCurso[i].pagar)
    this.CalcularMontoTotal();
  }
  Pagar(){
    const dialogRef = this.dialog.open(PagoTarjetaComponent, {
      width: '600px',
      data: { idMatricula: this.IdMatricula },
      panelClass: 'dialog-Tarjeta',
     // disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result);
      if(result!=undefined){
        this.EventoInteraccionButton('Ir a pagar')
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
    this.TramitesCurso.forEach((r:any) => {
      if(r.pagar==true){
        this.jsonSend.ListaCuota.push({
          IdCuota: r.idTarifarioDetalle,
          NroCuota: 0,
          TipoCuota: r.tipoCantidad,
          Cuota: r.tarifario,
          Mora: 0,
          MoraCalculada: 0,
          CuotaTotal: r.tarifario,
          Nombre:r.concepto
        })
      }
    });
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
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatricula+'/visa/'+sesion]);
          }
          if(tarjeta.idFormaPago==48){
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatricula+'/tarjeta/'+sesion]);
          }
        }
        if(tarjeta.idPasarelaPago==1 || tarjeta.idPasarelaPago==5){
          this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatricula+'/tarjeta/'+sesion]);
        }else{
          if(parseInt(tarjeta.idPasarelaPago)==2){
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatricula+'/wompi/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==6){
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatricula+'/conekta/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==11){
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatricula+'/webpay/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==13){
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatricula+'/izipay/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==16){
            //this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatricula+'/openpayCOP/'+sesion]);
          }
          if(parseInt(tarjeta.idPasarelaPago)==17){//Mercado Pago
            this._router.navigate(['/AulaVirtual/MisPagos/'+this.IdMatricula+'/mercadoPago/'+sesion]);
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
  EventoInteraccionCheckBox(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Checkbox',Nombre:nombre,Seccion:'Tramites'})
  }
  EventoInteraccionButton(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:"Button",Nombre:nombre,Seccion:'Tramites'})
  }
}
