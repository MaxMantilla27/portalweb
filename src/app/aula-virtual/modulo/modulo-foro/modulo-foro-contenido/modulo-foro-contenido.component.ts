import { Component, Input, OnInit } from '@angular/core';
import { AvatarService } from 'src/app/Core/Shared/Services/Avatar/avatar.service';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';

@Component({
  selector: 'app-modulo-foro-contenido',
  templateUrl: './modulo-foro-contenido.component.html',
  styleUrls: ['./modulo-foro-contenido.component.scss']
})
export class ModuloForoContenidoComponent implements OnInit {

  constructor(
    private _ForoCursoService:ForoCursoService,
    private _AvatarService:AvatarService
  ) { }
  @Input() IdPprincipal=0;
  @Input() IdPgeneral=0;
  @Input() IdPEspecificoPadre=0;
  @Input() IdPEspecificoHijo=0;
  @Input() IdForo=0;
  public foro:Array<any>=[]
  ngOnInit(): void {
  }
  ObtenerContenidoForo(){
    this._ForoCursoService.ContenidoPreguntaForoCurso(this.IdForo).subscribe({
      next:x=>{
        console.log(x)
        this.foro=x
        this.foro.forEach(x=>{
          x.urlAvatar=this._AvatarService.GetUrlImagenAvatar(x.avatar)
        })
      }
    })
  }
}
