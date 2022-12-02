import { Component, Inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ImagenTarjetas } from 'src/app/Core/Shared/ImagenTarjetas';
import { MedioPagoActivoPasarelaService } from 'src/app/Core/Shared/Services/MedioPagoActivoPasarela/medio-pago-activo-pasarela.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-pago-tarjeta',
  templateUrl: './pago-tarjeta.component.html',
  styleUrls: ['./pago-tarjeta.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PagoTarjetaComponent implements OnInit ,OnDestroy{
  private signal$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<PagoTarjetaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _MedioPagoActivoPasarelaService:MedioPagoActivoPasarelaService,
    private _t:ImagenTarjetas,
    private _SnackBarServiceService:SnackBarServiceService,
  ) { }
  public tituloBotonModal:string=this.data.tituloBotonModal?this.data.tituloBotonModal:"Ir a pagar"
  public tarjetas:any;
  public medioPago=''
  public imgMedioPago=''
  public medioCodigo=''
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
    if(this.data.idMatricula!=undefined ){
      this.MedioPagoPasarelaPortalCronograma()
    }
  }
  MedioPagoPasarelaPortalCronograma(){
    this._MedioPagoActivoPasarelaService.MedioPagoPasarelaPortalCronograma(this.data.idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.tarjetas=x
      }
    })
  }
  change(){
    this.imgMedioPago=this._t.GetTarjeta(this.medioCodigo)
    this.medioPago=this.tarjetas.find((x:any)=>x.medioCodigo==this.medioCodigo).medioPago
  }
  Pagar(){
    if(this.medioCodigo.length>0){
      var find=this.tarjetas.find((x:any)=>x.medioCodigo==this.medioCodigo)
      this.dialogRef.close(find)
    }else{
      this._SnackBarServiceService.openSnackBar("Seleccione su medio de pago",'x',10,"snackbarCrucigramaerror");
    }
  }

}
