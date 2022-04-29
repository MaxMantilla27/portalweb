import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CardProgramasDTO } from 'src/app/Core/Models/BasicDTO';

@Component({
  selector: 'app-card-programas',
  templateUrl: './card-programas.component.html',
  styleUrls: ['./card-programas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CardProgramasComponent implements OnInit {

  constructor() { }
  @Input() cardContent:CardProgramasDTO={Content:'',Img:'',Url:'',Title:'',ImgAlt:''};
  ngOnInit(): void {
  }

}
