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
      a.orden=2000
      a.ver=false
      let i=1
      this.Cursos.forEach((c:any) => {
        if(a.idPEspecificoHijo==c.idPEspecificoHijo){
          a.ver=true
          a.Nombre=c.programaGeneralHijo,
          a.orden=i
        }
        i++
      });
    });

    this.Asistencias.sort(function (a:any, b:any) {
      return a.orden - b.orden;
    })
    console.log(this.Cursos)
  }

}
