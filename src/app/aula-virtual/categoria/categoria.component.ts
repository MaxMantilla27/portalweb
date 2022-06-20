import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent implements OnInit {

  constructor() { }

  public migaPan = [
    {
      titulo: 'Categorias',
      urlWeb: '/AulaVirtual/Categoria',
    },
  ];
  ngOnInit(): void {
  }

}
