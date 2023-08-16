import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IntegraEsquemaEvaluacionService } from 'src/app/Core/Shared/Services/IntegraEsquemaEvaluacion/integra-esquema-evaluacion.service';
import { TrabajoDeParesIntegraService } from 'src/app/Core/Shared/Services/TrabajoDeParesIntegra/trabajo-de-pares-integra.service';
@Component({
  selector: 'app-docencia-cursos-aonline-calificar-proyecto-aplicacion',
  templateUrl: './docencia-cursos-aonline-calificar-proyecto-aplicacion.component.html',
  styleUrls: ['./docencia-cursos-aonline-calificar-proyecto-aplicacion.component.scss']
})
export class DocenciaCursosAonlineCalificarProyectoAplicacionComponent implements OnInit ,OnChanges,OnDestroy {
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
  Estados:Array<any>=[
    {id:0,Nombre:'Pendiente'},
    {id:1,Nombre:'Calificado'}
  ]
  ProyectoAplicacion:any
  filterProyectoAplicacion=''
  EstadoPendiente=-1;
  public ContenidoProyectoAplicacion=false;
  public IdPGeneralProyectoAplicacion=0;
  public IdPEspecificoProyectoAplicacion=0;

  columnHeader = {
    alumno: 'Alumno',
    fechaEnvio: 'Fecha de Envio',
    fechaCalificacion: 'Fecha Calificacion',
    calificadoEstado: 'Calificado',
    Acciones: 'Acciones',
  };

  TipoContenido: any = {
    'fechaCalificacion': ['date'],
    'fechaEnvio': ['date'],
    Acciones: ['buttons', 'Calificar']
    //'Acciones': ['buttons'],
  };
  ngOnInit(): void {
    this.ListadoProgramasDocenteFiltrado();
  }
  ListadoProgramasDocenteFiltrado(){
    this._TrabajoDeParesIntegraService.ListadoProgramasDocenteFiltrado().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.ProyectoAplicacion=x;
        this.ProyectoAplicacion.forEach((c:any) => {
          c.Visible=true
        });
      }
    })
  }
  ButtonsClick(index:any,indexAlumno:number){
    const urlTree = this._router.createUrlTree([], {
      relativeTo: this._ActivatedRoute
    });
    const Url =this._router.serializeUrl(urlTree);
    window.open(Url+'/'+this.ProyectoAplicacion[index].alumnos[indexAlumno].idTarea, '_blank');
  }
  // openTab(item:any,index:number){
  //   console.log(item)
  //   this._TrabajoDeParesIntegraService.ListadoAlumnosCalificarPorPespecificoCongelado(item.idPEspecifico).pipe(takeUntil(this.signal$)).subscribe({
  //     next:x=>{
  //       console.log(x)
  //       this.ProyectoAplicacion[index].alumnos=[]
  //       this.ProyectoAplicacion[index].alumnosAntiguos=[]
  //       x.forEach((a:any) => {
  //         a.calificadoEstado='No Calificado'
  //         if(a.calificado==true){
  //           a.calificadoEstado='Calificado'
  //         }
  //         if(a.estadoDevuelto==true){
  //           a.calificadoEstado='Devuelto'
  //         }
  //         if(a.idTarea==0 || a.idTarea==null){
  //           this.ProyectoAplicacion[index].alumnosAntiguos.push(a)
  //         }else{
  //           this.ProyectoAplicacion[index].alumnos.push(a)
  //         }
  //       });
  //       console.log(this.ProyectoAplicacion[index])
  //     }
  //   })
  // }
  FiltrarProyectos(){
    console.log(this.EstadoPendiente)
    this.ProyectoAplicacion.forEach((e:any) => {
      e.Visible=true
      console.log(this.filterProyectoAplicacion)
      if(this.filterProyectoAplicacion.length>0){
        var name=e.pGeneral.toUpperCase();
        console.log(name)
        if(!name.includes(this.filterProyectoAplicacion.toUpperCase())){
          console.log(e)
          e.Visible=false
        }
      }
      console.log(e)
      // if(this.EstadoPendiente==0 || this.EstadoPendiente==1){
      //   if(this.EstadoPendiente!=e.estadoAtendido){
      //     e.Visible=false
      //   }
      // }
    });
  }
  IngresarProyectos(IdPGeneral:number,IdPEspecificoPadre:number,ContenidoProyectoAplicacion:boolean ){
    this.IdPGeneralProyectoAplicacion=IdPGeneral;
    this.IdPEspecificoProyectoAplicacion=IdPEspecificoPadre;
    this.ContenidoProyectoAplicacion=ContenidoProyectoAplicacion;
  }
}
