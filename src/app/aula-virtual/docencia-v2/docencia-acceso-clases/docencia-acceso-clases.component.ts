import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { ProgramaEspecificoIntegraService } from 'src/app/Core/Shared/Services/ProgramaEspecificoIntegra/programa-especifico-integra.service';
import { RegistrarAsistenciaOnlineComponent } from '../../docencia-v2-cursos-online/administrar-sesion/registrar-asistencia-online/registrar-asistencia-online.component';
import { MatDialog } from '@angular/material/dialog';
import { ProveedorService } from 'src/app/Core/Shared/Services/Proveedor/proveedor.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { Router } from '@angular/router';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import * as moment from 'moment';

@Component({
  selector: 'app-docencia-acceso-clases',
  templateUrl: './docencia-acceso-clases.component.html',
  styleUrls: ['./docencia-acceso-clases.component.scss']
})
export class DocenciaAccesoClasesComponent implements OnInit,OnChanges,OnDestroy {
  private signal$ = new Subject();

  columnHeader:any =  {
    'fechaHoraInicio': 'Fecha',
    'tipo':'Tipo',
    'cursoNombre': 'Nombre Curso Específico' ,
    'HoraInicio': 'Hora Inicio',
    'HoraFinal': 'Hora Fin',
    'ses': 'Sesión'};

