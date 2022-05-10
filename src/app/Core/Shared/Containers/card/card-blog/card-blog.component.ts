import { Component, Input, OnInit } from '@angular/core';
import { ArticuloDTO } from 'src/app/Core/Models/ArticuloDTO';

@Component({
  selector: 'app-card-blog',
  templateUrl: './card-blog.component.html',
  styleUrls: ['./card-blog.component.scss']
})
export class CardBlogComponent implements OnInit {

  constructor() { }

  @Input() cardContent:ArticuloDTO={descripcion:'',descripcionGeneral:'',idArea:0,idWeb:0,imgPortada:'',imgPortadaAlt:'',nombre:'',urlWeb:''};
  @Input() idTipoArticulo=1;
  ngOnInit(): void {
  }

}
