import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestion-asistencia-programa',
  templateUrl: './gestion-asistencia-programa.component.html',
  styleUrls: ['./gestion-asistencia-programa.component.scss']
})
export class GestionAsistenciaProgramaComponent implements OnInit {

  constructor() { }

  @Input() IdMatriculaCabecera = 0;
  @Input() Asistencias:any;
  @Input() Cursos:any;

  ngOnInit(): void {
    console.log(this.IdMatriculaCabecera)
    console.log(this.Asistencias)
    this.Asistencias.forEach((a:any) => {
      a.open=false
      this.Cursos.forEach((c:any) => {
        if(a.idPEspecificoHijo==c.idPEspecificoHijo){
          a.Nombre=c.programaGeneralHijo,
          a.orden=c.orden
        }
      });
    });

    this.Asistencias.sort(function (a:any, b:any) {
      return a.orden - b.orden;
    })
    console.log(this.Cursos)
  }

}
