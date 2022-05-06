import { Component, Input, OnInit } from '@angular/core';
import { ArticuloDTO } from 'src/app/Core/Models/ArticuloDTO';

@Component({
  selector: 'app-card-white-papers',
  templateUrl: './card-white-papers.component.html',
  styleUrls: ['./card-white-papers.component.scss']
})
export class CardWhitePapersComponent implements OnInit {

  constructor() { }

  @Input() cardContent:ArticuloDTO={descripcion:'',descripcionGeneral:'',idArea:0,idWeb:0,imgPortada:'',imgPortadaAlt:'',nombre:'',urlWeb:''};
  ngOnInit(): void {
    this.cardContent.imgPortada=this.cardContent.imgPortada.toLowerCase();
    this.cardContent.imgPortada=this.cardContent.imgPortada.split('´').join('');
  }

}
