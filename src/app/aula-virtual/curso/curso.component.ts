import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CursoComponent implements OnInit {

  constructor() { }

  public migaPan = [
    {
      titulo: 'Mis Cursos',
      urlWeb: '/AulaVirtual/MisCursos',
    },
    {
      titulo: '',
      urlWeb: '/',
    },
    {
      titulo: '',
      urlWeb: '/',
    },
  ];
  ngOnInit(): void {
  }

}
