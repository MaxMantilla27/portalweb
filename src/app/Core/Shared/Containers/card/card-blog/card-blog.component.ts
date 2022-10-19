import { Component, Input, OnInit } from '@angular/core';
import { ArticuloDTO } from 'src/app/Core/Models/ArticuloDTO';
import { HelperService } from '../../../Services/helper.service';

@Component({
  selector: 'app-card-blog',
  templateUrl: './card-blog.component.html',
  styleUrls: ['./card-blog.component.scss']
})
export class CardBlogComponent implements OnInit {

  constructor(
    private _HelperService :HelperService,
  ) { }

  @Input() cardContent:ArticuloDTO={descripcion:'',descripcionGeneral:'',idArea:0,idWeb:0,imgPortada:'',imgPortadaAlt:'',nombre:'',urlWeb:''};
  @Input() idTipoArticulo=1;
  @Input() Interaccion=''
  ngOnInit(): void {
  }

  EventoInteraccion(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Link',Nombre:'Leer más >',Programa:nombre,Seccion:this.Interaccion})
  }
}
