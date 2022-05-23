import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modulo-sesiones',
  templateUrl: './modulo-sesiones.component.html',
  styleUrls: ['./modulo-sesiones.component.scss']
})
export class ModuloSesionesComponent implements OnInit {

  constructor() { }
  @Input() Capitulo='';
  @Input() estructuraCapitulo:any;
  @Input() idModalidad:number=2
  ngOnInit(): void {
    console.log(this.estructuraCapitulo)
  }

}
