import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { PespecificoSesionTemaService } from 'src/app/Core/Shared/Services/PespecificoSesionTema/pespecifico-sesion-tema.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { EnvioTareaComponent } from './envio-tarea/envio-tarea.component';
import { EnvioCuestionarioComponent } from './envio-cuestionario/envio-cuestionario.component';
import * as moment  from 'moment';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { EnvioActividadComponent } from './envio-actividad/envio-actividad.component';
import { EnvioEncuestaOnlineComponent } from './envio-encuesta-online/envio-encuesta-online.component';

@Component({
  selector: 'app-modulo-sesiones-online',
  templateUrl: './modulo-sesiones-online.component.html',
  styleUrls: ['./modulo-sesiones-online.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModuloSesionesOnlineComponent implements OnInit , OnChanges,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _DatosPerfilService:DatosPerfilService,
    private _HelperService:HelperService,
    private _PEspecificoEsquemaService:PEspecificoEsquemaService,
    private _PespecificoSesionTemaService:PespecificoSesionTemaService,
    public dialog: MatDialog,
    public _SnackBarServiceService:SnackBarServiceService
  ) { }
  public scroll=0
  @HostListener('window:scroll', ['$event']) // for window scroll events
  public ZonaHorariaOrigenWebex:any
  public ZonaHorariaUsuario:any
  public CodigoIsoPaisWebex='PE'
  onScroll(e:any) {
    this.scroll=document.documentElement.scrollTop
    // if(this.videoselect>-1){
    //   var data=document.getElementById("video-"+this.videoselect)
    //   if(data!=undefined && data!=null){
    //     //console.log(data.offsetTop)
    //   }
    // }
    //console.log(this.scroll)
  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.ObtenerDatosZonaHoraria()
    if(this.IdPespecifico>0){
      if (this.IdPespecifico==23522){
        this.EncuestaPrueba=true
      }
      this.ObtenerSesionesOnlineWebinarPorIdPespecifico()
    }
    if(this.videos!=null && this.videos.length>0){
      this.videos.forEach((v:any) => {
        v.idFrameVideo='<iframe (click)="Onplay(this)" src="https://player.vimeo.com/video/'+v.idVideo+'" width="100%" height="564" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>'
        //v.idVideo='https://player.vimeo.com/video/'+v.idVideo
      });
      if(this.sesiones!=null && this.sesiones.length>0){
        this.ArmarVdeosGrabado()
      }
    }
  }

  @Input() IdPespecifico=0;
  @Input() IdPGeneral=0;
  @Input() IdMatriculaCabecera=0;
  public sesiones:Array<any>=[]
  @Input() videos: Array<any>=[];
  @Input() Capitulo='';
  public OpenVideoModulo=true;
  public EncuestaPrueba=false;
  public EncuestaEnviada=false;
  ngOnInit(): void {
    this.ObtenerDatosZonaHoraria()
  }
  OpenSesion(index:number){
    this.sesiones[index].Open=!this.sesiones[index].Open
    if(this.sesiones[index].Open==true){
      this.ObtenerActividadesRecursoSesionAlumno( this.sesiones[index].idSesion,index);
      this.ObtenerPespecificoSesionTemaPorSesion( this.sesiones[index].idSesion,index);
    }
  }

  ObtenerPespecificoSesionTemaPorSesion(IdSesion:number,index:number) {
    this._PespecificoSesionTemaService
      .ObtenerPespecificoSesionTemaPorSesion(IdSesion)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.sesiones[index].temas=[]
          console.log(x);
          if(x!=null){

            this.sesiones[index].temas=x
          }
          console.log(this.sesiones[index])
        },
      });
  }
  ObtenerActividadesRecursoSesionAlumno(IdSesion:number,index:number){
    this._PEspecificoEsquemaService.ObtenerActividadesRecursoSesionAlumno(IdSesion,this.IdMatriculaCabecera).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.sesiones[index].material=[]
        this.sesiones[index].tarea=[]
        this.sesiones[index].cuestionario=[]
        this.sesiones[index].actividades=[]
        this.sesiones[index].encuesta=[]

        console.log(x)
        if(x!=null){
          x.forEach((d:any) => {
            console.log(d)
            d.disabled=false;
            let HoraWebexOriginal = moment.tz(d.fechaActual, this.ZonaHorariaOrigenWebex);
            // HoraWebexOriginal.subtract(80, 'minutes');
            let HoraWebexUsuario = HoraWebexOriginal.clone().tz(this.ZonaHorariaUsuario);
            let HoraActualUsuario = moment().tz(this.ZonaHorariaUsuario);
            let diference = HoraActualUsuario.isAfter(HoraWebexOriginal, 'minutes');
            console.log('Hora Actual:', HoraActualUsuario.format('YYYY-MM-DD HH:mm:ss'));
            console.log('Hora Webex Original:', HoraWebexOriginal.format('YYYY-MM-DD HH:mm:ss'));
            console.log('Hora Webex Conversion Usuario:', HoraWebexUsuario.format('YYYY-MM-DD HH:mm:ss'));
            console.log('Minutos Faltantes:', diference);

            if(d.tipo.toLowerCase()=='material adicional'){
              this.sesiones[index].material.push(d)
            }
            if(d.tipo.toLowerCase()=='tarea'){
              d.disabled=diference
              this.sesiones[index].tarea.push(d)
            }
            if(d.tipo.toLowerCase()=='cuestionario'){
              d.disabled=diference
              this.sesiones[index].cuestionario.push(d)

            }
            if(d.tipo.toLowerCase()=='actividad adicional'){
              d.disabled=diference
              this.sesiones[index].actividades.push(d)
            }
            if(d.tipo.toLowerCase()=='encuesta'){
              d.disabled=diference
              d.encuestaEnviada=true
              if(d.respuestasEncuesta.length==0){
                d.encuestaEnviada=false
              }
              this.sesiones[index].encuesta.push(d)
            }
          });
        }
        console.log('SESIONESSSSSSSSS',this.sesiones)
      }
    })
  }
