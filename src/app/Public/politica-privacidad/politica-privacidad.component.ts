import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { PoliticaPrivacidadService } from 'src/app/Core/Shared/Services/PoliticaPrivacidad/politica-privacidad.service';

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
    private meta:Meta
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
    this.meta.addTag({name: 'author', content: 'BSG Institute'})
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
