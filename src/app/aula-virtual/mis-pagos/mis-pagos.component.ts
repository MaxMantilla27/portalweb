import { Component, OnInit } from '@angular/core';
import { CronogramaPagoService } from 'src/app/Core/Shared/Services/CronogramaPago/cronograma-pago.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-mis-pagos',
  templateUrl: './mis-pagos.component.html',
  styleUrls: ['./mis-pagos.component.scss']
})
export class MisPagosComponent implements OnInit {

  constructor(
    private _HelperService: HelperService,
    private _CronogramaPagoService:CronogramaPagoService
  ) { }

  public migaPan = [
    {
      titulo: 'Mis pagos',
      urlWeb: '/AulaVirtual/MisPagos',
    },
  ];
  public textoBienvenido = '';
  public misPagos:any
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.subscribe((x) => {

      this.textoBienvenido =x.datosAlumno.nombres+
      ', aquí podrás realizar los pagos de tus cronogramas de cuotas';
    })
    this.ObtenerCronogramaPagoAlumno()
  }
  ObtenerCronogramaPagoAlumno(){
    this._CronogramaPagoService.ObtenerCronogramaPagoAlumno().subscribe({
      next:x=>{
        console.log(x)
        this.misPagos=x.cronogramas
      }
    })
  }
}
