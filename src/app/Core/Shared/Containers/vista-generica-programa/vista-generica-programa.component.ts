import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-vista-generica-programa',
  templateUrl: './vista-generica-programa.component.html',
  styleUrls: ['./vista-generica-programa.component.scss']
})
export class VistaGenericaProgramaComponent implements OnInit {

  @Input() encabezado: any = {}
  @Input() listado: any = []
  @Input() confs: any = {}
  @Input() migaPan: any = []
  @Input() Interaccion=''
  constructor() { }

  ngOnInit(): void {
  }

}
