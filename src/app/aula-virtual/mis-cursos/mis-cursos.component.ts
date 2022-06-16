import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CuentaService } from 'src/app/Core/Shared/Services/Cuenta/cuenta.service';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-mis-cursos',
  templateUrl: './mis-cursos.component.html',
  styleUrls: ['./mis-cursos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MisCursosComponent implements OnInit {
  constructor(
    private _DatosPerfilService: DatosPerfilService,
    private _SessionStorageService:SessionStorageService,
    private _CuentaService: CuentaService,
    public dialog: MatDialog

    ) {}

  public migaPan = [
    {
      titulo: 'Mis cursos',
      urlWeb: '/AulaVirtual/MisCursos',
    },
  ];
  public textoBienvenido = '';
  public matriculas: Array<any> = [];
  public matriculasPrueba: Array<any> = [];
  public fecha = new Date();


  ngOnInit(): void {
    this.textoBienvenido =
      '!Bienvenido¡ Tienes acceso a los siguientes cursos:';
    this.GetDatosPerfilService();
    this.ObtenerCursosPrueba();
  }
  GetDatosPerfilService() {
    this._DatosPerfilService.RegistroProgramaMatriculado().subscribe({
      next: (x) => {
        console.log(x);
        this.matriculas = x;
        this.matriculas.forEach(p=>{
          p.tipoModalidad=parseInt(p.tipoModalidad)
        })
        console.log(this.matriculas);
      },
    });
  }
  ObtenerCursosPrueba(){
    this._CuentaService.ObtenerListaCursosPrueba().subscribe({
      next: (x) => {
        console.log(x);
        this.matriculasPrueba = x;
        this.matriculasPrueba.forEach(p=>{
          p.tipoModalidad=parseInt(p.tipoModalidad)
        })
        console.log(this.matriculas);
      }
    })
  }
  saveIndex(index:number){
    this._SessionStorageService.SessionSetValue('cursoIndex',index.toString());
  }
}
