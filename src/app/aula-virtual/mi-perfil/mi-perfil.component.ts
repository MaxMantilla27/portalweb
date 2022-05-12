import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { combosPerfilDTO } from 'src/app/Core/Models/AlumnoDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { RegionService } from 'src/app/Core/Shared/Services/Region/region.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MiPerfilComponent implements OnInit {
  constructor(private _HelperService: HelperService,
    private _RegionService:RegionService) {}
  public migaPan = [
    {
      titulo: 'Mi Perfil',
      urlWeb: '/AulaVirtual/MiPerfil',
    },
  ];
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
      idGenero: 0,
      idIndustria: 0,
      idPais: 0,
      idTipoDocumento: '',
      nombres: '',
      telefono: '',
    },
  };

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
        Ciudad: '',
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
  ActualizarUsuario() {
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
}
