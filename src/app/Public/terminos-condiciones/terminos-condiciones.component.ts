import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { TerminosCondicionesService } from 'src/app/Core/Shared/Services/TerminosCondiciones/terminos-condiciones.service';

@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TerminosCondicionesComponent implements OnInit {
  private signal$ = new Subject();
  constructor(
    private _TerminosCondicionesService: TerminosCondicionesService,
    private title:Title,
    private meta:Meta
  ) {}

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public nombre='';
  public contenido=''
  public migaPan = [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: 'Términos de uso del sitio web',
      urlWeb: '/termino-uso-web'
    }
  ]
  ngOnInit(): void {
    let t:string='Términos de Uso Web'
    this.title.setTitle(t);
    this.meta.addTag({name: 'author', content: 'BSG Institute'})
    this.ObtenerTerminosCondiciones();
  }
  ObtenerTerminosCondiciones() {
    this._TerminosCondicionesService.ObtenerTerminosCondiciones().pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.nombre=this.capitalizeFirstLetter(x.nombre.toLowerCase());
        this.contenido=x.contenido
      },
    });
  }
  capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
