import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modulo-sesiones-online',
  templateUrl: './modulo-sesiones-online.component.html',
  styleUrls: ['./modulo-sesiones-online.component.scss']
})
export class ModuloSesionesOnlineComponent implements OnInit , OnChanges,OnDestroy {
  private signal$ = new Subject();
  constructor() { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdPespecifico>0){

    }
  }

  @Input() IdPespecifico=0;
  ngOnInit(): void {
  }

}
