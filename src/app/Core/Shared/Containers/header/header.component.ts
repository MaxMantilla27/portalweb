import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  Basic,
  BasicBotonesExpandibles,
  BasicUrl,
  BasicUrlIcon,
} from 'src/app/Core/Models/BasicDTO';
import { SessionStorageService } from './../../Services/session-storage.service';
import { PaisService } from './../../Services/Pais/pais.service';
import { PaisDTO } from 'src/app/Core/Models/PaisDTO';
import { CarreraProfesionalService } from '../../Services/Carrera/carrera-profesional.service';
import { HeaderPermissionsService } from '../../Services/header-permissions.service';
import { AreacapasitacionService } from '../../Services/AreaCapasitacion/areacapasitacion.service';
import { HelperService } from '../../Services/helper.service';
import { AlumnoService } from '../../Services/Alumno/alumno.service';
import { AvatarService } from '../../Services/Avatar/avatar.service';
import { AvatarCombosDTO, AvatarDTO } from 'src/app/Core/Models/Avatar';
import { combosPerfilDTO, datosAlumnoDTO } from 'src/app/Core/Models/AlumnoDTO';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output()
  OnClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  public Formacion: Array<BasicUrl> = [];
  public carreras: Array<BasicUrl> = [];
  public tecnica: Array<BasicUrl> = [];
  public paises: Array<BasicUrlIcon> = [];
  public paisesApi: Array<PaisDTO> = [];
  public Alumno: datosAlumnoDTO = {
    apellidos: '',
    direccion: '',
    dni: '',
    email: '',
    empresa: '',
    idAlumno: 0,
    idAreaFormacion: 0,
    idAreaTrabajo: 0,
    idCargo: 0,
    idDepartamento: 0,
    idGenero: 0,
    idIndustria: 0,
    idPais: 0,
    idTipoDocumento: '',
    nombres: '',
    telefono: '',
  };
  public combosAvatar:AvatarCombosDTO={
    listaAccesorios:[],
    listaBarbaBigote:[],
    listaBoca:[],
    UrlAvatar:'',
    listaCabello:[],
    listaCejas:[],
    listaColorBarbaBigote:[],
    listaColorCabello:[],
    listaColorPiel:[],
    listaColorRopa:[],
    listaMirada:[],
    listaRopa:[],
  }
  public combosPerfil:combosPerfilDTO={
    listaAreaFormacion:[],
    listaAreaTrabajo:[],
    listaCargo:[],
    listaCiudad:[],
    listaGenero:[],
    listaIndustria:[],
    listaPais:[],
    listaTipoDocumento:[],
    datosAlumno:this.Alumno
  }
  public urlAvatar='';
  public Avatar: AvatarDTO = {
    accessories: '',
    clothes: '',
    clothes_Color: '',
    eyes: '',
    eyesbrow: '',
    facial_Hair: '',
    facial_Hair_Color: '',
    hair_Color: '',
    idAlumno: 0,
    idAspNetUsers: '',
    idAvatar: 0,
    mouth: '',
    skin: '',
    topC: '',
  };
  public expandibles: Array<BasicBotonesExpandibles> = [
    {
      Nombre: 'Formacion Continua',
      data: this.Formacion,
      estatus: true,
    },
    {
      Nombre: 'Carreras Profecionales',
      data: this.carreras,
      estatus: false,
    },
    {
      Nombre: 'Educacion Tecnica',
      data: this.tecnica,
      estatus: false,
    },
  ];
  public token: boolean = this._SessionStorageService.validateTokken();
  public CodigoIso: string = 'INTC';

  constructor(
    private _SessionStorageService: SessionStorageService,
    private _PaisService: PaisService,
    private _CarreraProfesionalService: CarreraProfesionalService,
    private _HeaderPermissionsService: HeaderPermissionsService,
    private _AreacapasitacionService: AreacapasitacionService,
    private _HelperService: HelperService,
    private _AlumnoService: AlumnoService,
    private _AvatarService: AvatarService
  ) {}

  ngOnInit(): void {
    this.GetPaises();
    this.GetCarreras();
    this.GetAreaCapasitacionList();
    if (this.token) {
      this.ObtenerCombosPerfil();
      this.ObtenerAvatar();
    }
  }
  GetPaises() {
    this.paises = [];
    this._PaisService.GetPaises().subscribe({
      next: (x) => {
        this.paises = x.listaPaisCabeceraDTO.map((p: any) => {
          var ps: BasicUrlIcon = {
            Nombre: p.pais,
            value: p.codigoIso,
            Url: p.flag,
            Icon: p.icono,
          };
          return ps;
        });
      },
      error: (x) => {
        console.log(x);
      },
    });
  }
  GetAreaCapasitacionList() {
    this.Formacion = [];
    this._AreacapasitacionService.GetAreaCapasitacionList().subscribe({
      next: (x) => {
        this.Formacion = x.listaareaCapasitacionDTO.map((c: any) => {
          var ps: BasicUrl = {
            Nombre: c.nombre,
            value: c.id,
            Url: '/programas-certificaciones-cursos/' + c.id,
          };
          return ps;
        });
        var formacionOrden: Array<BasicUrl> = x.listaareaCapasitacionDTO.map(
          (c: any) => {
            var ps: BasicUrl = {
              Nombre: c.nombre,
              value: c.id,
              Url: '/programas-certificaciones-cursos/' + c.id,
            };
            return ps;
          }
        );
        formacionOrden.sort(function (a, b) {
          return a.value - b.value;
        });
        this._HelperService.enviarArrayFormacion(formacionOrden);
        this.Formacion.push({
          Nombre: 'Ver Todo',
          value: 1,
          Url: '/programas-certificaciones-cursos',
          style: { 'font-weight': 'bold' },
        });
        this.expandibles[0].data = this.Formacion;
      },
      error: (x) => {
        console.log(x);
      },
    });
  }
  GetCarrerasProfecionales() {
    this._CarreraProfesionalService.GetCarreras(11).subscribe({
      next: (x) => {
        this.carreras = x.listaProfesionCabeceraDTO.map((c: any) => {
          var ps: BasicUrl = {
            Nombre: c.titulo,
            value: c.idBusqueda,
            Url: '/carrera/' + c.titulo.replace(/ /g, '-') + '-' + c.idBusqueda,
          };
          return ps;
        });
        this._HelperService.enviarArrayCarrera(this.carreras.map((m:any)=>{return m}));
        this.carreras.push({
          Nombre: 'Ver Todo',
          value: 1,
          Url: '/carreras-profesionales',
          style: { 'font-weight': 'bold' },
        });
        if (this.CodigoIso.toLowerCase() == 'co') {
          this.expandibles[1].Nombre = 'Educacion para el Trabajo';
        } else {
          this.expandibles[1].Nombre = 'Carreras Profecionales';
        }
        this.expandibles[1].estatus = true;
        this.expandibles[1].data = this.carreras;
        this._HelperService.enviarStringCarrera(this.expandibles[1].Nombre);
      },
      error: (x) => {
        console.log(x);
      },
    });
  }
  GetEducacionTecnica() {
    this._CarreraProfesionalService.GetCarreras(16).subscribe({
      next: (x) => {
        this.tecnica = x.listaProfesionCabeceraDTO.map((c: any) => {
          var ps: BasicUrl = {
            Nombre: c.titulo,
            value: c.idBusqueda,
            Url:
              '/tecnico-productivo/' +
              c.titulo.replace(/ /g, '-') +
              '-' +
              c.idBusqueda,
          };
          return ps;
        });
        this.tecnica.push({
          Nombre: 'Ver Todo',
          value: 1,
          Url: '/tecnicos-productivos',
          style: { 'font-weight': 'bold' },
        });
        this.expandibles[2].estatus = true;
        this.expandibles[2].data = this.tecnica;
      },
      error: (x) => {
        console.log(x);
      },
    });
  }
  GetCarreras() {
    this.carreras = [];
    this.tecnica = [];
    this.CodigoIso =
      this._SessionStorageService.SessionGetValue('ISO_PAIS') != ''
        ? this._SessionStorageService.SessionGetValue('ISO_PAIS')
        : 'INTC';
    this._SessionStorageService.SessionSetValue('ISO_PAIS', this.CodigoIso);
    if (
      this._HeaderPermissionsService.ValidateCarrerasTecnicas(this.CodigoIso)
    ) {
      this.GetEducacionTecnica();
    } else {
      this.expandibles[2].estatus = false;
    }
    if (this._HeaderPermissionsService.ValidateCarreras(this.CodigoIso)) {
      this.GetCarrerasProfecionales();
    } else {
      this.expandibles[1].estatus = false;
      this._HelperService.enviarStringCarrera('');
    }
  }
  ChangePais(e: any) {
    this._SessionStorageService.SessionSetValue('ISO_PAIS', e);
    this.GetCarreras();
  }

  ObtenerCombosPerfil() {
    this._AlumnoService.ObtenerCombosPerfil().subscribe({
      next: (x) => {
        this.Alumno=x.datosAlumno,
        this.combosPerfil=x.combos;
        this.combosPerfil.datosAlumno=this.Alumno;
        this._HelperService.enviarCombosPerfi(this.combosPerfil)
      },
    });
  }
  ObtenerAvatar() {
    this._AvatarService.ObtenerAvatar().subscribe({
      next: (x) => {
        console.log(x)
        this.Avatar = x.avatar;
        this.urlAvatar=this._AvatarService.GetUrlImagenAvatar(this.Avatar);
        this.combosAvatar=x.combos;
        this.combosAvatar.UrlAvatar=this.urlAvatar
        this._HelperService.enviarDatosAvatar(this.combosAvatar);
      },
    });
  }
}
