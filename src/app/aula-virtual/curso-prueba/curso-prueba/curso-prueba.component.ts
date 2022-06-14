import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { CursoPadreDTO } from 'src/app/Core/Models/ListadoProgramaContenidoDTO';
import { CursoPadrePruebaDTO } from 'src/app/Core/Models/ListadoProgramaContenidoPruebaDTO';
import { CuentaService } from 'src/app/Core/Shared/Services/Cuenta/cuenta.service';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-curso-prueba',
  templateUrl: './curso-prueba.component.html',
  styleUrls: ['./curso-prueba.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CursoPruebaComponent implements OnInit {

  constructor(
    private _HelperService: HelperService,
    private _ProgramaContenidoService: ProgramaContenidoService,
    private _ActivatedRoute: ActivatedRoute,
    private _DatosPerfilService:DatosPerfilService,
    private _SessionStorageService:SessionStorageService,
    private _cuentaService: CuentaService
  ) {}
  public tabIndex = 0;
  public IndicacionActive = false;
  public migaPan = [
    {
      titulo: 'Mis Cursos Prueba',
      urlWeb: '/AulaVirtual/MisCursosPrueba',
    }
  ];
  public idMatricula = 0;
  public idRegistroPrueba = 0;
  public datos: any;
  public programaEstructura: CursoPadrePruebaDTO = {
    idAlumno: 0,
    idRegistroPrueba: 0,
    idModalidad: 0,
    idPEspecifico: 0,
    idPGeneral: 0,
    listaCursoMatriculado: [],
    modalidad: '',
    programaGeneral: '',
  };
  public curso:any
  public videoPreguntas ='https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/preguntas/preguntas-hombres.mp4';
  public videoCrucigramas ='https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/crucigrama/crucigrama-hombre.mp4'

  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe({
      next: (x) => {
        this.idRegistroPrueba = parseInt(x['IdRegistroPrueba']);
        console.log(this.idRegistroPrueba)
        this.ObtenerListadoProgramaContenidoPrueba();
      },
    });
    this._HelperService.recibirCombosPerfil.subscribe({
      next: (x) => {

        this.datos = x;
        if (x.datosAlumno.idGenero != 2) {
          this.videoPreguntas ='https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/preguntas/preguntas-mujeres.mp4';
          this.videoCrucigramas ='https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/crucigrama/crucigrama-mujer.mp4';
        }
      },
    });
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);
    if (
      (tabChangeEvent.index >= 5 || tabChangeEvent.index == 0) &&
      this.IndicacionActive == true
    ) {
      this.IndicacionActive = false;
      this.tabIndex-=4
      console.log(this.tabIndex)
    }
  }
  actual(e: any) {
    console.log(e);
  }
  changeIndexIndicaciones(index: number) {
    this.IndicacionActive = true;
    this.tabIndex = index;
  }
  ObtenerListadoProgramaContenidoPrueba() {
    this._ProgramaContenidoService
      .ObtenerListadoProgramaContenidoPrueba(this.idRegistroPrueba)
      .subscribe({
        next: (x) => {
          console.log(x)
          this.programaEstructura = x;
          this.programaEstructura.listaCursoMatriculado.sort(function (a:any, b:any) {
            return a.orden - b.orden;
          })
          this.migaPan.push(
            {
              titulo: this.programaEstructura.programaGeneral,
              urlWeb: '/AulaVirtual/MisCursos/'+this.idRegistroPrueba,
            },)

          this.programaEstructura.listaCursoMatriculado.forEach((program) => {
            var params: ParametrosEstructuraEspecificaDTO = {
              AccesoPrueba: false,
              IdMatriculaCabecera: this.programaEstructura.idRegistroPrueba,
              IdPEspecificoPadre: this.programaEstructura.idPEspecifico,
              IdPGeneralPadre: this.programaEstructura.idPGeneral,
              IdPEspecificoHijo: program.idPEspecificoHijo,
              IdPGeneralHijo: program.idPGeneralHijo,
              NombreCapitulo:program.programaGeneralHijo,
              NombrePrograma:this.programaEstructura.programaGeneral,
              idModalidad:this.programaEstructura.idModalidad
            };
            program.params = btoa(JSON.stringify(params));
          });
        },
      });
  }
}
