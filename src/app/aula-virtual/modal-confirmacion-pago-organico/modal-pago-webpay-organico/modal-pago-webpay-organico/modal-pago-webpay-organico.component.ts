import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-modal-pago-webpay-organico',
  templateUrl: './modal-pago-webpay-organico.component.html',
  styleUrls: ['./modal-pago-webpay-organico.component.scss']
})
export class ModalPagoWebpayOrganicoComponent implements OnInit {

  private signal$ = new Subject()

  constructor(
    private _FormaPagoService:FormaPagoService,
    private _ActivatedRoute:ActivatedRoute,
    private _SessionStorageService:SessionStorageService,
    public dialog: MatDialog,
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
        let webPayResponse =x._Repuesta.registroEnvioComercio
        this.url = webPayResponse.url + "?token_ws="+webPayResponse.token
        this._SessionStorageService.SessionSetValue('token_ws',x._Repuesta.tokenComercio);
        this.resultPreValidacion=x._Repuesta;
        this.resultPreValidacion.total= 0;
        this.resultPreValidacion.listaCuota.forEach((l:any) => {
          this.resultPreValidacion.total+=l.cuotaTotal
        });
      }
    })
  }
}
