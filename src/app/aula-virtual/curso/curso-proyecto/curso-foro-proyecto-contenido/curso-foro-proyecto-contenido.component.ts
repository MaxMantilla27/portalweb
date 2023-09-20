import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ForoRespuestaDTO } from 'src/app/Core/Models/ForoDTO';
import { AvatarService } from 'src/app/Core/Shared/Services/Avatar/avatar.service';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';

@Component({
  selector: 'app-curso-foro-proyecto-contenido',
  templateUrl: './curso-foro-proyecto-contenido.component.html',
  styleUrls: ['./curso-foro-proyecto-contenido.component.scss']
})
export class CursoForoProyectoContenidoComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  public userForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private _ForoCursoService:ForoCursoService,
    private _AvatarService:AvatarService
  ) {this.userForm =fb.group({
    RespuestaForo: ['', [Validators.required]]
    });
  }
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
  public ForoRespuestaEnvio: ForoRespuestaDTO ={
    idForoCurso:19,
    idPrincipal:0,
    idPGeneral: 0,
    idPEspecificoPadre: 0,
    idPEspecificoHijo: 0,
    contenido: '',
    esDocente: false,
    estadoAtendido:0,
  }
  public ForoCerrado=false;
  ngOnInit(): void {
    this.ObtenerContenidoForo();
    this.ObtenerRespuestaForo();
  }
  ObtenerContenidoForo(){
    this._ForoCursoService.ContenidoPreguntaForoCurso(this.IdPregunta).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.foroContenido=x;
        this.ForoCerrado=x[0].estadoCerrado;
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
  EnviarRespuestaForo(){
    this.ForoRespuestaEnvio.contenido='';
    this.ForoRespuestaEnvio.idForoCurso = this.IdPregunta;
    this.ForoRespuestaEnvio.idPrincipal = this.IdPprincipal;
    this.ForoRespuestaEnvio.idPGeneral = this.IdPgeneral;
    this.ForoRespuestaEnvio.idPEspecificoPadre = this.IdPEspecificoPadre;
    this.ForoRespuestaEnvio.idPEspecificoHijo = this.IdPEspecificoHijo;
    this.ForoRespuestaEnvio.contenido = this.userForm.get('RespuestaForo')?.value;;
    this.ForoRespuestaEnvio.esDocente = this.esDocente;
    this.ForoRespuestaEnvio.estadoAtendido = 0;

    this._ForoCursoService.EnviarRegistroRespuestaForo(this.ForoRespuestaEnvio).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.ObtenerRespuestaForo()
      },
    });
  }
  VolverAtras(){
    this.volver.emit()
  }
}
