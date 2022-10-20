import { Component, Input, OnInit } from '@angular/core';
import { ArticuloDTO } from 'src/app/Core/Models/ArticuloDTO';
import { HelperService } from '../../../Services/helper.service';

@Component({
  selector: 'app-card-white-papers',
  templateUrl: './card-white-papers.component.html',
  styleUrls: ['./card-white-papers.component.scss']
})
export class CardWhitePapersComponent implements OnInit {

  constructor(
    private _HelperService :HelperService,
    ) { }

  @Input() cardContent:ArticuloDTO={descripcion:'',descripcionGeneral:'',idArea:0,idWeb:0,imgPortada:'',imgPortadaAlt:'',nombre:'',urlWeb:''};
  ngOnInit(): void {
    this.cardContent.imgPortada=this.cardContent.imgPortada.toLowerCase();
    this.cardContent.imgPortada=this.cardContent.imgPortada.split('´').join('');
  }

  EventoInteraccion(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Link',Nombre:'Descargar >',Programa:nombre,Seccion:'White Papers'})
  }
}
