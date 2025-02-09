import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AvatarService } from 'src/app/Core/Shared/Services/Avatar/avatar.service';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-modulo-foro-contenido-prueba',
  templateUrl: './modulo-foro-contenido-prueba.component.html',
  styleUrls: ['./modulo-foro-contenido-prueba.component.scss']
})
export class ModuloForoContenidoPruebaComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _ForoCursoService:ForoCursoService,
    private _AvatarService:AvatarService,
    private _HelperService:HelperService
  ) {}
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
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
    this._ForoCursoService.ContenidoPreguntaForoCurso(this.IdPregunta).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.foroContenido=x;
        this.foroContenido.forEach(x=>{
          x.urlAvatar=this._AvatarService.GetUrlImagenAvatar(x.avatar)
        })
      }
    })
  }
  ObtenerRespuestaForo(){
    this._ForoCursoService.PartialRespuestaPregunta(this.IdPgeneral,this.IdPregunta).pipe(takeUntil(this.signal$)).subscribe({
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
  EventoInteraccionButton(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:"Button",Nombre:nombre})
  }
}
