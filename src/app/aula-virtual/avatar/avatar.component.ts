import { ThisReceiver } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, timer } from 'rxjs';
import {
  AvatarCombosDTO,
  AvatarDTO,
  AvatarEnvioDTO,
} from 'src/app/Core/Models/Avatar';
import { Basic } from 'src/app/Core/Models/BasicDTO';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { AvatarService } from 'src/app/Core/Shared/Services/Avatar/avatar.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _HelperService: HelperService,
    private _AvatarService: AvatarService,
    private _SessionStorageService: SessionStorageService,
    private router: Router,
    private _SnackBarServiceService: SnackBarServiceService,
  ) {}
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public migaPan = [
    {
      titulo: 'Mi perfil',
      urlWeb: '/AulaVirtual/MiPerfil',
    },
    {
      titulo: 'Avatar',
      urlWeb: '/Avatar',
    },
  ];
  public errorActualizacion = '';
  public DatoObservable: DatoObservableDTO ={
    datoAvatar: false,
    datoContenido: false,
  }
  public datosAvatar: AvatarDTO = {
    idAvatar: 0,
    idAlumno: 0,
    idAspNetUsers: '',
    topC: '',
    accessories: '',
    hair_Color: '',
    facial_Hair: '',
    facial_Hair_Color: '',
    clothes: '',
    clothes_Color: '',
    eyes: '',
    eyesbrow: '',
    mouth: '',
    skin: '',
  };
  public imgAvatar = '';
  public combosAvatar: AvatarCombosDTO = {
    listaCabello: [],
    listaColorCabello: [],
    listaBarbaBigote: [],
    listaColorBarbaBigote: [],
    listaMirada: [],
    listaCejas: [],
    listaBoca: [],
    listaColorPiel: [],
    listaRopa: [],
    listaColorRopa: [],
    listaAccesorios: [],
    UrlAvatar: '',
    DatosAvatar: this.datosAvatar,
  };

  public DatosAvatarEnvio: AvatarEnvioDTO = {
    topC: '',
    accessories: '',
    hair_Color: '',
    facial_Hair: '',
    facial_Hair_Color: '',
    clothes: '',
    clothes_Color: '',
    eyes: '',
    eyesbrow: '',
    mouth: '',
    skin: '',
  };
  public statuscharge = false;
  public formVal = false;
  public fileds: Array<formulario> = [];
  public initValues = false;
  public cargo=false
  public userForm: FormGroup = new FormGroup({
    listaCabello: new FormControl(this.datosAvatar.topC),
    listaColorCabello: new FormControl(this.datosAvatar.hair_Color),
    listaBarbaBigote: new FormControl(this.datosAvatar.facial_Hair),
    listaColorBarbaBigote: new FormControl(this.datosAvatar.facial_Hair_Color),
    listaMirada: new FormControl(this.datosAvatar.eyes),
    listaCejas: new FormControl(this.datosAvatar.eyesbrow),
    listaBoca: new FormControl(this.datosAvatar.mouth),
    listaColorPiel: new FormControl(this.datosAvatar.skin),
    listaRopa: new FormControl(this.datosAvatar.clothes),
    listaColorRopa: new FormControl(this.datosAvatar.clothes_Color),
    listaAccesorios: new FormControl(this.datosAvatar.accessories),
  });

  ngOnInit(): void {
    this.AddFields(),
      this._HelperService.recibirDatosAvatar.pipe(takeUntil(this.signal$)).subscribe((x) => {
        if(this.cargo==false){
          this.cargo=true;
          this.datosAvatar = x.DatosAvatar;
          this.DatosAvatarEnvio.topC=this.datosAvatar.topC
          this.DatosAvatarEnvio.accessories=this.datosAvatar.accessories
          this.DatosAvatarEnvio.hair_Color=this.datosAvatar.hair_Color
          this.DatosAvatarEnvio.facial_Hair=this.datosAvatar.facial_Hair
          this.DatosAvatarEnvio.facial_Hair_Color=this.datosAvatar.facial_Hair_Color
          this.DatosAvatarEnvio.clothes=this.datosAvatar.clothes
          this.DatosAvatarEnvio.clothes_Color=this.datosAvatar.clothes_Color
          this.DatosAvatarEnvio.eyes=this.datosAvatar.eyes
          this.DatosAvatarEnvio.eyesbrow=this.datosAvatar.eyesbrow
          this.DatosAvatarEnvio.mouth=this.datosAvatar.mouth
          this.DatosAvatarEnvio.skin=this.datosAvatar.skin
          this.imgAvatar = x.UrlAvatar;
          this.combosAvatar = x;
          timer(500).pipe(takeUntil(this.signal$)).subscribe(_=>{
            this.fileds.forEach((c) => {
              if (c.nombre == 'topC') {
                c.valorInicial = x.DatosAvatar.topC;
                c.data = x.listaCabello.map((m) => {
                  var cabelloData: Basic = {
                    Nombre: m.etiqueta,
                    value: m.valor,
                  };
                  return cabelloData;
                });
              }
              if (c.nombre == 'accessories') {
                c.valorInicial = x.DatosAvatar.accessories;
                c.data = x.listaAccesorios.map((m) => {
                  var accesoriosData: Basic = {
                    Nombre: m.etiqueta,
                    value: m.valor,
                  };
                  return accesoriosData;
                });
              }
              if (c.nombre == 'hair_Color') {
                c.valorInicial = x.DatosAvatar.hair_Color;
                c.data = x.listaColorCabello.map((m) => {
                  var colorCabelloData: Basic = {
                    Nombre: m.etiqueta,
                    value: m.valor,
                  };
                  return colorCabelloData;
                });
              }
              if (c.nombre == 'facial_Hair') {
                c.valorInicial = x.DatosAvatar.facial_Hair;
                c.data = x.listaBarbaBigote.map((m) => {
                  var barbaBigoteData: Basic = {
                    Nombre: m.etiqueta,
                    value: m.valor,
                  };
                  return barbaBigoteData;
                });
              }
              if (c.nombre == 'facial_Hair_Color') {
                c.valorInicial = x.DatosAvatar.facial_Hair_Color;
                c.data = x.listaColorBarbaBigote.map((m) => {
                  var colorBarbaBigoteData: Basic = {
                    Nombre: m.etiqueta,
                    value: m.valor,
                  };
                  return colorBarbaBigoteData;
                });
              }
              if (c.nombre == 'clothes') {
                c.valorInicial = x.DatosAvatar.clothes;
                c.data = x.listaRopa.map((m) => {
                  var ropaData: Basic = {
                    Nombre: m.etiqueta,
                    value: m.valor,
                  };
                  return ropaData;
                });
              }
              if (c.nombre == 'clothes_Color') {
                c.valorInicial = x.DatosAvatar.clothes_Color;
                c.data = x.listaColorRopa.map((m) => {
                  var colorRopaData: Basic = {
                    Nombre: m.etiqueta,
                    value: m.valor,
                  };
                  return colorRopaData;
                });
              }
              if (c.nombre == 'eyes') {
                c.valorInicial = x.DatosAvatar.eyes;
                c.data = x.listaMirada.map((m) => {
                  var miradaData: Basic = {
                    Nombre: m.etiqueta,
                    value: m.valor,
                  };
                  return miradaData;
                });
              }
              if (c.nombre == 'eyesbrow') {
                c.valorInicial = x.DatosAvatar.eyesbrow;
                c.data = x.listaCejas.map((m) => {
                  var cejasData: Basic = {
                    Nombre: m.etiqueta,
                    value: m.valor,
                  };
                  return cejasData;
                });
              }
              if (c.nombre == 'mouth') {
                c.valorInicial = x.DatosAvatar.mouth;
                c.data = x.listaBoca.map((m) => {
                  var bocaData: Basic = {
                    Nombre: m.etiqueta,
                    value: m.valor,
                  };
                  return bocaData;
                });
              }
              if (c.nombre == 'skin') {
                c.valorInicial = x.DatosAvatar.skin;
                c.data = x.listaColorPiel.map((m) => {
                  var ColorPielData: Basic = {
                    Nombre: m.etiqueta,
                    value: m.valor,
                  };
                  return ColorPielData;
                });
              }
            });
            this.initValues = true;
          })
        }
      });
  }

  AddFields() {
    this.fileds.push({
      nombre: 'topC',
      tipo: 'select',
      valorInicial: 0,
      validate: [Validators.required],
      label: 'Cabello',
      data: [],
      class:'col-12 col-md-6 col-lg-6'
    });
    this.fileds.push({
      nombre: 'hair_Color',
      tipo: 'select',
      valorInicial: 0,
      validate: [Validators.required],
      label: 'Color de cabello',
      data: [],
      class:'col-12 col-md-6 col-lg-6'
    });
    this.fileds.push({
      nombre: 'facial_Hair',
      tipo: 'select',
      valorInicial: 0,
      validate: [Validators.required],
      label: 'Barba/Bigote',
      data: [],
      class:'col-12 col-md-6 col-lg-6'
    });
    this.fileds.push({
      nombre: 'facial_Hair_Color',
      tipo: 'select',
      valorInicial: 0,
      validate: [Validators.required],
      label: 'Color de Barba/Bigote',
      data: [],
      class:'col-12 col-md-6 col-lg-6'
    });
    this.fileds.push({
      nombre: 'eyes',
      tipo: 'select',
      valorInicial: 0,
      validate: [Validators.required],
      label: 'Mirada',
      data: [],
      class:'col-12 col-md-6 col-lg-6'
    });
    this.fileds.push({
      nombre: 'eyesbrow',
      tipo: 'select',
      valorInicial: 0,
      validate: [Validators.required],
      label: 'Cejas',
      data: [],
      class:'col-12 col-md-6 col-lg-6'
    });
    this.fileds.push({
      nombre: 'mouth',
      tipo: 'select',
      valorInicial: 0,
      validate: [Validators.required],
      label: 'Boca',
      data: [],
      class:'col-12 col-md-6 col-lg-6'
    });
    this.fileds.push({
      nombre: 'skin',
      tipo: 'select',
      valorInicial: 0,
      validate: [Validators.required],
      label: 'Color de Piel',
      data: [],
      class:'col-12 col-md-6 col-lg-6'
    });
    this.fileds.push({
      nombre: 'clothes',
      tipo: 'select',
      valorInicial: 0,
      validate: [Validators.required],
      label: 'Ropa',
      data: [],
      class:'col-12 col-md-6 col-lg-6'
    });
    this.fileds.push({
      nombre: 'clothes_Color',
      tipo: 'select',
      valorInicial: 0,
      validate: [Validators.required],
      label: 'Color de ropa',
      data: [],
      class:'col-12 col-md-6 col-lg-6'
    });
    this.fileds.push({
      nombre: 'accessories',
      tipo: 'select',
      valorInicial: 0,
      validate: [Validators.required],
      label: 'Accesorios',
      data: [],
      class:'col-12 col-md-6 col-lg-6'
    });
  }
  ActualizarAvatar(value: any) {
    this.initValues = false;
    this.statuscharge = true;
    this.DatosAvatarEnvio = value;
    this._AvatarService.ActualizarAvatar(this.DatosAvatarEnvio).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this._SnackBarServiceService.openSnackBar("Se modifico el avatar",'x',15,"snackbarCrucigramaSucces");
      },
      error: (e) => {
        this.statuscharge = false;
        this.errorActualizacion = e.error.excepcion.descripcionGeneral;
        timer(1000000).pipe(takeUntil(this.signal$)).subscribe(_=>{
          this.errorActualizacion = 'Avatar actualizado correctamente';
        })
      },
      complete: () => {
        this.statuscharge = false;
      },
    });
   /*  this._HelperService.recibirDatoCuenta.subscribe(m=>this.DatoObservable.datoAvatar=true) */
    this.DatoObservable.datoAvatar=true
    this._HelperService.enviarDatoCuenta(this.DatoObservable)
  }


  RecargaImagen(value: any) {
    if (value.Nombre == 'topC') {
      this.datosAvatar.topC = value.value;
    }
    if (value.Nombre == 'accessories') {
      this.datosAvatar.accessories = value.value;
    }
    if (value.Nombre == 'hair_Color') {
      this.datosAvatar.hair_Color = value.value;
    }
    if (value.Nombre == 'facial_Hair') {
      this.datosAvatar.facial_Hair = value.value;
    }
    if (value.Nombre == 'facial_Hair_Color') {
      this.datosAvatar.facial_Hair_Color = value.value;
    }
    if (value.Nombre == 'clothes') {
      this.datosAvatar.clothes = value.value;
    }
    if (value.Nombre == 'clothes_Color') {
      this.datosAvatar.clothes_Color = value.value;
    }
    if (value.Nombre == 'eyes') {
      this.datosAvatar.eyes = value.value;
    }
    if (value.Nombre == 'eyesbrow') {
      this.datosAvatar.eyesbrow = value.value;
    }
    if (value.Nombre == 'mouth') {
      this.datosAvatar.mouth = value.value;
    }
    if (value.Nombre == 'skin') {
      this.datosAvatar.skin = value.value;
    }
    this.imgAvatar = this._AvatarService.GetUrlImagenAvatar(this.datosAvatar);
  }
}
