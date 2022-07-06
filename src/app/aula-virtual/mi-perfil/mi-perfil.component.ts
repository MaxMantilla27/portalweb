import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { combosPerfilDTO, datosAlumnoEnvioDTO } from 'src/app/Core/Models/AlumnoDTO';
import { DatoObservableDTO } from 'src/app/Core/Models/DatoObservableDTO';
import { AlumnoService } from 'src/app/Core/Shared/Services/Alumno/alumno.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { RegionService } from 'src/app/Core/Shared/Services/Region/region.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';


@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MiPerfilComponent implements OnInit {
  constructor(private _HelperService: HelperService,
    private _RegionService:RegionService,
    private _AlumnoService:AlumnoService,
    private _SessionStorageService:SessionStorageService,
    private _SnackBarServiceService: SnackBarServiceService,
    ) {}
  public migaPan = [
    {
      titulo: 'Mi Perfil',
      urlWeb: '/AulaVirtual/MiPerfil',
    },
  ];
  public DatoObservable: DatoObservableDTO ={
    datoAvatar: false,
    datoContenido: false,
  }

  public statuscharge = false;
  public initValues = false;
  public imgAvtar='';
  public combosPerfil: combosPerfilDTO = {
    listaAreaFormacion:[],
    listaAreaTrabajo:[],
    listaCargo:[],
    listaCiudad:[],
    listaGenero:[],
    listaIndustria:[],
    listaPais:[],
    listaTipoDocumento:[],
    datosAlumno: {
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
    },

  };

  public DatosAlumnoEnvio: datosAlumnoEnvioDTO = {
    nombres: '',
    apellidos: '',
    idTipoDocumento: '',
    dni: '',
    email: '',
    telefono: '',
    idGenero: 0,

    idPais: 0,
    idDepartamento: 0,
    ciudad: '',
    direccion: '',

    empresa: '',
    idCargo: 0,
    idAreaTrabajo: 0,
    idAreaFormacion: 0,
    idIndustria: 0,
  }

  public userForm :FormGroup=new FormGroup({
    Nombres: new FormControl(this.combosPerfil.datosAlumno.nombres,Validators.required),
    Apellido: new FormControl(this.combosPerfil.datosAlumno.apellidos,Validators.required),
    TipoDocumento: new FormControl(this.combosPerfil.datosAlumno.idTipoDocumento,Validators.required),
    Documento: new FormControl(this.combosPerfil.datosAlumno.dni,Validators.required),
    Correo: new FormControl(this.combosPerfil.datosAlumno.email,Validators.email),
    Movil: new FormControl(this.combosPerfil.datosAlumno.telefono,Validators.required),
    Genero: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),
    Pais: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),
    Region: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),
    Ciudad: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),
    Direccion: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),
    Empresa: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),
    Cargo: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),
    AreaTrabajo: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),
    AreaFormacion: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),
    Industria: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),
    Terminos: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.requiredTrue),
  })
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.subscribe((x) => {
      console.log(x);
      this.combosPerfil = x;
      this.userForm.patchValue({
        Nombres: this.combosPerfil.datosAlumno.nombres,
        Apellido: this.combosPerfil.datosAlumno.apellidos,
        TipoDocumento: this.combosPerfil.datosAlumno.idTipoDocumento,
        Documento: this.combosPerfil.datosAlumno.dni,
        Correo: this.combosPerfil.datosAlumno.email,
        Movil: this.combosPerfil.datosAlumno.telefono,
        Genero: this.combosPerfil.datosAlumno.idGenero,
        Pais: this.combosPerfil.datosAlumno.idPais,
        Region: this.combosPerfil.datosAlumno.idDepartamento,
        Ciudad: this.combosPerfil.datosAlumno.ciudad,
        Direccion: this.combosPerfil.datosAlumno.direccion,
        Empresa: this.combosPerfil.datosAlumno.empresa,
        Cargo: this.combosPerfil.datosAlumno.idCargo,
        AreaTrabajo: this.combosPerfil.datosAlumno.idAreaTrabajo,
        AreaFormacion: this.combosPerfil.datosAlumno.idAreaFormacion,
        Industria: this.combosPerfil.datosAlumno.idIndustria,
        Terminos: false,
      });
    });
    this._HelperService.recibirDatosAvatar.subscribe(x=>this.imgAvtar=x.UrlAvatar)
  }

  GetRegionPorPais(){

    this._RegionService.ObtenerCiudadesPorPais(this.userForm.get('Pais')?.value).subscribe({
      next:x=>{
        console.log(x)
        this.combosPerfil.listaCiudad=x;
        this.userForm.patchValue({
          Region: null
        });
      }
    })
  }

  ActualizarUsuario() {
    if(this.userForm.valid){
      this.DatosAlumnoEnvio.nombres = this.userForm.get('Nombres')?.value;
      this.DatosAlumnoEnvio.apellidos = this.userForm.get('Apellido')?.value;
      this.DatosAlumnoEnvio.idTipoDocumento = this.userForm.get('TipoDocumento')?.value;
      this.DatosAlumnoEnvio.dni = this.userForm.get('Documento')?.value;
      this.DatosAlumnoEnvio.email = this.userForm.get('Correo')?.value;
      this.DatosAlumnoEnvio.telefono = this.userForm.get('Movil')?.value;
      this.DatosAlumnoEnvio.idGenero = this.userForm.get('Genero')?.value;

      this.DatosAlumnoEnvio.idPais = this.userForm.get('Pais')?.value;
      this.DatosAlumnoEnvio.idDepartamento = this.userForm.get('Region')?.value;
      this.DatosAlumnoEnvio.ciudad = this.userForm.get('Ciudad')?.value;
      this.DatosAlumnoEnvio.direccion = this.userForm.get('Direccion')?.value;

      this.DatosAlumnoEnvio.empresa = this.userForm.get('Empresa')?.value;
      this.DatosAlumnoEnvio.idCargo = this.userForm.get('Cargo')?.value;
      this.DatosAlumnoEnvio.idAreaTrabajo = this.userForm.get('AreaTrabajo')?.value;
      this.DatosAlumnoEnvio.idAreaFormacion = this.userForm.get('AreaFormacion')?.value;
      this.DatosAlumnoEnvio.idIndustria = this.userForm.get('Industria')?.value;
      this._AlumnoService.ActualizarPerfilAlumno(this.DatosAlumnoEnvio).subscribe({
        next: (x) => {
          this._SnackBarServiceService.openSnackBar("Los cambios se han guardado correctamente",'x',15,"snackbarCrucigramaSucces");
        },
        error:(e)=>{

          this._SnackBarServiceService.openSnackBar("Ocurrió un error interno intenta mas tarde",'x',15,"snackbarCrucigramaerror");
        },
        complete: () => {
          this.statuscharge = false;
        },
      });
      this._SessionStorageService.GetToken();
      this.DatoObservable.datoContenido=true
      this._HelperService.enviarDatoCuenta(this.DatoObservable)
      console.log(this.DatoObservable);
    }
  }
}
