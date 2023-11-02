import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-tramites-carrera',
  templateUrl: './card-tramites-carrera.component.html',
  styleUrls: ['./card-tramites-carrera.component.scss']
})
export class CardTramitesCarreraComponent implements OnInit {

  constructor() { }

  @Input() Titulo='';

  @Input() img='';
  ngOnInit(): void {
  }

  getUrl()
  {
    return "url('../../../../../assets/icons/"+this.img+"')";
  }
}
