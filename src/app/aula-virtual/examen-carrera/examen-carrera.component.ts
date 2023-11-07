import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment  from 'moment';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-examen-carrera',
  templateUrl: './examen-carrera.component.html',
  styleUrls: ['./examen-carrera.component.scss']
})
export class ExamenCarreraComponent implements OnInit {

  constructor(
    private _HelperService: HelperService,
    ) { }

  public minutos=45
  public segundos=0
  public interval:any;
  public vertiempo=true
  public fechaInicio=new Date();
  public preguntaSeleccionada=0
  public Preguntas=[
    {
      pregunta:'¿ Cómo se llama la guía donde presentan estándares, pautas y normas para la gestión de proyectos?',
      puntos:6,
      tipo:1,
      Respondida:false,
      alternativas:[
       {
        select:false,
        titulo:'eBOOK SMRP',
       },
       {
        select:false,
        titulo:'PMBOK Guide',
       },
       {
        select:false,
        titulo:'Guide KANBAN',
       }
      ]
    },
    {
      pregunta:'Un EDT es una estructura de desglose de trabajo',
      puntos:6,
      tipo:0,
      Respondida:false,
      alternativas:[
       {
        select:false,
        titulo:'Verdadero',
       },
       {
        select:false,
        titulo:'Verdadero',
       }
      ]
    },
    {
      pregunta:'¿La guía PMBOK me dice como resolver los problemas de un proyecto?',
      puntos:6,
      tipo:0,
      Respondida:false,
      alternativas:[
        {
          select:false,
         titulo:'Verdadero',
        },
        {
          select:false,
         titulo:'Verdadero',
        }
      ]
    },
    {
      pregunta:'Un EDT se compone de 3 niveles',
      puntos:6,
      tipo:0,
      Respondida:false,
      alternativas:[
        {
          select:false,
         titulo:'Verdadero',
        },
        {
          select:false,
         titulo:'Verdadero',
        }
      ]
    },
    {
      pregunta:'¿ Cómo se llama la guía donde presentan estándares, pautas y normas para la gestión de proyectos?',
      puntos:6,
      tipo:1,
      Respondida:false,
      alternativas:[
       {
        select:false,
        titulo:'eBOOK SMRP',
       },
       {
        select:false,
        titulo:'PMBOK Guide',
       },
       {
        select:false,
        titulo:'Guide KANBAN',
       }
      ]
    },
    {
      pregunta:'¿Qué se hace en el proceso Controlar la Calidad?',
      puntos:6,
      tipo:2,
      Respondida:false,
      alternativas:[
       {
        select:false,
        titulo:'eBOOK SMRP',
       },
       {
        select:false,
        titulo:'PMBOK Guide',
       },
       {
        select:false,
        titulo:'Guide KANBAN',
       }
      ]
    },
    {
      pregunta:'¿ Cómo se llama la guía donde presentan estándares, pautas y normas para la gestión de proyectos?',
      puntos:6,
      tipo:1,
      Respondida:false,
      alternativas:[
       {
        select:false,
        titulo:'eBOOK SMRP',
       },
       {
        select:false,
        titulo:'PMBOK Guide',
       },
       {
        select:false,
        titulo:'Guide KANBAN',
       }
      ]
    },
    {
      pregunta:'¿ Cómo se llama la guía donde presentan estándares, pautas y normas para la gestión de proyectos?',
      puntos:6,
      tipo:1,
      Respondida:false,
      alternativas:[
       {
        select:false,
        titulo:'eBOOK SMRP',
       },
       {
        select:false,
        titulo:'PMBOK Guide',
       },
       {
        select:false,
        titulo:'Guide KANBAN',
       }
      ]
    },
    {
      pregunta:'¿ Cómo se llama la guía donde presentan estándares, pautas y normas para la gestión de proyectos?',
      puntos:6,
      tipo:1,
      Respondida:false,
      alternativas:[
       {
        select:false,
        titulo:'eBOOK SMRP',
       },
       {
        select:false,
        titulo:'PMBOK Guide',
       },
       {
        select:false,
        titulo:'Guide KANBAN',
       }
      ]
    },
    {
      pregunta:'¿ Cómo se llama la guía donde presentan estándares, pautas y normas para la gestión de proyectos?',
      puntos:6,
      tipo:1,
      Respondida:false,
      alternativas:[
       {
        select:false,
        titulo:'eBOOK SMRP',
       },
       {
        select:false,
        titulo:'PMBOK Guide',
       },
       {
        select:false,
        titulo:'Guide KANBAN',
       }
      ]
    },
    {
      pregunta:'¿ Cómo se llama la guía donde presentan estándares, pautas y normas para la gestión de proyectos?',
      puntos:6,
      tipo:1,
      Respondida:false,
      alternativas:[
       {
        select:false,
        titulo:'eBOOK SMRP',
       },
       {
        select:false,
        titulo:'PMBOK Guide',
       },
       {
        select:false,
        titulo:'Guide KANBAN',
       }
      ]
    },
    {
      pregunta:'¿ Cómo se llama la guía donde presentan estándares, pautas y normas para la gestión de proyectos?',
      puntos:6,
      tipo:1,
      Respondida:false,
      alternativas:[
       {
        select:false,
        titulo:'eBOOK SMRP',
       },
       {
        select:false,
        titulo:'PMBOK Guide',
       },
       {
        select:false,
        titulo:'Guide KANBAN',
       }
      ]
    },
    {
      pregunta:'¿ Cómo se llama la guía donde presentan estándares, pautas y normas para la gestión de proyectos?',
      puntos:6,
      tipo:1,
      Respondida:false,
      alternativas:[
       {
        select:false,
        titulo:'eBOOK SMRP',
       },
       {
        select:false,
        titulo:'PMBOK Guide',
       },
       {
        select:false,
        titulo:'Guide KANBAN',
       }
      ]
    },
    {
      pregunta:'¿ Cómo se llama la guía donde presentan estándares, pautas y normas para la gestión de proyectos?',
      puntos:6,
      tipo:1,
      Respondida:false,
      alternativas:[
       {
        select:false,
        titulo:'eBOOK SMRP',
       },
       {
        select:false,
        titulo:'PMBOK Guide',
       },
       {
        select:false,
        titulo:'Guide KANBAN',
       }
      ]
    },
  ]
  ngOnInit(): void {
    this.cronometro()
  }
  @Output() Volver= new EventEmitter<void>();
  cronometro(){
    this.interval=setInterval(() => {
      var fecha1 = moment(this.fechaInicio);
      var fecha2 = moment(new Date());
      var segundoDif=fecha2.diff(fecha1, 'seconds')
      var totalSegundo=45*60

      if(segundoDif>totalSegundo){
        this.vertiempo=false
        clearInterval(this.interval);
        location.reload();
      }else{
        this.minutos=Math.floor((totalSegundo-segundoDif)/60);
        this.segundos=(totalSegundo-segundoDif)%60
      }
    }, 1000);
  }
  ChangeAlternat(idenxp:number,index:number){
    if(this.Preguntas[idenxp].tipo!=2){
      if(this.Preguntas[idenxp].alternativas[index].select==false){
        this.Preguntas[idenxp].alternativas.forEach(element => {
          element.select=false
        });
      }
    }
    this.Preguntas[idenxp].alternativas[index].select=!this.Preguntas[idenxp].alternativas[index].select
  }
  cambiarPregunta(i:number){
    var c=0
    this.Preguntas[this.preguntaSeleccionada].alternativas.forEach(element => {
      if(element.select==true){
        c++
      }
    });
    if(c>0){
      this.Preguntas[this.preguntaSeleccionada].Respondida=true
    }
    this.preguntaSeleccionada=i
  }
  Siguiente(){
    var c=0
    this.Preguntas[this.preguntaSeleccionada].alternativas.forEach(element => {
      if(element.select==true){
        c++
      }
    });
    if(c>0){
      this.Preguntas[this.preguntaSeleccionada].Respondida=true
    }
    this.preguntaSeleccionada++
  }
  Anterior(){
    this.preguntaSeleccionada=this.preguntaSeleccionada-1
  }
  finalizar(){
    this.Volver.emit()
  }
}
