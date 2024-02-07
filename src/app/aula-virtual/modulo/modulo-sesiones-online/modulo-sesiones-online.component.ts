import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
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

@Component({
  selector: 'app-modulo-sesiones-online',
  templateUrl: './modulo-sesiones-online.component.html',
  styleUrls: ['./modulo-sesiones-online.component.scss']
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
    if(this.IdPespecifico>0){
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
  @Input() IdMatriculaCabecera=0;
  public sesiones:Array<any>=[]
  @Input() videos: Array<any>=[];
  @Input() Capitulo='';
  ngOnInit(): void {
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
        console.log(x)
        if(x!=null){
          x.forEach((d:any) => {
            d.disabled=false;
            let f1=new Date(d.fechaActual);
            let f2=new Date();
            var diference=moment(f2).isAfter(f1)
            console.log(f2)
            console.log(f1)
            console.log(diference)

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
          });
        }
        console.log(this.sesiones)
      }
    })
  }
  ObtenerSesionesOnlineWebinarPorIdPespecifico(){
    this._DatosPerfilService.ObtenerSesionesOnlineWebinarPorIdPespecifico(this.IdPespecifico,this.IdMatriculaCabecera).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.sesiones=x
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
}