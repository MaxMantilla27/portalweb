import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modulo-sesiones-prueba',
  templateUrl: './modulo-sesiones-prueba.component.html',
  styleUrls: ['./modulo-sesiones-prueba.component.scss']
})
export class ModuloSesionesPruebaComponent implements OnInit {

  constructor() { }
  @Input() Capitulo='';
  @Input() estructuraCapitulo:any;
  @Input() idModalidad:number=2
  ngOnInit(): void {
    console.log(this.estructuraCapitulo)
  }

}
