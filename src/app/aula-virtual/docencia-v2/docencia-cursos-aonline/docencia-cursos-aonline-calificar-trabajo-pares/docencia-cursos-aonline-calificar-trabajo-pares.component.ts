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
  public TerminaCarga=false;
  ngOnInit(): void {
    this.TerminaCarga=false;
    this.ObtenerProgramaGeneralCentroCostoDocente()
  }
  ObtenerProgramaGeneralCentroCostoDocente(){
    this._TrabajoDeParesIntegraService.ObtenerProgramaGeneralCentroCostoDocenteV2().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.TerminaCarga=true;
        this.TrabajoPares=x
        if(this.TrabajoPares!=null){
          if(this.TrabajoPares.length!=0)
          this.TrabajoPares.forEach((t:any) => {
            t.Visible=true;
            if(t.tareasPendientes==0){
              t.estadoAtendido=1
            }
            else{
              t.estadoAtendido=0
            }
        });
        console.log(this.TrabajoPares)

        }
      }
    })
  }
  FiltrarTrabajoPares(){
    this.TrabajoPares.forEach((e:any) => {
      e.Visible=true
      if(this.filterTrabajoPares.length>0){
        var name=e.programaGeneral.toUpperCase();
        if(!name.includes(this.filterTrabajoPares.toUpperCase())){
          e.Visible=false
        }
      }
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
