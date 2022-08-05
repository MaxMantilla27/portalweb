import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegisterDTO, RegisterModuloDTO } from 'src/app/Core/Models/AlumnoDTO';
import { Basic } from 'src/app/Core/Models/BasicDTO';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { FormularioComponent } from 'src/app/Core/Shared/Containers/formulario/formulario.component';
import { AccountService } from 'src/app/Core/Shared/Services/Account/account.service';
import { DatosPortalService } from 'src/app/Core/Shared/Services/DatosPortal/datos-portal.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { RegionService } from 'src/app/Core/Shared/Services/Region/region.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
declare const fbq:any;
declare const gtag:any;
@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.scss'],
})
export class RegistrarseComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  @ViewChild(FormularioComponent)
  form!: FormularioComponent;
  isBrowser: boolean;
  constructor(
    private _AccountService: AccountService,
    private _SessionStorageService: SessionStorageService,
    private router: Router,
    private _DatosPortalService: DatosPortalService,
    private _RegionService: RegionService,
    private _HelperService: HelperService,
    private title:Title,
    private meta:Meta,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId); {}
  }

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public migaPan = [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: 'Registrarse',
      urlWeb: '/Registrarse',
    },
  ];
  public errorRegister = '';
  statuscharge = false;
  initValues=false;
  formVal: boolean = false;
  public DatoObservable: DatoObservableDTO ={
    datoAvatar: false,
    datoContenido: false,
  }
  fileds: Array<formulario> = [];

  register: RegisterModuloDTO = {
    Nombres: '',
    Apellidos: '',
    Email: '',
    IdPais: undefined,
    IdRegion: undefined,
    Movil: '',
    IdCargo: undefined,
    IdAreaFormacion: undefined,
    IdAreaTrabajo: undefined,
    IdIndustria: undefined,
    Password: '',
  };
  registerSend: RegisterDTO = {
    Nombres: '',
    Apellidos: '',
    Email: '',
    IdPais: undefined,
    IdRegion: undefined,
    Movil: '',
    IdCargo: undefined,
    IdAreaFormacion: undefined,
    IdAreaTrabajo: undefined,
    IdIndustria: undefined,
    Password: '',
    CategoriaDato:0,
    Tipo:'accesopruebagratis',//pago
    IdPEspecifico:0
  };
  ngOnInit(): void {
    let t:string='Registrarse'
    this.title.setTitle(t);
    this.meta.addTag({name: 'author', content: 'BSG Institute'})
    this.AddField();
    this.ObtenerCombosPortal();
  }
  Register(value: any) {
    this.initValues = false;
    this.statuscharge = true;
    this.register = value;

    this.registerSend.Nombres=this.register.Nombres,
    this.registerSend.Apellidos=this.register.Apellidos,
    this.registerSend.Email=this.register.Email,
    this.registerSend.IdPais=this.register.IdPais,
    this.registerSend.IdRegion=this.register.IdRegion,
    this.registerSend.Movil=this.register.Movil,
    this.registerSend.IdCargo=this.register.IdCargo,
    this.registerSend.IdAreaFormacion=this.register.IdAreaFormacion,
    this.registerSend.IdAreaTrabajo=this.register.IdAreaTrabajo,
    this.registerSend.IdIndustria=this.register.IdIndustria,
    this.registerSend.Password=this.register.Password

    var idPEspecifico=this._SessionStorageService.SessionGetValueSesionStorage("IdPEspecificoPublicidad");
    var CategoriaDato=this._SessionStorageService.SessionGetValueSesionStorage("idCategoria");
    this.registerSend.CategoriaDato=CategoriaDato==''?0:parseInt(CategoriaDato);
    if(idPEspecifico==''){
      this.registerSend.IdPEspecifico=0
      this.registerSend.Tipo=''
    }else{
      this.registerSend.IdPEspecifico=parseInt(idPEspecifico)
      var pago=this._SessionStorageService.SessionGetValueSesionStorage("PagoPublicidad");
      this.registerSend.Tipo=pago=='1'?'pago':'accesopruebagratis'
    }
    this._AccountService.RegistrarseAlumno(this.registerSend).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        if (x.excepcionGenerada != undefined && x.excepcionGenerada == true) {
          this.statuscharge = false;
          this.errorRegister = x.descripcionGeneral;
          setTimeout(() => {
            this.errorRegister = '';
          }, 1000000);
        } else {

          if(this.isBrowser){
            console.log('------------------facebook(true)---------------------------');
            console.log(fbq);
            fbq('track', 'CompleteRegistration');
            gtag('event', 'conversion', {
              'send_to': 'AW-991002043/tnStCPDl6HUQu_vF2AM',
            });
            gtag('event', 'conversion', {
                'send_to': 'AW-732083338/jQrVCKmUkqUBEIrpit0C',
            });
          }
          this.statuscharge = false;
          this._SessionStorageService.SetToken(x.token);
          this.DatoObservable.datoAvatar=true
          this.DatoObservable.datoContenido=true
          this._HelperService.enviarDatoCuenta(this.DatoObservable)
          console.log(this.DatoObservable);
          this.router.navigate(['/AulaVirtual/MisCursos']);
        }
      },
      error: (e) => {
        this.statuscharge = false;
        console.log(e);
        this.errorRegister = e.error.excepcion.descripcionGeneral;
        setTimeout(() => {
          this.errorRegister = '';
        }, 1000000);
      },
      complete: () => {
        this.statuscharge = false;
      },
    });

  }

  ObtenerCombosPortal() {

    this._DatosPortalService.ObtenerCombosPortal().pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdPais') {
            r.data = x.listaPais.map((p: any) => {
              var ps: Basic = { Nombre: p.pais, value: p.idPais };
              return ps;
            });
          }
        });
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdCargo') {
            r.data = x.listaCargo.map((p: any) => {
              var ps: Basic = { Nombre: p.cargo, value: p.idCargo };
              return ps;
            });
          }
        });
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdAreaFormacion') {
            r.data = x.listaAreaFormacion.map((p: any) => {
              var ps: Basic = {
                Nombre: p.areaFormacion,
                value: p.idAreaFormacion,
              };
              return ps;
            });
          }
        });
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdAreaTrabajo') {
            r.data = x.listaAreaTrabajo.map((p: any) => {
              var ps: Basic = { Nombre: p.areaTrabajo, value: p.idAreaTrabajo };
              return ps;
            });
          }
        });
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdIndustria') {
            r.data = x.listaIndustria.map((p: any) => {
              var ps: Basic = { Nombre: p.industria, value: p.idIndustria };
              return ps;
            });
          }
        });

        this.initValues = true;
      },
    });
  }
  GetRegionesPorPais(idPais: number) {
    this._RegionService.ObtenerCiudadesPorPais(idPais).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.fileds.forEach((r) => {
          if (r.nombre == 'IdRegion') {
            r.disable = false;
            r.data = x.map((p: any) => {
              var ps: Basic = { Nombre: p.nombreCiudad, value: p.idCiudad };
              return ps;
            });
          }
        });
        this.form.enablefield('IdRegion');
      },
    });
  }
  SelectChage(e: any) {
    if (e.Nombre == 'IdPais') {
      this.GetRegionesPorPais(e.value);
    }
  }
  AddField() {
    this.fileds.push({
      nombre: 'Nombres',
      tipo: 'text',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Nombres',
    });
    this.fileds.push({
      nombre: 'Apellidos',
      tipo: 'text',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Apellidos',
    });
    this.fileds.push({
      nombre: 'Email',
      tipo: 'text',
      valorInicial: '',
      validate: [Validators.required, Validators.email],
      label: 'E-mail',
    });
    this.fileds.push({
      nombre: 'IdPais',
      tipo: 'select',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Pais',
    });
    this.fileds.push({
      nombre: 'IdRegion',
      tipo: 'select',
      valorInicial: '',
      validate: [Validators.required],
      disable: true,
      label: 'Región',
    });
    this.fileds.push({
      nombre: 'Movil',
      tipo: 'phone',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Teléfono Móvil',
    });
    this.fileds.push({
      nombre: 'IdCargo',
      tipo: 'select',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Cargo',
    });
    this.fileds.push({
      nombre: 'IdAreaFormacion',
      tipo: 'select',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Área de Formación',
    });
    this.fileds.push({
      nombre: 'IdAreaTrabajo',
      tipo: 'select',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Área de Trabajo',
    });
    this.fileds.push({
      nombre: 'IdIndustria',
      tipo: 'select',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Industria',
    });
    this.fileds.push({
      nombre: 'Password',
      tipo: 'password',
      valorInicial: '',
      validate: [Validators.required, Validators.minLength(6)],
      label: 'Password',
    });
  }
}
