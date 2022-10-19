import { Component, Input, OnInit } from '@angular/core';
import { Basic } from 'src/app/Core/Models/BasicDTO';
import { listaTagDTO } from 'src/app/Core/Models/listaTagDTO';
import { HelperService } from '../../../Services/helper.service';

@Component({
  selector: 'app-tag-button',
  templateUrl: './tag-button.component.html',
  styleUrls: ['./tag-button.component.scss']
})
export class TagButtonComponent implements OnInit {

  constructor(
    private _HelperService :HelperService,
    ) { }

  @Input() tag: listaTagDTO = {nombre:'',codigo:''}
  @Input() Interaccion=''
  ngOnInit(): void {
  }

  EventoInteraccion(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Tag',Nombre:nombre,Seccion:this.Interaccion})
  }
}
