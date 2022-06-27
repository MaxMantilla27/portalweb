import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ImagenTarjetas } from 'src/app/Core/Shared/ImagenTarjetas';
import { MedioPagoActivoPasarelaService } from 'src/app/Core/Shared/Services/MedioPagoActivoPasarela/medio-pago-activo-pasarela.service';
import { SeccionProgramaService } from 'src/app/Core/Shared/Services/SeccionPrograma/seccion-programa.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-programa-pago',
  templateUrl: './programa-pago.component.html',
  styleUrls: ['./programa-pago.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProgramaPagoComponent implements OnInit ,OnDestroy{

  private signal$ = new Subject();
  constructor(
    public dialogRef: MatDialogRef<ProgramaPagoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _MedioPagoActivoPasarelaService:MedioPagoActivoPasarelaService,
    private _SeccionProgramaService:SeccionProgramaService,
    private _t:ImagenTarjetas,
    private _SnackBarServiceService:SnackBarServiceService,
  ) { }

  public tarjetas:any;
  public formapago:any;
  public medioPago=''
  public imgMedioPago=''
  public medioCodigo=''
  public idFormaPago=-1
  public idPEspecifico=0
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  ngOnInit(): void {
    console.log(this.data)
    this.MedioPagoActivoPasarelaPortal();
    this.ListMontoPagoCompleto();
  }
  MedioPagoActivoPasarelaPortal(){
    this._MedioPagoActivoPasarelaService.MedioPagoActivoPasarelaPortal(this.data.idPais).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.tarjetas=x
      }
    })
  }
  ListMontoPagoCompleto(){
    this._SeccionProgramaService.ListMontoPagoCompleto(this.data.idBusqueda).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.formapago=x.listaMontoPagoProgramaInformacionDTO
        console.log(x)
      }
    })
  }
  change(){
    this.imgMedioPago=this._t.GetTarjeta(this.medioCodigo)
    this.medioPago=this.tarjetas.find((x:any)=>x.medioCodigo==this.medioCodigo).medioPago
  }
  changeForma(){

  }
  Pagar(){
    if(this.medioCodigo.length>0){
      var formaPago=this.formapago[this.idFormaPago];

      var pEspecifico:any;
      this.data.modalidad.forEach((e:any) => {
        if(e.id==this.idPEspecifico){
          pEspecifico=e;
        }
      });
      var find=this.tarjetas.find((x:any)=>x.medioCodigo==this.medioCodigo)
      find.idPEspecifico=this.idPEspecifico;
      find.moneda=formaPago.simbolo
      find.webMoneda=formaPago.webMoneda
      if(formaPago.idTipoPago==1){
        find.montoTotal= formaPago.cuotas
      }else{
        find.montoTotal= formaPago.matricula
      }
      find.version=null
      if(formaPago.paquete==1){
        find.version='Versión basica'
      }
      if(formaPago.paquete==2){
        find.version='Versión profesional'
      }
      if(formaPago.paquete==3){
        find.version='Versión gerencial'
      }
      find.tipo=pEspecifico.tipo
      find.inicio=pEspecifico.fechaInicioTexto
      this.dialogRef.close(find)
    }else{
      this._SnackBarServiceService.openSnackBar("Seleccione su medio de pago",'x',10,"snackbarCrucigramaerror");
    }
  }
}
