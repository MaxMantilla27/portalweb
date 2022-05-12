import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CardMatriculasDTO } from 'src/app/Core/Models/BasicDTO';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';

@Component({
  selector: 'app-mis-cursos',
  templateUrl: './mis-cursos.component.html',
  styleUrls: ['./mis-cursos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MisCursosComponent implements OnInit {
  constructor(private _DatosPerfilService: DatosPerfilService) {}

  public migaPan = [
    {
      titulo: 'Mi cursos',
      urlWeb: '/AulaVirtual/MisCursos',
    },
  ];
  public textoBienvenido = '';
  public matriculas: Array<any> = [];
  ngOnInit(): void {
    this.textoBienvenido =
      '!Bienvenido¡ Tienes acceso a los siguientes cursos:';
    this.GetDatosPerfilService();
  }
  GetDatosPerfilService() {
    this._DatosPerfilService.DatosPerfil().subscribe({
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
}
