import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForoRespuestaDTO } from 'src/app/Core/Models/ForoDTO';
import { AvatarService } from 'src/app/Core/Shared/Services/Avatar/avatar.service';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';

@Component({
  selector: 'app-modulo-foro-contenido',
  templateUrl: './modulo-foro-contenido.component.html',
  styleUrls: ['./modulo-foro-contenido.component.scss']
})
export class ModuloForoContenidoComponent implements OnInit {
  public userForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private _ForoCursoService:ForoCursoService,
    private _AvatarService:AvatarService
  ) {this.userForm =fb.group({
    RespuestaForo: ['', [Validators.required]]
   });
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
    esDocente: false
  }
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
  EnviarRespuestaForo(){
    this.ForoRespuestaEnvio.idForoCurso = this.IdPregunta;
    this.ForoRespuestaEnvio.idPrincipal = this.IdPprincipal;
    this.ForoRespuestaEnvio.idPGeneral = this.IdPgeneral;
    this.ForoRespuestaEnvio.idPEspecificoPadre = this.IdPEspecificoPadre;
    this.ForoRespuestaEnvio.idPEspecificoHijo = this.IdPEspecificoHijo;
    this.ForoRespuestaEnvio.contenido = this.userForm.get('RespuestaForo')?.value;;
    this.ForoRespuestaEnvio.esDocente = this.esDocente;

    this._ForoCursoService.EnviarRegistroRespuestaForo(this.ForoRespuestaEnvio).subscribe({
      next: (x) => {
        this.volver.emit()
      },
    });
  }
}
