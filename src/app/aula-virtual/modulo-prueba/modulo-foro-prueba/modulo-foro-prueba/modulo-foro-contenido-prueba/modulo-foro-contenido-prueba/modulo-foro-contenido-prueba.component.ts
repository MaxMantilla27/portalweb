import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AvatarService } from 'src/app/Core/Shared/Services/Avatar/avatar.service';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';

@Component({
  selector: 'app-modulo-foro-contenido-prueba',
  templateUrl: './modulo-foro-contenido-prueba.component.html',
  styleUrls: ['./modulo-foro-contenido-prueba.component.scss']
})
export class ModuloForoContenidoPruebaComponent implements OnInit {

  constructor(
    private _ForoCursoService:ForoCursoService,
    private _AvatarService:AvatarService
  ) {}
  @Input() IdPprincipal=0;
  @Input() IdPgeneral=0;
  @Input() IdPEspecificoPadre=0;
  @Input() IdPEspecificoHijo=0;
  @Input() IdPregunta=0;
  @Output() volver: EventEmitter<void> = new EventEmitter<void>();
  public esDocente=false;
  public foroContenido:Array<any>=[];
  public foroRespuesta:Array<any>=[];
  ngOnInit(): void {
    this.ObtenerContenidoForo();
    this.ObtenerRespuestaForo();
  }
  ObtenerContenidoForo(){
    this._ForoCursoService.ContenidoPreguntaForoCurso(this.IdPregunta).subscribe({
      next:x=>{
        this.foroContenido=x;
        this.foroContenido.forEach(x=>{
          x.urlAvatar=this._AvatarService.GetUrlImagenAvatar(x.avatar)
        })
      }
    })
  }
  ObtenerRespuestaForo(){
    this._ForoCursoService.PartialRespuestaPregunta(this.IdPgeneral,this.IdPregunta).subscribe({
      next:x=>{
        this.foroRespuesta=x;
        this.foroRespuesta.forEach(x=>{
          x.urlAvatarRespuesta=this._AvatarService.GetUrlImagenAvatar(x.avatar)
        })
      }
    })
  }
  VolverAtras(){
    this.volver.emit()
  }
}
