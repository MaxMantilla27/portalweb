import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
const pipe = new DatePipe('en-US')
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
      this.fechaActual= pipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS')
      this.ObtenerCriteriosEvaluacionPespecifico();
    }
  }

  ngOnInit(): void {
    this.fechaActual= pipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS')
  }

  filterCurso=''
  Estados:Array<any>=[
    {id:1,Nombre:'Por Calificar'},
    {id:2,Nombre:'Calificadas'}
  ]

  EstadoPespecifico=0
  public criterios:Array<any>=[]
  public IrCurso=-1
  public Criterio=0
  public itemSelect:any
  public TerminaCarga=false;
  public CantidadCalificadosActividad=0
  public CantidadEnviadosActividad=0
  public fechaActual: any

  ObtenerCriteriosEvaluacionPespecifico(){
    this.TerminaCarga=false;

    this.criterios=[];
    this._PEspecificoEsquemaService.ObtenerCriteriosEvaluacionPespecifico(this.IdPespecifico).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);

        if(x!=null){
          this.criterios=x
        }
        if(this.criterios!=null && this.criterios!=undefined && this.criterios.length>0){
          this.criterios.forEach((c:any) => {
            console.log(c)
            console.log(c.fechaEntrega)
            c.Visible=true
            this.CantidadCalificadosActividad=0
            this.CantidadEnviadosActividad=0
            c.criterios.forEach((cc:any) => {
              var fechaEntrega= pipe.transform(new Date(cc.fechaEntrega), 'yyyy-MM-ddTHH:mm:ss.SSS')
              if(cc.idCriterioEvaluacion==21 && fechaEntrega!>this.fechaActual){
                this.CantidadEnviadosActividad=this.CantidadEnviadosActividad+cc.cantidadEnviados
                this.CantidadCalificadosActividad=this.CantidadCalificadosActividad+cc.cantidadCalificados
              }
              cc.Visible=true
              cc.Porcalificar=cc.cantidadEnviados - cc.cantidadCalificados
              cc.nombre=cc.nombre.split('Tareas').join('Tarea')
              cc.nombre=cc.nombre.split('Cuestionarios').join('Cuestionario')
            });
            c.Porcalificar=(c.cantidadEnviados-this.CantidadEnviadosActividad) - (c.cantidadCalificados-this.CantidadCalificadosActividad)
          });
        }
        this.TerminaCarga=true;

      },
    });
  }

  FilterCursos(){
    this.criterios.forEach((e:any) => {
      e.Visible=true
      e.criterios.forEach((c:any) => {
        c.Visible=true
      });
      if(this.filterCurso.length>0){
        var Alguno=0
        e.criterios.forEach((c:any) => {
          var name=c.titulo.toUpperCase();
          if(!name.includes(this.filterCurso.toUpperCase())){
            c.Visible=false
          }else{
            Alguno++
          }
        });
        if(Alguno==0){
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
        if(e.Visible==true){
          e.criterios.forEach((c:any) => {
            if(this.EstadoPespecifico==1){
              if(c.Porcalificar<=0){
                c.Visible=false
              }
            }
            if(this.EstadoPespecifico==2){
              if(c.Porcalificar>0){
                c.Visible=false
              }
            }
          });
        }

      }
    });
  }
  IrACalificar(item:any){
    console.log(item)
    this.Criterio=0
    this.IrCurso=item.id
    this.itemSelect=item
    if(item.nombre.toLowerCase()=="tarea"){
      this.Criterio=1
    }else{
      if(item.nombre.toLowerCase()=="cuestionario"){
        this.Criterio=2
      }
      else{
        this.Criterio=3
      }
    }
    console.log(this.IrCurso,this.Criterio)
  }
  RefrescarListaCalificar(){
    this.EstadoPespecifico=0
    this.ObtenerCriteriosEvaluacionPespecifico();
  }
}
