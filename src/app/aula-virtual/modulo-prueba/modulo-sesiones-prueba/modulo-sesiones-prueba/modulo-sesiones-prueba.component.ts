import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-modulo-sesiones-prueba',
  templateUrl: './modulo-sesiones-prueba.component.html',
  styleUrls: ['./modulo-sesiones-prueba.component.scss']
})
export class ModuloSesionesPruebaComponent implements OnInit ,OnChanges{

  constructor() { }
  @Input() Capitulo='';
  @Input() estructuraCapitulo:any;
  @Input() idModalidad:number=2
  ngOnInit(): void {
    console.log(this.estructuraCapitulo)
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.estructuraCapitulo)
    console.log(this.idModalidad)
    if(this.estructuraCapitulo!=undefined){
      let i=0;
      while(i<this.estructuraCapitulo.length){
        if(this.estructuraCapitulo[i].id>0){
          this.estructuraCapitulo.splice(i,1)
        }else{
          i++
        }

      }
    }
  }
}
