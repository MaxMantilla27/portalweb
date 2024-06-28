import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chat-atencion-cliente',
  templateUrl: './chat-atencion-cliente.component.html',
  styleUrls: ['./chat-atencion-cliente.component.scss']
})
export class ChatAtencionClienteComponent implements OnInit {

  constructor() { }
  public Open: boolean=false
  isBubbleOpen: boolean = false;
  stateAsesor:boolean =true;
  @Output()
  IsOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  public img='https://proceso-pago.bsginstitute.com/img-web/chatV2/'

  ngOnInit(): void {
  }

}
