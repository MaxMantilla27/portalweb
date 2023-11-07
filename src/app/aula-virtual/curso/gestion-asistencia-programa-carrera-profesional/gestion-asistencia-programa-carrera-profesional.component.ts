import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestion-asistencia-programa-carrera-profesional',
  templateUrl: './gestion-asistencia-programa-carrera-profesional.component.html',
  styleUrls: ['./gestion-asistencia-programa-carrera-profesional.component.scss']
})
export class GestionAsistenciaProgramaCarreraProfesionalComponent implements OnInit {

  constructor() { }

  @Input() IdMatriculaCabecera = 0;
  @Input() Asistencias:any;
  @Input() Cursos:any;
  public Semestres:any;
  public OpenProx=false;
  public SemestreSelect=0;

  ngOnInit(): void {
    console.log(this.IdMatriculaCabecera)
    console.log(this.Asistencias)
    this.Semestres=[];
    let count=0;
    this.Asistencias.forEach((a:any) => {
      if( this.Semestres.filter((w:any) => w.idCiclo == a.idCiclo).length>0==false){
        this.Semestres.push({
          valor:count,
          idCiclo:a.idCiclo,
          open:false
        })
        count++
      }
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
  OpenSemestre(SemestreSeleccionado:number){
    this.Semestres.forEach((e:any) => {
      if(e.valor==SemestreSeleccionado)
      e.open=!e.open
    })
  }

}
