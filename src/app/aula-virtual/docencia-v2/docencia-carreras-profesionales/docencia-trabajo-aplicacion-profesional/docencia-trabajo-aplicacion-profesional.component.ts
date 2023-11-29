import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-docencia-trabajo-aplicacion-profesional',
  templateUrl: './docencia-trabajo-aplicacion-profesional.component.html',
  styleUrls: ['./docencia-trabajo-aplicacion-profesional.component.scss']
})
export class DocenciaTrabajoAplicacionProfesionalComponent implements OnInit,OnChanges ,OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdPespecifico>0){

    }
  }
  @Input() IdPespecifico=0
  public OperCrear=true
  public OperCalificar=false
  ngOnInit(): void {
  }

}
