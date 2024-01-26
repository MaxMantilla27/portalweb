import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { HelperService } from '../../Services/helper.service';

@Component({
  selector: 'app-header-chatbot',
  templateUrl: './header-chatbot.component.html',
  styleUrls: ['./header-chatbot.component.scss'],
})
export class HeaderChatbotComponent implements OnInit {
  constructor(private _HelperService: HelperService) {}

  OnClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() nombre = '';

  ngOnInit(): void {}

  EventoInteraccionEducacion(nombre: string) {
    this._HelperService.enviarMsjAcciones({
      Tag: 'Link',
      Nombre: nombre,
      Seccion: 'Menu cabecera',
    });
  }
}
