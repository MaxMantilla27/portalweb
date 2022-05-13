import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { CursoPadreDTO, ProgresoAlumnoProgramaAulaVirtualDTO } from 'src/app/Core/Models/ListadoProgramaContenidoDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CursoComponent implements OnInit {
  constructor(
    private _HelperService: HelperService,
    private _ProgramaContenidoService: ProgramaContenidoService,
    private _ActivatedRoute: ActivatedRoute
  ) {}
  public tabIndex = 1;
  public IndicacionActive = false;
  public migaPan = [
    {
      titulo: 'Mis Cursos',
      urlWeb: '/AulaVirtual/MisCursos',
    },
    {
      titulo: '',
      urlWeb: '/',
    },
    {
      titulo: '',
      urlWeb: '/',
    },
  ];
  public idMatricula = 0;
  public datos: any;
  public programEstructura: CursoPadreDTO = {
    idAlumno: 0,
    idMatriculaCabecera:0,
    idModalidad:0,
    idPEspecifico:0,
    idPGeneral:0,
    listaCursoMatriculado:[],
    modalidad:'',
    programaGeneral:''
  };
  public videoPreguntas =
    'https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/preguntas/preguntas-hombres.mp4';
  public videoCrucigramas =
    'https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/crucigrama/crucigrama-hombre.mp4';
  public videoTareas =
    'https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/preguntas/preguntas-hombres.mp4';
  public videoTrabajoP =
    'https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/preguntas/preguntas-hombres.mp4';
  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe({
      next: (x) => {
        this.idMatricula = parseInt(x['IdMatricula']);
        this.ObtenerListadoProgramaContenido();
      },
    });
    this._HelperService.recibirCombosPerfil.subscribe({
      next: (x) => {
        console.log(x);

        this.datos = x;
        if (x.datosAlumno.idGenero != 2) {
          this.videoPreguntas =
            'https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/preguntas/preguntas-mujeres.mp4';
          this.videoCrucigramas =
            'https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/crucigrama/crucigrama-mujer.mp4';
          this.videoTareas =
            'https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/preguntas/preguntas-hombres.mp4';
          this.videoTrabajoP =
            'https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/preguntas/preguntas-hombres.mp4';
        }
      },
    });
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);
    if (tabChangeEvent.index >= 5 && this.IndicacionActive == true) {
      this.IndicacionActive = false;
    }
  }
  actual(e: any) {
    console.log(e);
  }
  changeIndexIndicaciones(index: number) {
    this.IndicacionActive = true;
    this.tabIndex = index;
  }
  ObtenerListadoProgramaContenido() {
    this._ProgramaContenidoService
      .ObtenerListadoProgramaContenido(this.idMatricula)
      .subscribe({
        next: (x) => {
          console.log(x);
          this.programEstructura = x;
        },
      });
  }
}