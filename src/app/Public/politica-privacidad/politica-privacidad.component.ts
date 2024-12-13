import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PoliticaPrivacidadService } from 'src/app/Core/Shared/Services/PoliticaPrivacidad/politica-privacidad.service';
import { SeoService } from 'src/app/Core/Shared/Services/seo.service';

@Component({
  selector: 'app-politica-privacidad',
  templateUrl: './politica-privacidad.component.html',
  styleUrls: ['./politica-privacidad.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PoliticaPrivacidadComponent implements OnInit {
  constructor(
    private _PoliticaPrivacidadService: PoliticaPrivacidadService,
    private title:Title,
    private _SeoService:SeoService,
  ) {}
  public nombre='';
  public contenido=''
  public migaPan = [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: 'Política de Privacidad',
      urlWeb: '/politica-privacidad'
    }
  ]

  ngOnInit(): void {
    let t:string='Politica de Privacidad'
    this.title.setTitle(t);
    this._SeoService.generateTags({
      title: 'Política de Privacidad | BSG Institute',
      slug: 'politica-de-privacidad',
      description: 'Consulta nuestra Política de Privacidad en BSG Institute. Protección de datos y transparencia en programas y certificaciones.',
      keywords: 'política de privacidad, protección de datos, BSG Institute, confidencialidad, cursos y certificaciones',
      ogDescription: 'Descubre la Política de Privacidad de BSG Institute. Transparencia en el uso de datos personales y compromiso con la seguridad.',
      twiterDescription: 'Consulta la Política de Privacidad de BSG Institute. Protección de datos y transparencia en programas, certificaciones y formación.'
    });
    this.ObtenerPoliticaPrivacidad();
  }
  ObtenerPoliticaPrivacidad() {
    this._PoliticaPrivacidadService.ObtenerPoliticaPrivacidad().subscribe({
      next: (x) => {
        console.log(x);
        this.nombre=x.nombre
        this.contenido=x.contenido
      },
    });
  }
}
