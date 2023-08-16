import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TrabajoDeParesIntegraService } from 'src/app/Core/Shared/Services/TrabajoDeParesIntegra/trabajo-de-pares-integra.service';

@Component({
  selector: 'app-docencia-cursos-aonline-calificar-trabajo-pares',
  templateUrl: './docencia-cursos-aonline-calificar-trabajo-pares.component.html',
  styleUrls: ['./docencia-cursos-aonline-calificar-trabajo-pares.component.scss']
})
export class DocenciaCursosAonlineCalificarTrabajoParesComponent implements OnInit {
  private signal$ = new Subject();

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    private _TrabajoDeParesIntegraService:TrabajoDeParesIntegraService,
  ) { }
  Estados:Array<any>=[
    {id:0,Nombre:'Pendiente'},
    {id:1,Nombre:'Calificado'}
  ]
  TrabajoPares:any
  filterTrabajoPares=''
  EstadoPendiente=-1;
  public ContenidoTrabajoPares=false;
  public IdPGeneralTrabajoPares=0;
  public IdPEspecificoTrabajoPares=0;
  ngOnInit(): void {
    this.ObtenerProgramaGeneralCentroCostoDocente()
  }
  ObtenerProgramaGeneralCentroCostoDocente(){
    this._TrabajoDeParesIntegraService.ObtenerProgramaGeneralCentroCostoDocenteV2().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.TrabajoPares=x
        this.TrabajoPares.forEach((t:any) => {
          t.Visible=true;
          if(t.tareasPendientes==0){
            t.estadoAtendido=1
          }
          else{
            t.estadoAtendido=0
          }
        });
      }
    })
  }
  FiltrarTrabajoPares(){
    console.log(this.EstadoPendiente)
    this.TrabajoPares.forEach((e:any) => {
      e.Visible=true
      console.log(this.filterTrabajoPares)
      if(this.filterTrabajoPares.length>0){
        var name=e.programaGeneral.toUpperCase();
        console.log(name)
        if(!name.includes(this.filterTrabajoPares.toUpperCase())){
          console.log(e)
          e.Visible=false
        }
      }
      console.log(e)
      if(this.EstadoPendiente==0 || this.EstadoPendiente==1){
        if(this.EstadoPendiente!=e.estadoAtendido){
          e.Visible=false
        }
      }
    });
  }
  IngresarTrabajoPares(IdPGeneralTrabajoPares:number,IdPEspecificoPadre:number,ContenidoTrabajoPares:boolean ){
    this.IdPGeneralTrabajoPares=IdPGeneralTrabajoPares;
    this.IdPEspecificoTrabajoPares=IdPEspecificoPadre;
    this.ContenidoTrabajoPares=ContenidoTrabajoPares;
  }
}
