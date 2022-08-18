import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-chat-z',
  templateUrl: './chat-z.component.html',
  styleUrls: ['./chat-z.component.scss']
})
export class ChatZComponent implements OnInit {

  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
  ) { }

  ngOnInit(): void {
    this.addChat()
  }
  addChat(){

    let script = this._renderer2.createElement('script');
    script.type="text/javascript"
    //publicKey: "key_NkUEio2hSx5H1zf7n5KueMw", --key de pruebas
    script.text = `
      window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=
      d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
      _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute("charset","utf-8");
      $.src="https://v2.zopim.com/?351554CrfFzyginojQs3k8FasR1VZmkU";z.t=+new Date;$.
      type="text/javascript";e.parentNode.insertBefore($,e)})(document,"script");
    `;

    console.log(script)
    this._renderer2.appendChild(this._document.getElementById('chat'), script);
  }
}
