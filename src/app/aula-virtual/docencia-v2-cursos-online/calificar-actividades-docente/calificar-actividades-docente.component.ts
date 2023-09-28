import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';

@Component({
  selector: 'app-calificar-actividades-docente',
  templateUrl: './calificar-actividades-docente.component.html',
  styleUrls: ['./calificar-actividades-docente.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalificarActividadesDocenteComponent implements OnInit ,OnChanges, OnDestroy{
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  @Input() IdPespecifico = 0;
  constructor(
    private _PEspecificoEsquemaService: PEspecificoEsquemaService
    ) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.IdPespecifico)
    if (this.IdPespecifico != 0) {
      this.ObtenerCriteriosEvaluacionPespecifico();
    }
  }

  ngOnInit(): void {
  }

  filterCurso=''
  Estados:Array<any>=[
    {id:1,Nombre:'Por Calificar'},
    {id:2,Nombre:'Calificadas'}
  ]

  EstadoPespecifico=0
  public criterios:Array<any>=[]
  public IrCurso=-1
  public Estarea=false
  public itemSelect:any
  public TerminaCarga=false;
  ObtenerCriteriosEvaluacionPespecifico(){
    this.TerminaCarga=false;
    this._PEspecificoEsquemaService.ObtenerCriteriosEvaluacionPespecifico(this.IdPespecifico).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        this.criterios=[];

        if(x!=null){
          this.criterios=x
        }
        if(this.criterios!=null && this.criterios!=undefined && this.criterios.length>0){
          this.criterios.forEach((c:any) => {
            c.Visible=true
            c.Porcalificar=c.cantidadEnviados - c.cantidadCalificados
            c.nombre=c.nombre.split('Tareas').join('Tarea')
            c.nombre=c.nombre.split('Cuestionarios').join('Cuestionario')
          });
        }
        this.TerminaCarga=true;

      },
    });
  }

  FilterCursos(){
    this.criterios.forEach((e:any) => {
      e.Visible=true
      if(this.filterCurso.length>0){
        var name=e.titulo.toUpperCase();
        if(!name.includes(this.filterCurso.toUpperCase())){
          e.Visible=false
        }
      }
      if(this.EstadoPespecifico!=0){
        if(this.EstadoPespecifico==1){
          if(e.Porcalificar<=0){
            e.Visible=false
          }
        }
        if(this.EstadoPespecifico==2){
          if(e.Porcalificar>0){
            e.Visible=false
          }
        }
      }
    });
  }
  IrACalificar(item:any){
    console.log(item)
    this.IrCurso=item.id
    this.itemSelect=item
    if(item.nombre.toLowerCase()=="tarea"){
      this.Estarea=true
    }else{
      this.Estarea=false
    }
    console.log(this.IrCurso,this.Estarea)
  }
  RefrescarListaCalificar(){
    this.ObtenerCriteriosEvaluacionPespecifico();
  }
}
