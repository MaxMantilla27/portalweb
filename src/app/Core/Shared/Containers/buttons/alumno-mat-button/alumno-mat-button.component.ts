import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { Router } from '@angular/router';
import { BasicUrlIcon } from 'src/app/Core/Models/BasicDTO';
import { SessionStorageService } from '../../../Services/session-storage.service';

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
  constructor(
    private _SessionStorageService: SessionStorageService,
    private _router: Router
  ) {}
  @Input() nombres: string = '';
  @Input() user: string = '';
  public buttons: Array<BasicUrlIcon> = [];
  ngOnInit(): void {
    this.buttons.push({
      Nombre: 'Mis Cursos',
      Url: '/AulaVirtual/MisCursos',
      Icon: 'play_lesson',
      value: '',
    });
    this.buttons.push({
      Nombre: 'Ver mi perfil',
      Url: '/AulaVirtual/MiPerfil',
      Icon: 'folder_open',
      value: '',
    });
    this.buttons.push({
      Nombre: 'Cambiar Contraseña',
      Url: '/AulaVirtual/ChangePassword',
      Icon: 'credit_card',
      value: '',
    });
    this.buttons.push({
      Nombre: 'Categorias',
      Url: '/',
      Icon: 'badge',
      value: '',
    });
  }
  cerrarSesion() {
    this._SessionStorageService.DeleteToken();
    this._router.navigate(['/login']);
  }
}
