import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { Router } from '@angular/router';
import { FacebookLoginProvider, SocialAuthService } from 'angularx-social-login';
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
    private socialAuthService: SocialAuthService,

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
    this.buttons=[];
    // let isCarrera =JSON.parse(this._SessionStorageService.SessionGetValue('TipoCarrera'))
    let isCarrera =this._SessionStorageService.SessionGetValue('TipoCarrera')
    console.log(isCarrera)
    if(this.val!=undefined){
      if(this.val.IdProveedor==0){
        this.buttons.push({
          Nombre: 'Mis Cursos',
          Url: '/AulaVirtual/MisCursos',
          Icon: 'play_lesson',
          value:'../../../../../../assets/icons/mis-cursos.svg',
        });
        this.buttons.push({
          Nombre: 'Mis Pagos',
          Url: '/AulaVirtual/MisPagos',
          Icon: 'monetization_on',
          value: '../../../../../../assets/icons/mis-pagos.svg',
        });
        this.buttons.push({
          Nombre: 'Ver mi perfil',
          Url: '/AulaVirtual/MiPerfil',
          Icon: 'folder_open',
          value: '../../../../../../assets/icons/mi-perfil.svg',
        });
        this.buttons.push({
          Nombre: 'Cambiar Contraseña',
          Url: '/AulaVirtual/ChangePassword',
          Icon: 'credit_card',
          value: '../../../../../../assets/icons/cambiar-contrasena.svg',
        });
        this.buttons.push({
          Nombre: 'Categorias',
          Url: '/AulaVirtual/Categoria',
          Icon: 'badge',
          value: '../../../../../../assets/icons/categorias.svg',
        });
        // this.buttons.push({
        //     Nombre: 'Bolsa de Trabajo',
        //     Url: '/AulaVirtual/BolsaTrabajo',
        //     Icon: 'wallet_travel',
        //     value: '',
        // });
        // if(isCarrera==true){
        //   this.buttons.push({
        //     Nombre: 'Bolsa de Trabajo',
        //     Url: '/AulaVirtual/BolsaTrabajo',
        //     Icon: 'wallet_travel',
        //     value: '',
        //   });
        // }

        if(isCarrera=="true"){
          this.buttons.push({
            Nombre: 'Bolsa de Trabajo',
            Url: '/AulaVirtual/BolsaTrabajo',
            Icon: 'wallet_travel',
            value: '',
          });
        }

      }else{
        if(this.val.cursos>0){
          this.buttons.push({
            Nombre: 'Mis Cursos',
            Url: '/AulaVirtual/MisCursos',
            Icon: 'play_lesson',
            value:'../../../../../../assets/icons/mis-cursos.svg',
          });
          this.buttons.push({
            Nombre: 'Mis Pagos',
            Url: '/AulaVirtual/MisPagos',
            Icon: 'monetization_on',
            value: '../../../../../../assets/icons/mis-pagos.svg',
          });
          this.buttons.push({
            Nombre: 'Ver mi perfil',
            Url: '/AulaVirtual/MiPerfil',
            Icon: 'folder_open',
            value: '../../../../../../assets/icons/mi-perfil.svg',
          });
          this.buttons.push({
            Nombre: 'Cambiar Contraseña',
            Url: '/AulaVirtual/ChangePassword',
            Icon: 'credit_card',
            value: '../../../../../../assets/icons/cambiar-contrasena.svg',
          });
          this.buttons.push({
            Nombre: 'Categorias',
            Url: '/AulaVirtual/Categoria',
            Icon: 'badge',
            value: '../../../../../../assets/icons/categorias.svg',
          });
          if(isCarrera=="true"){
            this.buttons.push({
              Nombre: 'Bolsa de Trabajo',
              Url: '/AulaVirtual/BolsaTrabajo',
              Icon: 'wallet_travel',
              value: '',
            });
          }
        }
        this.buttons.push({
          Nombre: 'Docencia',
          Url: '/AulaVirtual/DocenciaV2',
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
    this.socialAuthService.signOut().then().catch();
  }
}
