import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-curso-certificado',
  templateUrl: './curso-certificado.component.html',
  styleUrls: ['./curso-certificado.component.scss']
})
export class CursoCertificadoComponent implements OnInit {

  constructor() { }
  @Input() idProyecto:any;
  @Input() idPGeneral=0;;
  @Input() idPEspecifico=0;
  @Input() curso:any;
  ngOnInit(): void {
  }

}
