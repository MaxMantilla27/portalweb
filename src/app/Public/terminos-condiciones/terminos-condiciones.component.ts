import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TerminosCondicionesService } from 'src/app/Core/Shared/Services/TerminosCondiciones/terminos-condiciones.service';

@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TerminosCondicionesComponent implements OnInit {
  constructor(
    private _TerminosCondicionesService: TerminosCondicionesService
  ) {}
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
    this.ObtenerTerminosCondiciones();
  }
  ObtenerTerminosCondiciones() {
    this._TerminosCondicionesService.ObtenerTerminosCondiciones().subscribe({
      next: (x) => {
        console.log(x);
        this.nombre=this.capitalizeFirstLetter(x.nombre.toLowerCase());
        this.contenido=x.contenido
      },
    });
  }
  capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
