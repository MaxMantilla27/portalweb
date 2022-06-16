import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject,takeUntil } from 'rxjs';
import { PreguntasFrecuentesCursoService } from 'src/app/Core/Shared/Services/PreguntasFrecuentesCurso/preguntas-frecuentes-curso.service';

@Component({
  selector: 'app-modulo-ayuda-preguntas-frecuentes',
  templateUrl: './modulo-ayuda-preguntas-frecuentes.component.html',
  styleUrls: ['./modulo-ayuda-preguntas-frecuentes.component.scss']
})
export class ModuloAyudaPreguntasFrecuentesComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _PreguntasFrecuentesCursoService:PreguntasFrecuentesCursoService
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
 @Input() IdPrincipal=0
 @Input() IdPGeneral=0
 @Input() Capitulo=''
 public PreguntaExpand=-1;
 public PreguntasFrecuentes:any
  ngOnInit(): void {
  this.ObtenerPreguntasFrecuentes();
  }

  ObtenerPreguntasFrecuentes(){
    this._PreguntasFrecuentesCursoService.ObtenerPreguntaFrecuentePorPrograma(this.IdPrincipal,this.IdPGeneral).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.PreguntasFrecuentes=x
      }
    })
  }

}
