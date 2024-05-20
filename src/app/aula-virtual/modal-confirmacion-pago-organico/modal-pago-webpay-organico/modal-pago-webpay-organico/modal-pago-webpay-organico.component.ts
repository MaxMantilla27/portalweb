import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-modal-pago-webpay-organico',
  templateUrl: './modal-pago-webpay-organico.component.html',
  styleUrls: ['./modal-pago-webpay-organico.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalPagoWebpayOrganicoComponent implements OnInit {

  private signal$ = new Subject()

  constructor(
    private _FormaPagoService:FormaPagoService,
    private _ActivatedRoute:ActivatedRoute,
    private _SessionStorageService:SessionStorageService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ModalPagoWebpayOrganicoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  public resultPreValidacion:any
  url:string =""
  public json={
    IdentificadorTransaccion:'',
    TokenComercio:null
  }
  ngOnInit(): void {
    if (this.data.Identificador){
      this.json.IdentificadorTransaccion = this.data.Identificador;
      this.json.TokenComercio=null
      this.ObtenerPreProcesoPagoCuotaAlumno()
    }
  }
  redireccionarAWebpay(){
    console.log(this.url)
    const dialogRef =this.dialog.open(ChargeComponent,{
      panelClass:'dialog-charge',
      disableClose:true
    });
    console.log(this.url)
    window.location.href = this.url;
  }
  ObtenerPreProcesoPagoCuotaAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoAlumnoWebPay(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        let webPayResponse =x._Repuesta.registroEnvioComercio
        this.url = webPayResponse.url + "?token_ws="+webPayResponse.token
        this._SessionStorageService.SessionSetValue('token_ws',x._Repuesta.tokenComercio);
        this.resultPreValidacion=x._Repuesta;
        this.resultPreValidacion.total= 0;
        if(this.resultPreValidacion.listaCuota!=undefined){
          this.resultPreValidacion.listaCuota.forEach((l:any) => {
            this.resultPreValidacion.total+=l.cuotaTotal
          });
        }
        else{
          this.resultPreValidacion.total=this.resultPreValidacion.montoTotal
        }
        if(this.resultPreValidacion.registroAlumno==undefined){
          this.resultPreValidacion.registroAlumno=this.resultPreValidacion.datoAlumno
        }
      }
    })
  }
  cerraModal(){
    this.dialogRef.close();
  }
}
