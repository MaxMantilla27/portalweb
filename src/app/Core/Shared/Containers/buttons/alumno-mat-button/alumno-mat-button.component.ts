import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { Router } from '@angular/router';
import { BasicUrlIcon } from 'src/app/Core/Models/BasicDTO';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { HelperService } from '../../../Services/helper.service';
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
export class AlumnoMatButtonComponent implements OnInit,OnChanges {
  constructor(
    private _SessionStorageService: SessionStorageService,
    private _router: Router,
    private _HelperService: HelperService,

  ) {}
  @Input() nombres: string = '';
  @Input() user: string = '';
  @Input() val:any;
  public DatoObservable: DatoObservableDTO ={
    datoAvatar: false,
    datoContenido: false,
  }
  public buttons: Array<BasicUrlIcon> = [];
  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.val!=undefined){
      if(this.val.IdProveedor==0){
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
      }else{
        if(this.val.cursos>0){
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
        this.buttons.push({
          Nombre: 'Docencia',
          Url: '/AulaVirtual/Docencia',
          Icon: 'account_box',
          value: '',
        });
      }
    }
  }
  cerrarSesion() {
    this._SessionStorageService.DeleteToken();
    this._HelperService.enviarDatoCuenta(this.DatoObservable);
    console.log(this.DatoObservable);
    this._router.navigate(['/login']);
  }
}
