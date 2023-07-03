import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';import { AlumnoService } from 'src/app/Core/Shared/Services/Alumno/alumno.service';
import { AsistenciaService } from 'src/app/Core/Shared/Services/Asistencia/asistencia.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-asistencia-alumno',
  templateUrl: './asistencia-alumno.component.html',
  styleUrls: ['./asistencia-alumno.component.scss']
})
export class AsistenciaAlumnoComponent implements OnInit, OnDestroy {
  private signal$ = new Subject();
  
  constructor(
    private _Router:Router,
    private r:ActivatedRoute,
    private _SnackBarServiceService:SnackBarServiceService,
    private _AsistenciaService:AsistenciaService) 
  { 
  }

  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  @Input() IdMatriculaCabecera=0
  @Input() IdPEspecifico=0
  public asistenciaAlumno:any;
  public sesion=0;

  ngOnInit(): void {
    this.ObtenerAsistenciaAlumno();
  }
  ObtenerAsistenciaAlumno(){
    this._AsistenciaService.ObtenerAsistenciaAlumno(this.IdMatriculaCabecera,this.IdPEspecifico).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.asistenciaAlumno=x
      }
    })
  }

}
