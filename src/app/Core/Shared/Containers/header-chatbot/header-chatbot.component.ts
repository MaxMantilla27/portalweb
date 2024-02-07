import { Component, EventEmitter, Input, OnInit, HostListener } from '@angular/core';
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

  pantalla = false


  ngOnInit(): void {
    this.validarTamañoVentana();
  }

  // EventoInteraccionEducacion(nombre: string) {
  //   this._HelperService.enviarMsjAcciones({
  //     Tag: 'Link',
  //     Nombre: nombre,
  //     Seccion: 'Menu cabecera',
  //   });
  // }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.validarTamañoVentana();
  }
  

  private validarTamañoVentana() {
    const width = window.innerWidth;

    if (width < 600) {
      console.log('Ventana pequeña');
      this.pantalla = true;
    } else {
      console.log('Ventana grande');
      this.pantalla = false;

    }
  }


}
