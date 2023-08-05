import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';

@Component({
  selector: 'app-criterio-evaluacion-docente',
  templateUrl: './criterio-evaluacion-docente.component.html',
  styleUrls: ['./criterio-evaluacion-docente.component.scss']
})
export class CriterioEvaluacionDocenteComponent implements OnInit ,OnChanges, OnDestroy{
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  @Input() IdPespecifico = 0;
  constructor(
    private _PEspecificoEsquemaService: PEspecificoEsquemaService
    ) { }

  ngOnInit(): void {
  }

  columnHeader:any = {
    indice: 'N°',
    nombre: 'Criterio',
    procentaje: 'Porcentaje Asignado'
  };
  TipoContenido: any = {
    //'Acciones': ['buttons'],
  };
  public criterios:Array<any>=[]
  ngOnChanges(changes: SimpleChanges): void {
    if (this.IdPespecifico != 0) {
      this.ObtenerCriteriosPorProgramaEspecifico();
    }
  }
  ObtenerCriteriosPorProgramaEspecifico(){
    this._PEspecificoEsquemaService.ObtenerCriteriosPorProgramaEspecifico(this.IdPespecifico).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        this.criterios=x
        if(this.criterios!=null){
          let i=1
          this.criterios.forEach((c:any) => {
            c.procentaje=c.ponderacion+'%'
            c.indice=i
            i++
          });
        }
      },
    });
  }
}
