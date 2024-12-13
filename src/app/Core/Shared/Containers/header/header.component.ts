import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
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
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { GlobalService } from '../../Services/Global/global.service';
import { delay, firstValueFrom, Subject, takeUntil, tap } from 'rxjs';
import { DatosFormularioDTO } from 'src/app/Core/Models/DatosFormularioDTO';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit,OnChanges,OnDestroy {
  @Input() responsive:boolean=false;
  @Input() carga:boolean=false;

  @Input() CodigoIso: string = '';
  @Output()
  OnClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  ChangeExpand: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  OpenStep: EventEmitter<number> = new EventEmitter<number>();

  private signal$ = new Subject();
  public Formacion: Array<BasicUrl> = [];
  public carreras: Array<BasicUrl> = [];
  public tecnica: Array<BasicUrl> = [];
  public paises: Array<BasicUrlIcon> = [];
  public paisesApi: Array<PaisDTO> = [];
  public value:any;
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
    ciudad:'',
    idGenero: 0,
    idIndustria: 0,
    idPais: 0,
    idTipoDocumento: '',
    nombres: '',
    telefono: '',
    cursos:0,
    idProveedor:0,
  };
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
  public DatoObservable: DatoObservableDTO ={
    datoAvatar: false,
    datoContenido: false,
  }
  public DatoFormularioCompletar: DatosFormularioDTO ={
    nombres:'',
    apellidos:'',
    email:'',
    idPais:0,
    idRegion:0,
    movil:'',
    idCargo:0,
    idAreaFormacion:0,
    idAreaTrabajo:0,
    idIndustria:0,
  }
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
    DatosAvatar:this.Avatar,
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

  @Input() expandibles: Array<BasicBotonesExpandibles> = [
    {
      Nombre: 'Formación Continua',
      data: this.Formacion,
      estatus: true,
    },/*
    {
      Nombre: 'Carreras Profesionales',
      data: this.carreras,
      estatus: false,
    },*/
    {
      Nombre: 'Educación Técnica',
      data: this.tecnica,
      estatus: false,
    },
  ];
  public token: boolean = this._SessionStorageService.validateTokken();
  public step=-1
  @Input() usuarioWeb=''
  constructor(
    private _SessionStorageService: SessionStorageService,
    private _PaisService: PaisService,
    private _CarreraProfesionalService: CarreraProfesionalService,
    private _HeaderPermissionsService: HeaderPermissionsService,
    private _AreacapasitacionService: AreacapasitacionService,
    private _HelperService: HelperService,
    private _AlumnoService: AlumnoService,
    private _AvatarService: AvatarService,
    private _GlobalService:GlobalService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if(this.carga==true && this.usuarioWeb!=''){
      this.RevisarUsuario();
    }
  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
  }
  RevisarUsuario(){
    var usuarioWeb=''
    usuarioWeb=this._SessionStorageService.SessionGetValue('usuarioWeb');
    if(usuarioWeb==''){
      //this.RevisarUsuario();
    }else{
      this.GetPaises();
      if(this.CodigoIso!=''){
        this.GetCarreras();
      }
      this.GetAreaCapasitacionList();
      if (this.token) {
        this.ObtenerCombosPerfil();
        this.ObtenerAvatar();
      }
      this.ObtenerObservable();
    }
  }
  async RegistroInteraccionInicial(){
    await firstValueFrom(this._GlobalService.RegistroInteraccionInicial().pipe(tap((result) => {
      this._SessionStorageService.SessionSetValue('usuarioWeb',result.identificadorUsuario);
      this._SessionStorageService.SessionSetValue('ISO_PAIS',result.codigoISO);
    })));
    this.GetPaises();
    this.GetCarreras();
    this.GetAreaCapasitacionList();
    if (this.token) {
      this.ObtenerCombosPerfil();
      this.ObtenerAvatar();
    }
    this.ObtenerObservable();

  }
  GetPaises() {
    this.paises = [];
    this._PaisService.GetPaises().pipe(takeUntil(this.signal$)).subscribe({
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
        this._HelperService.enviarDataPais(x.listaPaisCabeceraDTO);
      },
      error: (x) => {
      },
    });
  }
  GetAreaCapasitacionList() {
    this.Formacion = [];
    this._AreacapasitacionService.GetAreaCapasitacionList().pipe(takeUntil(this.signal$)).subscribe({
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
      },
    });
  }
  GetCarrerasProfesionales() {
    this._CarreraProfesionalService.GetCarreras(11).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x)
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
          this.expandibles[5].Nombre = 'Educación para el Trabajo';
        } else {
          this.expandibles[5].Nombre = 'Carreras Profesionales';
        }
        this.expandibles[5].estatus = true;
        this.expandibles[5].data = this.carreras;
        this._HelperService.enviarStringCarrera(this.expandibles[1].Nombre);
      },
      error: (x) => {
      },
    });
  }
  GetEducacionTecnica() {
    this._CarreraProfesionalService.GetCarreras(16).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        if(x.listaProfesionCabeceraDTO!=null){
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

          this._HelperService.enviarArrayEducacion(this.tecnica.map((m:any)=>{return m}));
          this.tecnica.push({
            Nombre: 'Ver Todo',
            value: 1,
            Url: '/tecnicos-productivos',
            style: { 'font-weight': 'bold' },
          });
          this.expandibles[1].estatus = true;
          this.expandibles[1].data = this.tecnica;
          this._HelperService.enviarStringEducacion(this.expandibles[1].Nombre);
        }else{
          this.tecnica=[]
        }
      },
      error: (x) => {
      },
    });
  }
  GetCarreras() {
    this.carreras = [];
    this.tecnica = [];
    this.CodigoIso=this._SessionStorageService.SessionGetValue('ISO_PAIS')
    if (this._HeaderPermissionsService.ValidateCarrerasTecnicas(this.CodigoIso)) {
      this.GetEducacionTecnica();
    } else {
      this.expandibles[1].estatus = false;
      this._HelperService.enviarStringEducacion('');
    }

    // if (this._HeaderPermissionsService.ValidateCarreras(this.CodigoIso)) {
    //   this.GetCarrerasProfesionales();
    // } else {
    //   this.expandibles[5].estatus = false;
    //   this._HelperService.enviarStringCarrera('');
    // }
  }
  ChangePais(e: any) {
    this._SessionStorageService.SessionSetValue('ISO_PAIS', e);
    this._HelperService.enviarChangePais(e);
    this.GetCarreras();
    this.ChangeExpand.emit(this.expandibles)
  }

  ObtenerCombosPerfil() {
    this._AlumnoService.ObtenerCombosPerfil().pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x)
        this.Alumno=x.datosAlumno,
        this.value={IdProveedor:this.Alumno.idProveedor,cursos:this.Alumno.cursos};
        this.combosPerfil=x.combos;
        this.combosPerfil.datosAlumno=this.Alumno;
        this._HelperService.enviarCombosPerfi(this.combosPerfil)
      },
    });
  }

  ObtenerAvatar() {
    this._AvatarService.ObtenerAvatar().pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.Avatar = x.avatar;
        this.urlAvatar=this._AvatarService.GetUrlImagenAvatar(this.Avatar);
        this.combosAvatar=x.combos;
        this.combosAvatar.UrlAvatar=this.urlAvatar
        this.combosAvatar.DatosAvatar=x.avatar
        this._HelperService.enviarDatosAvatar(this.combosAvatar);
      },
    });
  }
  ObtenerObservable(){
    this._HelperService.recibirDatoCuenta.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.DatoObservable.datoAvatar=x.datoAvatar;
        this.DatoObservable.datoContenido = x.datoContenido;
        this.token= this._SessionStorageService.validateTokken();
        if(this.token){
          if(this.DatoObservable.datoAvatar == true){
            this.ObtenerAvatar()
            if(this.DatoObservable.datoContenido == true){
              this.ObtenerCombosPerfil()
            }
          }
          else{
            if(this.DatoObservable.datoContenido == true){
              this.ObtenerCombosPerfil()
            }
          }
        }else{
          this.value=undefined;
          this.urlAvatar='';
          this.Alumno={
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
            ciudad:'',
            idGenero: 0,
            idIndustria: 0,
            idPais: 0,
            idTipoDocumento: '',
            nombres: '',
            telefono: '',
            cursos:0,
            idProveedor:0
          }
        }

      }
    })
  }
  EventoInteraccionEducacion(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Link',Nombre:nombre,Seccion:'Menu cabecera'})
  }
}
