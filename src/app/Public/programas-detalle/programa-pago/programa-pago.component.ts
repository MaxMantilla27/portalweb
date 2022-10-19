import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ImagenTarjetas } from 'src/app/Core/Shared/ImagenTarjetas';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
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
    private _HelperService:HelperService
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
    this.data.alumno=this.data.alumno.length>0?this.data.alumno+',':''
    this.MedioPagoActivoPasarelaPortal();
    this.ListMontoPagoCompleto();
  }
  MedioPagoActivoPasarelaPortal(){
    this._MedioPagoActivoPasarelaService.MedioPagoActivoPasarelaPortal(this.data.idPais).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.tarjetas=x
      }
    })
  }
  ListMontoPagoCompleto(){
    this._SeccionProgramaService.ListMontoPagoCompleto(this.data.idBusqueda).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.formapago=x.listaMontoPagoProgramaInformacionDTO
      }
    })
  }
  change(){
    this.EventoInteraccionSelect('Selecciona tu metodo de pago',this.medioCodigo)
    this.imgMedioPago=this._t.GetTarjeta(this.medioCodigo)
    this.medioPago=this.tarjetas.find((x:any)=>x.medioCodigo==this.medioCodigo).medioPago
  }
  changeForma(){
    var fp=this.formapago[this.idFormaPago]

    var value=''
    if(fp.paquete==1){
      value='Versión Basica,'
    }
    if(fp.paquete==2){
      value='Versión Profesional,'
    }
    if(fp.paquete==3){
      value='Versión Gerencial,'
    }
    if(fp.idTipoPago==1){
      value+='al Contado: '+fp.simbolo+' '+fp.cuotas
    }
    if(fp.idTipoPago==2){
      value+='pago en 1 matricula de'+
      fp.simbolo+' '+fp.matricula+
      ' y '+fp.nroCuotas+' cuotas mensuales de '+fp.simbolo+' '+fp.cuotas
    }
    this.EventoInteraccionSelect('Selecciona tu forma de pago',value)
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

  EventoInteraccion(){
    this._HelperService.enviarMsjAcciones({Tag:'Button',Nombre:'Ir a pagar'})
  }
  EventoInteraccionSelect(nombre:string,valor:string){
    this._HelperService.enviarMsjAcciones({Tag:'Select',Nombre:nombre,Tipo:'Select',Valor:valor})
  }
  EventoInteraccionSelectClick(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Select',Nombre:nombre,Tipo:'Click'})
  }
}
