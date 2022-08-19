import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent implements OnInit {

  constructor(
    private title:Title
  ) { }

  public migaPan = [
    {
      titulo: 'Categorias',
      urlWeb: '/AulaVirtual/Categoria',
    },
  ];
  ngOnInit(): void {
    let t:string='Categorias'
    this.title.setTitle(t)
  }

}
