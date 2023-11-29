import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-docencia-examen-suficiencia-profesional',
  templateUrl: './docencia-examen-suficiencia-profesional.component.html',
  styleUrls: ['./docencia-examen-suficiencia-profesional.component.scss']
})
export class DocenciaExamenSuficienciaProfesionalComponent implements OnInit ,OnChanges ,OnDestroy {
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
