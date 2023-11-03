import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-certificado-carreras',
  templateUrl: './card-certificado-carreras.component.html',
  styleUrls: ['./card-certificado-carreras.component.scss']
})
export class CardCertificadoCarrerasComponent implements OnInit {

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
