import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterDTO } from 'src/app/Core/Models/AlumnoDTO';
import { Basic } from 'src/app/Core/Models/BasicDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { FormularioComponent } from 'src/app/Core/Shared/Containers/formulario/formulario.component';
import { AccountService } from 'src/app/Core/Shared/Services/Account/account.service';
import { DatosPortalService } from 'src/app/Core/Shared/Services/DatosPortal/datos-portal.service';
import { RegionService } from 'src/app/Core/Shared/Services/Region/region.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.scss'],
})
export class RegistrarseComponent implements OnInit {
  @ViewChild(FormularioComponent)
  form!: FormularioComponent;
  constructor(
    private _AccountService: AccountService,
    private _SessionStorageService: SessionStorageService,
    private router: Router,
    private _DatosPortalService: DatosPortalService,
    private _RegionService: RegionService
  ) {}

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
  formVal: boolean = false;
  fileds: Array<formulario> = [];
  register: RegisterDTO = {
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
  ngOnInit(): void {
    this.AddField();
    this.ObtenerCombosPortal();
  }
  Register(value: any) {
    console.log(value);
    this.statuscharge = true;
    this.register = value;
    this._AccountService.RegistrarseAlumno(this.register).subscribe({
      next: (x) => {
        console.log(x.excepcionGenerada);
        if (x.excepcionGenerada != undefined && x.excepcionGenerada == true) {
          this.statuscharge = false;
          console.log(x);
          this.errorRegister = x.descripcionGeneral;
          setTimeout(() => {
            this.errorRegister = '';
          }, 1000000);
        } else {
          this.statuscharge = false;
          this._SessionStorageService.SetToken(x.token);
          this.router.navigate(['/AulaVirtual/Cuenta']);
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
    this.statuscharge = true;
    this._DatosPortalService.ObtenerCombosPortal().subscribe({
      next: (x) => {
        console.log(x);
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

        this.statuscharge = false;
      },
    });
  }
  GetRegionesPorPais(idPais: number) {
    this._RegionService.ObtenerCiudadesPorPais(idPais).subscribe({
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
      tipo: 'text',
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
      label: 'Área Formación',
    });
    this.fileds.push({
      nombre: 'IdAreaTrabajo',
      tipo: 'select',
      valorInicial: '',
      validate: [Validators.required],
      label: 'Área Trabajo',
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
