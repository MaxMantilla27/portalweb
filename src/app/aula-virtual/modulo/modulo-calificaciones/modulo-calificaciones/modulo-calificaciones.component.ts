import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NotaService } from 'src/app/Core/Shared/Services/Nota/nota.service';

@Component({
  selector: 'app-modulo-calificaciones',
  templateUrl: './modulo-calificaciones.component.html',
  styleUrls: ['./modulo-calificaciones.component.scss']
})
export class ModuloCalificacionesComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _NotaService:NotaService
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  @Input() IdMatriculaCabecera=0
  @Input() IdPEspecifico=0
  @Input() Capitulo=''
  public criterioPendiente=false;
  public calificacionesCurso:Array<any>=[];
  public calificacionesCursoDetalle:Array<any>=[];
  public error=false;
  public mensajeError='';
  public promedio=0;
  public idMatricula=0;
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdMatriculaCabecera!=0){
      this.ObtenerCriteriosEvaluacionCurso()
    }

  }
  ObtenerCriteriosEvaluacionCurso(){
    this._NotaService.ListadoCriteriosEvaluacionPorCurso(this.IdMatriculaCabecera,this.IdPEspecifico,1).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.calificacionesCurso=x;
        this.error=x.excepcion.excepcionGenerada;
        this.mensajeError=x.excepcion.descripcionGeneral;
        this.promedio=x.notaCurso;
        this.calificacionesCursoDetalle=x.detalleCalificacion
      }
    })
  }
}