//simulacion encuesta
  openEncuestaDialog(indexSesion:number, index:number) {
    console.log(this.sesiones)
    console.log(this.sesiones[indexSesion].encuesta[index])
    const dialogRef = this.dialog.open(EnvioEncuestaOnlineComponent, {
      width: '800px',
      data: {encuesta:this.sesiones[indexSesion].encuesta[index],
        index:index,
        IdMatriculaCabecera:this.IdMatriculaCabecera,
        IdPEspecificoSesion:this.sesiones[indexSesion].encuesta[index].idPEspecificoSesion,
        IdPGeneral:this.IdPGeneral,
        IdPEspecifico: this.IdPespecifico,
      },
      panelClass: 'dialog-envio-encuesta-online',
      disableClose: true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result)
      if(result!=undefined && result.length>0){
        this.ObtenerActividadesRecursoSesionAlumno(this.sesiones[indexSesion].idSesion,indexSesion)
      }
    });
  }
  //simulacion encuestas
  ObtenerSesionesOnlineWebinarPorIdPespecifico(){
    this._DatosPerfilService.ObtenerSesionesOnlineWebinarPorIdPespecifico(this.IdPespecifico,this.IdMatriculaCabecera).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.sesiones=x
        if(x!=null){
          this.CodigoIsoPaisWebex=x[0].codigoIso;
        }
        if(this.sesiones!=null){
          this.sesiones.forEach((s:any) => {
            s.Open=false;
            s.OpenMaterial=false;
            s.OpenTema=false;
            var f=new Date(s.fechaHoraInicio);
            f.setMinutes(f.getMinutes()+(s.duracion*60))
            s.fechaHoraFinal=f
          });
        }
        if(this.videos!=null && this.videos.length>0){
          this.ArmarVdeosGrabado()
        }
      }
    })
  }
  EnviarTarea(indexSesion:number, index:number){
    this._PEspecificoEsquemaService.ObtenerEstadoDeFechasPorTarea(this.sesiones[indexSesion].tarea[index].id).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x==true || (this.sesiones[indexSesion].tarea[index].tareas!=null && this.sesiones[indexSesion].tarea[index].tareas.length>0)){
          const dialogRef = this.dialog.open(EnvioTareaComponent, {
            width: '1000px',
            data: {tarea:this.sesiones[indexSesion].tarea[index],index:index,IdMatriculaCabecera:this.IdMatriculaCabecera},
            panelClass: 'dialog-envio-tarea-alumno',
           disableClose:true
          });

          dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
            console.log(result)
            if(result!=undefined && result.length>0){
              this.ObtenerActividadesRecursoSesionAlumno(this.sesiones[indexSesion].idSesion,indexSesion)
            }
          });
        }else{
          this._SnackBarServiceService.openSnackBar("Ya culmino el plazo para presentar esta tarea.",'x',15,"snackbarCrucigramaerror");
        }
      },
      error:e=>{
        this._SnackBarServiceService.openSnackBar("Ocurrio un error",'x',15,"snackbarCrucigramaerror");
      }
    })
  }
  EnviarCuestionario(indexSesion:number, index:number){
    this._PEspecificoEsquemaService.ObtenerEstadoDeFechasPorCuestionario(this.sesiones[indexSesion].cuestionario[index].id).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x==true || (this.sesiones[indexSesion].cuestionario[index].respuestaCuestionario!=null && this.sesiones[indexSesion].cuestionario[index].respuestaCuestionario.length>0)){
          var json = JSON.stringify(this.sesiones[indexSesion].cuestionario[index]);
          const dialogRef = this.dialog.open(EnvioCuestionarioComponent, {
            width: '1000px',
            data: {cuestionario:this.sesiones[indexSesion].cuestionario[index],index:index,IdMatriculaCabecera:this.IdMatriculaCabecera},
            panelClass: 'dialog-envio-cuestionario-alumno',
          disableClose:true
          });

          dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
            console.log(result)
            if(result!=undefined && result.length>0){
              this.ObtenerActividadesRecursoSesionAlumno(this.sesiones[indexSesion].idSesion,indexSesion)
            }else{
              this.sesiones[indexSesion].cuestionario[index]=JSON.parse(json)
            }
          });
        }else{
          this._SnackBarServiceService.openSnackBar("Ya culmino el plazo para presentar este cuestionario.",'x',15,"snackbarCrucigramaerror");
        }
      },
      error:e=>{
        this._SnackBarServiceService.openSnackBar("Ocurrio un error",'x',15,"snackbarCrucigramaerror");
      }
    })

  }


  ArmarVdeosGrabado(){
    this.sesiones.forEach((s:any) => {
      s.grabaciones=[]
      this.videos.forEach((g:any) => {
        if(s.idSesion==g.idPEspecificoSesion){
          g.Open=false

          s.grabaciones.push(g)
        }
      });
    });
    console.log(this.sesiones)
  }
  Onplay(e:any){
    console.log(e);
  }
  EnviarActividad(indexSesion:number, index:number){
    const dialogRef = this.dialog.open(EnvioActividadComponent, {
      width: '1000px',
      data: {actividad:this.sesiones[indexSesion].actividades[index],index:index,IdMatriculaCabecera:this.IdMatriculaCabecera},
      panelClass: 'dialog-envio-actividad-alumno',
     disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result)
      if(result!=undefined && result.length>0){
        this.ObtenerActividadesRecursoSesionAlumno(this.sesiones[indexSesion].idSesion,indexSesion)
      }
    });
  }
  ObtenerDatosZonaHoraria(){
    this.ZonaHorariaUsuario = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.ZonaHorariaOrigenWebex = moment.tz.zonesForCountry(this.CodigoIsoPaisWebex);
    this.ZonaHorariaOrigenWebex = this.ZonaHorariaOrigenWebex[0];
    console.log(this.ZonaHorariaUsuario)
    console.log(this.ZonaHorariaOrigenWebex)
  }
}
