import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SeoService } from 'src/app/Core/Shared/Services/seo.service';

@Component({
  selector: 'app-transparencia',
  templateUrl: './transparencia.component.html',
  styleUrls: ['./transparencia.component.scss']
})
export class TransparenciaComponent implements OnInit {

  constructor(
    private _SeoService:SeoService,
    private title:Title
  ) { }
  public migaPan = [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: 'Transparencia',
      urlWeb: '/Transparencia'
    }
  ]
  ngOnInit(): void {

    let t:string='BSG Institute - Transparencia'
    this.title.setTitle(t);

    this._SeoService.generateTags({
      title:'BSG Institute - Transparencia',
      slug:'Transparencia',
      description:'Programas, Certificaciones y Cursos en Big Data, Analytics, Proyectos, ISO 9001, ISO 14001, OHSAS 18001, ISO 27001, Construcción, Minería.',
      keywords:'BSG Institute,curso de excel avanzado, curso autocad, curso de excel basico, especializacion en gerencia de proyectos, certificacion itil, especializacion en salud ocupacional, curso ms project,curso revit',
    });
  }

}
