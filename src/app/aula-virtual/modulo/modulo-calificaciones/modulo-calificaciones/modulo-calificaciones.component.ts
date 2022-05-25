import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NotaService } from 'src/app/Core/Shared/Services/Nota/nota.service';

@Component({
  selector: 'app-modulo-calificaciones',
  templateUrl: './modulo-calificaciones.component.html',
  styleUrls: ['./modulo-calificaciones.component.scss']
})
export class ModuloCalificacionesComponent implements OnInit {

  constructor(
    private _NotaService:NotaService
  ) { }

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
    console.log(this.IdPEspecifico)
    this._NotaService.ListadoCriteriosEvaluacionPorCurso(this.IdMatriculaCabecera,this.IdPEspecifico,1).subscribe({
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
