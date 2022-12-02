import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-confirmacion-pago-izipay',
  templateUrl: './confirmacion-pago-izipay.component.html',
  styleUrls: ['./confirmacion-pago-izipay.component.scss']
})
export class ConfirmacionPagoIzipayComponent implements OnInit {

  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
  ) { }

  public resultPreValidacion:any

  ngOnInit(): void {
    this.iniciarScripsIzipay()
  }

  iniciarScripsIzipay(){

    let script = this._renderer2.createElement('script');
    script.src='https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js'
    script.setAttribute('kr-public-key',this.resultPreValidacion.procesoPagoBotonVisa.sessionKey)
    script.setAttribute('kr-post-url-success','web.html')
    this._renderer2.appendChild(this._document.getElementById('formActionIzipay'), script);
  }



}
