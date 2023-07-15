import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NotaService } from 'src/app/Core/Shared/Services/Nota/nota.service';

@Component({
  selector: 'app-curso-notas',
  templateUrl: './curso-notas.component.html',
  styleUrls: ['./curso-notas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CursoNotasComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _NotaService:NotaService
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  @Input() IdMatricula=0;
  public charge=false;
  public CursosCriterios:any;
  public CursoAbierto=-1;
  public PromedioFinal=0;

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdMatricula!=0){
      this.ObtenerCursosProgramaPorIdMatricula(this.IdMatricula);
    }
  }

  ObtenerCursosProgramaPorIdMatricula(idMatricula:number){
    this.PromedioFinal=0;
    this._NotaService.ObtenerCursosProgramaPorIdMatricula(idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.CursosCriterios=x;
        let cont=0;
        this.CursosCriterios.forEach((x:any) => {
          this.PromedioFinal=this.PromedioFinal+x.notaCurso;
          cont++
        });
        this.PromedioFinal=this.PromedioFinal/cont
      }
    })
  }

}