  TipoContenido:any={
    fechaHoraInicio: ['date'],
    'HoraInicio': ['hora'],
    'HoraFinal': ['hora'],
    //'Acciones': ['buttons'],
  }
  EsButton:any={
    'cursoNombre': true
  }
  tableData: any;
  public Actual:any
  public interval:any
  OpenProx=true
  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.signal$.next(true)
    this.signal$.complete()
  }
  constructor(
    private _ProgramaEspecificoIntegraService:ProgramaEspecificoIntegraService,
    private _DatosPerfilService:DatosPerfilService,
    public dialog: MatDialog,
    private _ProveedorService:ProveedorService,
    private router:Router,
    private _SessionStorageService:SessionStorageService,
    private _SnackBarServiceService: SnackBarServiceService,
  ) { }
  @Input() IdProveedor=0;
  public TerminaCarga=false
  public DataProveedor:any
  public ZonaHorariaOrigenWebex:any
  public ZonaHorariaUsuario:any
  public CodigoIsoPaisWebex='PE'
  ngOnInit(): void {
    this.TerminaCarga=false
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.IdProveedor)
    if(this.IdProveedor>0){
      this.TerminaCarga=false;
      this.ObtenerSesionesOnlineWebinarDocente()
      this.ObtenerInformacionProveedor();
    }
  }
  IrAcurso(e:any){
    console.log(e)
    console.log(this.tableData[e])
    if(this.tableData[e].tipo=='Webinar'){
      this._SnackBarServiceService.openSnackBar("Las sesiones de tipo webinar no se configuran ",'x',15,"snackbarCrucigramaerror");
    }else{
      this._SessionStorageService.SessionSetValue('docenciaCursos','0');
      this._SessionStorageService.SessionSetValue("SesionSelect",this.tableData[e].orden)
      this.router.navigate(['/AulaVirtual/DocenciaV2/'+this.tableData[e].idPEspecificoHijo]);
    }
  }
  ObtenerSesionesOnlineWebinarDocente(){
    this._DatosPerfilService.ObtenerSesionesOnlineWebinarDocente().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)

        this.tableData=[]
        this.Actual=[]
        var primero=true
        var i=0
        x.forEach((s:any) => {
          if(s.claseActiva==true || s.esVisible==true){
            i++
            s.Sesion=i;
          }
          if(s.esVisible==true){
            var f=new Date(s.fechaHoraInicio);
            f.setMinutes(f.getMinutes()+(s.duracion*60))
            s.fechaHoraFinal=f

            if(primero==true){
              console.log(s)
              this.CodigoIsoPaisWebex=s.codigoIso;
              console.log(this.CodigoIsoPaisWebex)
              this.ObtenerDatosZonaHoraria()
              let HoraWebexOriginal = moment.tz(s.fechaHoraInicio, this.ZonaHorariaOrigenWebex);
              let HoraWebexUsuario = HoraWebexOriginal.clone().tz(this.ZonaHorariaUsuario);
              let HoraActualUsuario = moment().tz(this.ZonaHorariaUsuario);
              let mismoAnioMesDia = HoraWebexUsuario.year() === HoraActualUsuario.year() &&
              HoraWebexUsuario.month() === HoraActualUsuario.month() &&
              HoraWebexUsuario.date() === HoraActualUsuario.date();

              // let f1=new Date((new Date(s.fechaHoraInicio)).getFullYear(),(new Date(s.fechaHoraInicio)).getMonth(),(new Date(s.fechaHoraInicio)).getDate());
              // let f2=new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate());


              // if(+f1==+f2){
              if(mismoAnioMesDia){
                this.Actual.push(s)
              }else{
              // if(this.proximoW.length>0){
              //   this.tableData.push(s)
              // }else{
              //   this.proximoW.push(s)
              // }
              this.tableData.push(s)
              primero=false
            }
            }else{
              this.tableData.push(s)
            }

          }
        }
      );
        var pending=0
        this.Actual.forEach((a:any) => {
          a.IsValid=false
          let HoraInicio = moment(a.fechaHoraInicio).add(0, 'minutes');
          let HoraWebexOriginal = moment.tz(HoraInicio, this.ZonaHorariaOrigenWebex);
          let HoraWebexUsuario = HoraWebexOriginal.clone().tz(this.ZonaHorariaUsuario);
          let HoraActualUsuario = moment().tz(this.ZonaHorariaUsuario);
          let diference = HoraActualUsuario.diff(HoraWebexOriginal, 'minutes');
          console.log('Hora Actual:', HoraActualUsuario.format('YYYY-MM-DD HH:mm:ss'));
          console.log('Hora Webex Original:', HoraWebexOriginal.format('YYYY-MM-DD HH:mm:ss'));
          console.log('Hora Webex Conversion Usuario:', HoraWebexUsuario.format('YYYY-MM-DD HH:mm:ss'));
          console.log('Minutos Faltantes:', diference);

          if(diference>=-15){
            if(a.urlWebex!=null){
              a.IsValid=true;
            }
          }else{
            pending++
          }
        });
        if(pending>0){
          this.SetIntervalo();
        }
        if(this.tableData!=undefined && this.tableData!=null && this.tableData.length){
          this.tableData.forEach((c:any) => {
            c.HoraInicio=c.fechaHoraInicio;
            c.HoraFinal=c.fechaHoraFinal;
            if(c.tipo!='Webinar'){
              c.ses=c.orden+' de '+ c.maximo
            }else{
              c.ses=''
            }
            c.Acciones=c.urlWebex==null?'Próximamente':'Ir  a clase'
          });
        }
        console.log(this.tableData)
      },
      complete:()=>{
        this.TerminaCarga=true
      }
    })
  }
  SetIntervalo(){
    this.interval=setInterval(() => {
      var pending=0
      this.Actual.forEach((a:any) => {
        if(a.IsValid==false){
          let HoraInicio = moment(a.fechaHoraInicio).add(0, 'minutes');
          let HoraWebexOriginal = moment.tz(HoraInicio, this.ZonaHorariaOrigenWebex);
          let HoraWebexUsuario = HoraWebexOriginal.clone().tz(this.ZonaHorariaUsuario);
          let HoraActualUsuario = moment().tz(this.ZonaHorariaUsuario);
          let diference = HoraActualUsuario.diff(HoraWebexOriginal, 'minutes');
          console.log('Hora Actual:', HoraActualUsuario.format('YYYY-MM-DD HH:mm:ss'));
          console.log('Hora Webex Original:', HoraWebexOriginal.format('YYYY-MM-DD HH:mm:ss'));
          console.log('Hora Webex Conversion Usuario:', HoraWebexUsuario.format('YYYY-MM-DD HH:mm:ss'));
          console.log('Minutos Faltantes:', diference);
          console.log(this.ZonaHorariaUsuario)
    console.log(this.ZonaHorariaOrigenWebex)
          if(diference>=-15){
            if(a.urlWebex!=null){
              a.IsValid=true;
            }
          }else{
            pending++
          }
        }
        if(pending==0){
          clearInterval(this.interval);
        }
      });
    }, 5000);
  }
  ObtenerInformacionProveedor(){
    this._ProveedorService.ObtenerInformacionProveedor().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.DataProveedor=x
      }
    })
  }
  OpenAsistencias(item:any){
    const dialogRef = this.dialog.open(RegistrarAsistenciaOnlineComponent, {
      width: '1000px',
      data: { IdPespecifico: item.idPEspecificoHijo,IdSesion:item.idSesion,Sesion:item,correo:this.DataProveedor.email },
      panelClass: 'dialog-Tarjeta',
     disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      if(result!=undefined){

      }
    });
  }
  ObtenerDatosZonaHoraria(){
    this.ZonaHorariaUsuario = undefined;
    this.ZonaHorariaOrigenWebex = undefined;
    this.ZonaHorariaUsuario = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.ZonaHorariaOrigenWebex = moment.tz.zonesForCountry(this.CodigoIsoPaisWebex);
    this.ZonaHorariaOrigenWebex = this.ZonaHorariaOrigenWebex[0];
    console.log(this.ZonaHorariaUsuario)
    console.log(this.ZonaHorariaOrigenWebex)
  }
}
