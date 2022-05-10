import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { combosPerfilDTO } from 'src/app/Core/Models/AlumnoDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MiPerfilComponent implements OnInit {
  constructor(private _HelperService: HelperService) {}
  public migaPan = [
    {
      titulo: 'Mi Perfil',
      urlWeb: '/AulaVirtual/MiPerfil',
    },
  ];

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
    Correo: new FormControl(this.combosPerfil.datosAlumno.email,Validators.required),
    Movil: new FormControl(this.combosPerfil.datosAlumno.telefono,Validators.required),
    Genero: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),
    Pais: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),
    Region: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),
    Ciudad: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),
    Direccion: new FormControl(this.combosPerfil.datosAlumno.idGenero,Validators.required),
  })
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.subscribe((x) => {
      this.combosPerfil = x;
      console.log(this.combosPerfil)
      this.userForm.patchValue({
        Nombres: this.combosPerfil.datosAlumno.nombres,
        Apellido: this.combosPerfil.datosAlumno.apellidos,
        TipoDocumento: this.combosPerfil.datosAlumno.idTipoDocumento,
        Documento: this.combosPerfil.datosAlumno.dni,
        Correo: this.combosPerfil.datosAlumno.email,
        Movil: this.combosPerfil.datosAlumno.telefono,
        Genero: this.combosPerfil.datosAlumno.idGenero,
      });
    });
  }
  ActualizarUsuario() {}

}
