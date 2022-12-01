import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CarreraProfesionalTecnicaDTO } from 'src/app/Core/Models/ProgramaDTO';
import { CarreraProfesionalService } from 'src/app/Core/Shared/Services/Carrera/carrera-profesional.service';
import { SeoService } from 'src/app/Core/Shared/Services/seo.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-carreras-profesionales',
  templateUrl: './carreras-profesionales.component.html',
  styleUrls: ['./carreras-profesionales.component.scss'],
})
export class CarrerasProfesionalesComponent implements OnInit ,OnDestroy{
  private signal$ = new Subject();
  public carreras: Array<CarreraProfesionalTecnicaDTO> = [];
  public encabezado: any = {};
  public confs: Object = {};
  public migaPan: any = [];
  constructor(
    private _CarreraProfesionalService: CarreraProfesionalService,
    private _SeoService: SeoService,
    private title: Title,
    private router: Router,
    private _SessionStorageService: SessionStorageService
  ) {}
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  ngOnInit(): void {
    this.getCarreras();
    this.confs = {
      titulo: 'Descubre Más >',
      color: 'primary',
    };
    var CodigoIso = this._SessionStorageService.SessionGetValue('ISO_PAIS');
    this.encabezado = {
      titulo: 'Carreras Profesionales',
      duracion: '(3 años)',
      descripcion: 'Nuestras carreras profesionales están enfocadas en brindar una formación de primer nivel y '+
      'buscan desarrollar las capacidades de nuestros estudiantes para generar proyectos de emprendimiento e innovación '+
      'que lleven a la creación de nuevas empresas. '
    };

    this.migaPan = [
      {
        titulo: 'Inicio',
        urlWeb: '/',
      },
      {
        titulo: 'Carreras Profesionales',
        urlWeb: '/carreras-profesionales',
      },
    ];
    if (CodigoIso.toLowerCase() == 'co') {
      let t: string = 'Educacion para el Trabajo';
      this.title.setTitle(t);
      this._SeoService.generateTags({
        title: t,
        slug: this.router.url.toString(),
        description:
          'Carreras Profesionales en Competencias en Auxiliar Administrativo en Colombia',
        keywords:
          'carreras tecnicas, carreras profesionales, carreras para estudiar, carrera profesional',
      });

      this.encabezado = {
        titulo: 'Educacion para el Trabajo',
        duracion: '',
        descripcion: '',
      };

      this.migaPan = [
        {
          titulo: 'Inicio',
          urlWeb: '/',
        },
        {
          titulo: 'Educacion para el Trabajo',
          urlWeb: '/carreras-profesionales',
        },
      ];
    } else {
      let t: string = 'Carreras Profesionales';
      this.title.setTitle(t);
      this._SeoService.generateTags({
        title: t,
        slug: this.router.url.toString(),
        description:
          'Carreras Profesionales en Administración, Computación, Explotación Minera, Concentración de Minerales y Mantenimiento de Maquinaria en Lima y Arequipa',
        keywords:
          'carreras tecnicas, carreras profesionales, carreras para estudiar, carrera profesional',
      });
    }
  }
  getCarreras() {
    this._CarreraProfesionalService.GetCarrerasVista(11).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.carreras = x.listaProfesionVistaDTO.map(function (carrera: any) {
          carrera.imagen =
            'https://img.bsginstitute.com/repositorioweb/img/carreras/' +
            carrera.imagen;
          carrera.urlWeb =
            '/carrera/' +
            carrera.titulo.replace(/ /g, '-') +
            '-' +
            carrera.idBusqueda;
          return carrera;
        });
      },
      error: (x) => {
        console.log(x);
      },
    });
  }
}
