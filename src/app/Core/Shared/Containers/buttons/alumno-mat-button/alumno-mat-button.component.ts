import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { BasicUrlIcon } from 'src/app/Core/Models/BasicDTO';

@Component({
  selector: 'app-alumno-mat-button',
  templateUrl: './alumno-mat-button.component.html',
  styleUrls: ['./alumno-mat-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'contentMat' },
    },
  ],
})
export class AlumnoMatButtonComponent implements OnInit {

  constructor() { }
  @Input() nombres:string='';
  @Input() user:string='';
  public buttons:Array<BasicUrlIcon>=[]
  ngOnInit(): void {
    this.buttons.push({Nombre:'Mi Perfil',Url:'/',Icon:'folder_open',value:''})
    this.buttons.push({Nombre:'Mis Cursos',Url:'/',Icon:'play_lesson',value:''})
    this.buttons.push({Nombre:'Mis Pagos',Url:'/',Icon:'credit_card',value:''})
    this.buttons.push({Nombre:'Accesos de Prueba',Url:'/',Icon:'badge',value:''})
  }

}
