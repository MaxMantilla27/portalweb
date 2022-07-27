import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IntegraEsquemaEvaluacionService } from 'src/app/Core/Shared/Services/IntegraEsquemaEvaluacion/integra-esquema-evaluacion.service';
import { TrabajoDeParesIntegraService } from 'src/app/Core/Shared/Services/TrabajoDeParesIntegra/trabajo-de-pares-integra.service';

@Component({
  selector: 'app-docencia-actividades-autoevaluacion',
  templateUrl: './docencia-actividades-autoevaluacion.component.html',
  styleUrls: ['./docencia-actividades-autoevaluacion.component.scss']
})
export class DocenciaActividadesAutoevaluacionComponent implements OnInit,OnChanges,OnDestroy {
  private signal$ = new Subject();

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    private _TrabajoDeParesIntegraService:TrabajoDeParesIntegraService,
    private _router:Router,
    private _ActivatedRoute:ActivatedRoute,
    private _IntegraEsquemaEvaluacionService:IntegraEsquemaEvaluacionService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdProveedor>0){
      this.ListadoProgramasDocenteFiltrado()
    }
  }
  @Input() IdProveedor = 0;
  @Input() Correo = '';
  public proyectos:any

  columnHeader = {
    alumno: 'Alumno',
    Acciones: 'Acciones',
  };

  TipoContenido: any = {
    Acciones: ['buttons', 'Calificar'],
    //'Acciones': ['buttons'],
  };
  ngOnInit(): void {
  }
  ListadoProgramasDocenteFiltrado(){
    this._TrabajoDeParesIntegraService.ListadoProgramasDocenteFiltrado().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.proyectos=x
        this.proyectos.forEach((p:any) => {
          p.alumnos=[]
          p.alumnosAntiguos=[]
        });
        console.log(x)
      }
    })
  }
  ButtonsClick(index:any,indexAlumno:number){
    const urlTree = this._router.createUrlTree([], {
      relativeTo: this._ActivatedRoute
    });
    const Url =this._router.serializeUrl(urlTree);
    window.open(Url+'/'+this.proyectos[index].alumnos[indexAlumno].idTarea, '_blank');
  }
  openTab(item:any,index:number){
    console.log(item)
    this._TrabajoDeParesIntegraService.ListadoAlumnosCalificarPorPespecificoCongelado(item.idPEspecifico).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.proyectos[index].alumnos=[]
        this.proyectos[index].alumnosAntiguos=[]
        x.forEach((a:any) => {
          if(a.idTarea==0 && a.idTarea==null){
            this.proyectos[index].alumnosAntiguos.push(a)
          }else{
            this.proyectos[index].alumnos.push(a)
          }
        });
        console.log(this.proyectos[index])
      }
    })
  }
}
