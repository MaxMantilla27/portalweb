import { Component, Input, OnInit } from '@angular/core';
import { CardProgramasDTO } from 'src/app/Core/Models/BasicDTO';

@Component({
  selector: 'app-card-articulos',
  templateUrl: './card-articulos.component.html',
  styleUrls: ['./card-articulos.component.scss']
})
export class CardArticulosComponent implements OnInit {

  constructor() { }

  @Input() cardContent:CardProgramasDTO={Content:'',Img:'',Url:'',Title:'',ImgAlt:''};
  ngOnInit(): void {
  }

}
