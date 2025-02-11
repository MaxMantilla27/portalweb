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
  public OpenVideoModulo=true

  ngOnInit(): void {
    console.log(this.IdMatriculaCabecera)
    console.log(this.Cursos)
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
          if (c.fechasOnline) {
            const today = new Date().toISOString().split('T')[0];
            const fechaInicio = new Date(c.fechasOnline.fechaInicio).toISOString().split('T')[0];
            const fechaFin = new Date(c.fechasOnline.fechaFin).toISOString().split('T')[0];

            if (today < fechaInicio) {
              a.estadoCurso = 'Sin Iniciar';
            } else if (today >= fechaInicio && today <= fechaFin) {
              a.estadoCurso = 'En ejecución';
            } else if (today > fechaFin) {
              a.estadoCurso = 'Culminado';
            }
          }
          else{
            a.estadoCurso = 'No aplica';
          }
        }
        i++
      });
    });

    this.Asistencias.sort(function (a:any, b:any) {
      return a.orden - b.orden;
    })
    console.log('Asistencias',this.Asistencias)
    console.log(this.Cursos)
  }

}
