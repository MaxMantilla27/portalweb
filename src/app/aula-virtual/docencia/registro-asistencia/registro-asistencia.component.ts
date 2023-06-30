import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { OperacionesNotaService } from 'src/app/Core/Shared/Services/OperacionesNota/operaciones-nota.service';
import { OperacionesAsistenciaService } from 'src/app/Core/Shared/Services/OperacionesAsistencia/operaciones-asistencia.service';
import { AsistenciaRegistrarDTO } from 'src/app/Core/Models/ParticipacionExpositorFiltroDTO';


@Component({
  selector: 'app-registro-asistencia',
  templateUrl: './registro-asistencia.component.html',
  styleUrls: ['./registro-asistencia.component.scss']
})
export class RegistroAsistenciaComponent implements OnInit, OnChanges,OnDestroy{
  private signal$ = new Subject();

  columnHeader = {
    'index'  : 'N°',
    'codigoMatricula': 'Código',
    'alumno': 'Nombres y Apellidos',
    'asistio': 'Asistencia',
    
  };


  TipoContenido:any={
      //'Acciones': ['buttons'],
  }
  tableInfo:any;

  constructor(    
    private _Router:Router,
    private _OperacionesNotaService:OperacionesNotaService,
    public _OperacionesAsistenciaService:OperacionesAsistenciaService,
    private r:ActivatedRoute,
    private _SnackBarServiceService:SnackBarServiceService,
  ) { }

  public asistencias:Array<AsistenciaRegistrarDTO>=[]

  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  public data = {grupo: 1,IdPEspecifico:15647,correo:'viranamorales@yahoo.es'};
  public Asistencias:any;
  public listadoAsistencias:any

  public charge=false;


  ngOnInit(): void {
   this.ObtenerAsistenciaSesion();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.ObtenerAsistenciaSesion()
  }
  
  ObtenerAsistenciaSesion(){
    this._OperacionesNotaService.ListadoAsistenciaSesion(15647, 26978).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.Asistencias=x;
        // this.tableInfo=x;
        // this.tableInfo.forEach((e:any) => {
        //   e.Acciones=e.UrlWebex==null?'Próximamente':'Unirse'
        // });
        console.log(this.Asistencias);
        console.log("Hola");
      }
    })
  }

  RegistrarAsistenciaDetalleDocente(){
    if(this.charge==false){
      this.charge=true;
      this.asistencias=[];
      this.Asistencias.forEach((mat:any) => {
        console.log(mat.asistenciaAlumno);
        this.asistencias.push({
            Id:mat.id,
            IdPEspecificoSesion:mat.idPEspecificoSesion,
            IdMatriculaCabecera:mat.idMatriculaCabecera,
            Asistio:mat.asistio,
            Justifico:mat.justifico
          });
      });
      this._OperacionesAsistenciaService.Registrar(this.asistencias,this.data.IdPEspecifico,this.data.correo).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          console.log(this.asistencias)
          this.charge=false
          this._SnackBarServiceService.openSnackBar("Se guardo correctamente",'x',5,"snackbarCrucigramaSucces");
          
        },
        error:e=>{
          console.log(e)
          this._SnackBarServiceService.openSnackBar("Ocurrio un error , intentelo nuevamente mas tarde",'x', 10,'snackbarCrucigramaerror' );
          this.charge=false
          
        }
      })
    }
  }

}
