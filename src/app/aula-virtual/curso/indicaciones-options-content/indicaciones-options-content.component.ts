import { Component, Input, OnInit } from '@angular/core';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-indicaciones-options-content',
  templateUrl: './indicaciones-options-content.component.html',
  styleUrls: ['./indicaciones-options-content.component.scss']
})
export class IndicacionesOptionsContentComponent implements OnInit {

  constructor(
    private _HelperService :HelperService,
  ) { }

  @Input() title=''
  @Input() videoUrl=''
  @Input() TitlePrograma=''
  @Input() imgUrl=''

  @Input() TituloContenido=''
  @Input() COntenido=''
  ngOnInit(): void {
  }
  EventoInteraccion(){
    this._HelperService.enviarMsjAcciones({Tag:'Video',Programa:this.TitlePrograma,Seccion:this.title})
  }
}
