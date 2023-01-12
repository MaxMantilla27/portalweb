import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sorteo',
  templateUrl: './sorteo.component.html',
  styleUrls: ['./sorteo.component.scss']
})
export class SorteoComponent implements OnInit {

  constructor() { }
  public migaPan = [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: 'Sorteo',
      urlWeb: '/sorteo',
    },
  ];
  ngOnInit(): void {
  }

}
