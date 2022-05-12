import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CursoComponent implements OnInit {

  constructor() { }
  public tabIndex=0;
  public IndicacionActive=false;
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
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);
    if(tabChangeEvent.index>=5 && this.IndicacionActive==true){
      this.IndicacionActive=false
    }
  }
  actual(e:any){
    console.log(e)
  }
  changeIndexIndicaciones(index:number){
    this.IndicacionActive=true;
    this.tabIndex=index
  }
}
