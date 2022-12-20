import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CardMatriculasDTO } from 'src/app/Core/Models/BasicDTO';
import { HelperService } from '../../../Services/helper.service';

@Component({
  selector: 'app-card-matriculas',
  templateUrl: './card-matriculas.component.html',
  styleUrls: ['./card-matriculas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CardMatriculasComponent implements OnInit {

  constructor(
    private _HelperService:HelperService
  ) { }

  @Input() cardContent:CardMatriculasDTO={Img:'',Title:'',ImgAlt:'',Tipo:1,Url:''};
  @Input() matricula:any
  ngOnInit(): void {
  }
  updateUrl() {
    this.cardContent.Img = '../../../../../../assets/imagenes/sello.jpg';
  }
  EventoInteraccion(){
    this._HelperService.enviarMsjAcciones({Tag:'Link',Nombre:this.cardContent.Title,Programa:this.cardContent.Title})
  }
}
