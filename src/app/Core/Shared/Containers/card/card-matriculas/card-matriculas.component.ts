import { Component, Input, OnInit } from '@angular/core';
import { CardMatriculasDTO } from 'src/app/Core/Models/BasicDTO';

@Component({
  selector: 'app-card-matriculas',
  templateUrl: './card-matriculas.component.html',
  styleUrls: ['./card-matriculas.component.scss']
})
export class CardMatriculasComponent implements OnInit {

  constructor() { }

  @Input() cardContent:CardMatriculasDTO={Img:'',Title:'',ImgAlt:'',Tipo:1,Url:''};
  ngOnInit(): void {
  }
  updateUrl() {
    this.cardContent.Img = '../../../../../../assets/imagenes/sello.jpg';
  }
}
