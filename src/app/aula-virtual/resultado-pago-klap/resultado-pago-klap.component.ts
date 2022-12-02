import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';

@Component({
  selector: 'app-resultado-pago-klap',
  templateUrl: './resultado-pago-klap.component.html',
  styleUrls: ['./resultado-pago-klap.component.scss']
})
export class ResultadoPagoKlapComponent implements OnInit {

  private signal$ = new Subject()
  constructor(
    private _FormaPagoService:FormaPagoService,
    private _ActivatedRoute:ActivatedRoute,
    public dialog: MatDialog,
  ) { }

  resultProceso:any;
  resultKlap:any; 
  url=''
  dialogRef:any

  public json={
    IdentificadorTransaccion:'',
  }

  ngOnInit(): void {
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.json.IdentificadorTransaccion = x['Identificador'];
        this.ObtenerResultadoProcesopagoKlap()
        this.dialogRef =this.dialog.open(ChargeComponent,{
          panelClass:'dialog-charge',
          disableClose:true
        });
      },
    });
  }

  ObtenerResultadoProcesopagoKlap(){
    this._FormaPagoService.ConsultarPagoKlap(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x._Repuesta==true)
        {
          this.ObtenerPreProcesoPagoCuotaAlumno()
        }

      }
    })
  }

  ObtenerPreProcesoPagoCuotaAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoCuotaAlumno({
      IdentificadorTransaccion: this.json.IdentificadorTransaccion,
      RequiereDatosTarjeta: false
    }).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.resultProceso=x._Repuesta;
        this.dialogRef.close()
      }
    })
  }



  redireccionarAPagos(){
    let url = "https://img.bsgrupo.com/AulaVirtual/MisPagos";
    //let url = "https://bsginstitute.com/AulaVirtual/MisPagos";
    window.location.href =url;
  }

}
