import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NotaService } from 'src/app/Core/Shared/Services/Nota/nota.service';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-modulo-calificaciones',
  templateUrl: './modulo-calificaciones.component.html',
  styleUrls: ['./modulo-calificaciones.component.scss']
})
export class ModuloCalificacionesComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _NotaService:NotaService,
    private _ProgramaContenidoService:ProgramaContenidoService,
    private _SessionStorageService:SessionStorageService
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  @Input() IdMatriculaCabecera=0
  @Input() IdPEspecifico=0
  @Input() Capitulo=''
  @Input() IdPGeneralHijo=0
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
      this.ValidarCalificacionesMatriculaPorPgeneral();
    }
  }
  ValidarCalificacionesMatriculaPorPgeneral(){
    this._ProgramaContenidoService.ValidarCalificacionesMatriculaPorPgeneral(this.IdMatriculaCabecera,this.IdPGeneralHijo).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
      },
      complete:()=>{

          this.ListadoCriteriosEvaluacionPorCurso()
      }
    })
  }
  ListadoCriteriosEvaluacionPorCurso(){
    this._NotaService.ListadoCriteriosEvaluacionPorCurso(this.IdMatriculaCabecera,this.IdPEspecifico,1).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.calificacionesCurso=x;
        this.error=x.excepcion.excepcionGenerada;
        this.mensajeError=x.excepcion.descripcionGeneral;
        this.promedio=x.notaCurso;
        this.calificacionesCursoDetalle=x.detalleCalificacion
        console.log(this.calificacionesCursoDetalle)
      },
      complete:()=>{
        this._SessionStorageService.SessionSetValue('PromedioFinalCurso',this.promedio.toString());
        console.log('Este es el promedio final',this.promedio)
      }
    })
  }
}
