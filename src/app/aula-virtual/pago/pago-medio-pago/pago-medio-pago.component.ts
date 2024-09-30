import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ImagenTarjetas } from 'src/app/Core/Shared/ImagenTarjetas';
import { MedioPagoActivoPasarelaService } from 'src/app/Core/Shared/Services/MedioPagoActivoPasarela/medio-pago-activo-pasarela.service';

@Component({
  selector: 'app-pago-medio-pago',
  templateUrl: './pago-medio-pago.component.html',
  styleUrls: ['./pago-medio-pago.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class PagoMedioPagoComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _MedioPagoActivoPasarelaService:MedioPagoActivoPasarelaService,
    private _t:ImagenTarjetas
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  @Input() IdMatriculaCabecera=0;
  @Input() CronogramaPago:any;
  @Input() DatosFacturacion:any;
  public tarjetas:any;
  public validadorPagosMultiples:any;
  public validadorPagosChile: boolean = false;
  ngOnInit(): void {
    console.log(this.IdMatriculaCabecera)
    console.log(this.CronogramaPago)
  }
  ObtenerTarjetasMedioPago(){
    this._MedioPagoActivoPasarelaService.MedioPagoPasarelaPortalCronograma(this.IdMatriculaCabecera).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.validadorPagosMultiples = x.filter((item:any) => item.idPasarelaPago === 7 || item.idPasarelaPago === 10);
        this.validadorPagosChile = x.filter((item:any) => item.idPasarelaPago === 11 || item.idPasarelaPago === 17).length > 0 ? true : false;
        this.tarjetas=x
        this.tarjetas.forEach((e:any) => {
          e.img=this._t.GetTarjeta(e.medioCodigo)
        });
        console.log("Tarjetas por alumno",this.tarjetas)
      },
      complete:()=> {
        // this.ObtenerInformacionPagoLocal()
      },
    })
  }

}
