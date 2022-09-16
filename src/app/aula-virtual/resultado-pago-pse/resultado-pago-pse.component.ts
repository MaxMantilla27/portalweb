import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-resultado-pago-pse',
  templateUrl: './resultado-pago-pse.component.html',
  styleUrls: ['./resultado-pago-pse.component.scss']
})
export class ResultadoPagoPSEComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _ActivatedRoute:ActivatedRoute,

  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public ruta=''
  public estado=0
  ngOnInit(): void {
    this.ruta='/AulaVirtual/MisPagos'
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.estado = x['estado'];
      },
    });
  }

}
