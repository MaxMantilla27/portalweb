import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';

@Component({
  selector: 'app-resultado-pago-webpay',
  templateUrl: './resultado-pago-webpay.component.html',
  styleUrls: ['./resultado-pago-webpay.component.scss']
})
export class ResultadoPagoWebpayComponent implements OnInit {

  private signal$ = new Subject()
  constructor(
    private _FormaPagoService:FormaPagoService,
    private _ActivatedRoute:ActivatedRoute,
    public dialog:MatDialog
  ) { }
  public json={
    IdentificadorTransaccion:null,
    TokenComercio:''
  }
  
  resultProceso:any;
  resultWebpay:any; 
  dialogRef:any
  public ruta=''

  ngOnInit(): void {
    this._ActivatedRoute.queryParams.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.json.TokenComercio = x['token_ws'];
        this.json.IdentificadorTransaccion = null;
        this.dialogRef =this.dialog.open(ChargeComponent,{
          panelClass:'dialog-charge',
          disableClose:true
        });
        this.ObtenerResultadoProcesopagoWebpay()
      },
    });
  }

  ObtenerPreProcesoPagoOrganicoAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoAlumnoWebPay(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log("RespuetaOtra :",x)
        this.resultProceso=x._Repuesta;
        this.resultProceso.total=0;
        this.dialogRef.close()
      }
    })
  }

  ObtenerResultadoProcesopagoWebpay(){
    let token_ws =(this.json.TokenComercio).toString()
    this._FormaPagoService.ObtenerConfirmacionWebPay(token_ws).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log("RespuestaWEbpay",x)
        this.resultWebpay = x._Repuesta;
        this.ObtenerPreProcesoPagoOrganicoAlumno()
      }
    })
  }

  redireccionarAPagos(){
    let url = "https://img.bsgrupo.com/AulaVirtual/MisPagos";
    //let url = "https://bsginstitute.com/AulaVirtual/MisPagos";
    window.location.href =url;
  }

}
