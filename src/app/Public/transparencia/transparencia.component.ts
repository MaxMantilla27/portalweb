import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transparencia',
  templateUrl: './transparencia.component.html',
  styleUrls: ['./transparencia.component.scss']
})
export class TransparenciaComponent implements OnInit {

  constructor() { }
  public migaPan = [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: 'Transparencia',
      urlWeb: '/Transparencia'
    }
  ]
  ngOnInit(): void {
  }

}
