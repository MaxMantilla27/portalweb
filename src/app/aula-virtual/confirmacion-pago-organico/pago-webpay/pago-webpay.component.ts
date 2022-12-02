import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegistroRespuestaPreProcesoPagoDTO } from 'src/app/Core/Models/ProcesoPagoDTO';
import { FormaPagoService } from 'src/app/Core/Shared/Services/FormaPago/forma-pago.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-pago-webpay',
  templateUrl: './pago-webpay.component.html',
  styleUrls: ['./pago-webpay.component.scss']
})
export class PagoWebpayComponent implements OnInit {
  private signal$ = new Subject()
  constructor(
    private _FormaPagoService:FormaPagoService,
    private _ActivatedRoute:ActivatedRoute,
    private _SessionStorageService:SessionStorageService,
  ) { }

  resultVisa:any
  url:string =""

  public json={
    IdentificadorTransaccion:'',
    TokenComercio:null
  }

  ngOnInit(): void {
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.json.IdentificadorTransaccion = x['Identificador'];
        this.json.TokenComercio=null
        this.ObtenerPreProcesoPagoOrganicoAlumno()
      },
    });
  }

  redireccionarAWebpay(){
    console.log(this.url)
    window.location.href = this.url;
  }

  ObtenerPreProcesoPagoOrganicoAlumno(){
    this._FormaPagoService.ObtenerPreProcesoPagoAlumnoWebPay(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.resultVisa=x._Repuesta;
        let webPayResponse =x._Repuesta.registroEnvioComercio
        this.resultVisa.total=0;
        this.url = webPayResponse.url + "?token_ws="+webPayResponse.token
      }
    })
  }


}
