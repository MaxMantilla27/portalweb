import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CronogramaPagoService } from 'src/app/Core/Shared/Services/CronogramaPago/cronograma-pago.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-mis-pagos',
  templateUrl: './mis-pagos.component.html',
  styleUrls: ['./mis-pagos.component.scss']
})
export class MisPagosComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _HelperService: HelperService,
    private _CronogramaPagoService:CronogramaPagoService
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  public migaPan = [
    {
      titulo: 'Mis pagos',
      urlWeb: '/AulaVirtual/MisPagos',
    },
  ];
  public textoBienvenido = '';
  public misPagos:any
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {

      this.textoBienvenido =x.datosAlumno.nombres+
      ', aquí podrás realizar los pagos según tu cronograma de cuotas';
    })
    this.ObtenerCronogramaPagoAlumno()
  }
  ObtenerCronogramaPagoAlumno(){
    this._CronogramaPagoService.ObtenerCronogramaPagoAlumno().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.misPagos=x.cronogramas
      }
    })
  }
}
