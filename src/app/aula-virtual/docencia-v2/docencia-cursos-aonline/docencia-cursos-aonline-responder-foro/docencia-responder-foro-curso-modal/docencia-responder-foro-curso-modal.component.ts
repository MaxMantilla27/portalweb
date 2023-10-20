import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ForoRespuestaDTO } from 'src/app/Core/Models/ForoDTO';
import { AvatarService } from 'src/app/Core/Shared/Services/Avatar/avatar.service';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';
import { DocenciaResponerForoCursoComponent } from '../docencia-responder-foro-curso/docencia-responer-foro-curso.component';

@Component({
  selector: 'app-docencia-responder-foro-curso-modal',
  templateUrl: './docencia-responder-foro-curso-modal.component.html',
  styleUrls: ['./docencia-responder-foro-curso-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocenciaResponderForoCursoModalComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    public dialogRef: MatDialogRef<DocenciaResponerForoCursoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _ForoCursoService:ForoCursoService,
    public _AvatarService:AvatarService
    ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public pregunta:any
  public respuestas:any
  public imgForo:any
  public jsonEnvio:ForoRespuestaDTO={
    contenido:'',
    esDocente:true,
    idForoCurso:0,
    idPEspecificoHijo:0,
    idPEspecificoPadre:0,
    idPGeneral:0,
    idPrincipal:0,
    estadoAtendido:0,
  }
  public ForoCerrado=false
  public ReproductorVideo=''
  ngOnInit(): void {
    this.jsonEnvio.idPGeneral=this.data.idPGeneral
    this.jsonEnvio.idForoCurso=this.data.idTemaForo
    this.ContenidoPreguntaForoCurso()
    this.PartialRespuestaPregunta()
  }
  ContenidoPreguntaForoCurso(){
    this.ReproductorVideo='https://players.brightcove.net/6267108632001/rEr9tuuTvS_default/index.html?videoId='
    this._ForoCursoService.ObtenerContenidoForosCurso(this.data.idTemaForo).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.pregunta=x
        console.log(this.pregunta)
        if(x!=null){
          this.ForoCerrado=x.estadoCerrado;
        if(x.idVideo!=''){
          this.ReproductorVideo=this.ReproductorVideo+x.idVideo
        }
        if(this.pregunta!=null){
          this.imgForo=this._AvatarService.GetUrlImagenAvatar(this.pregunta.avatar)
        }
        }
      },
      error:e=>{
        this.pregunta=null
      }
    })
  }
  PartialRespuestaPregunta(){
    this._ForoCursoService.PartialRespuestaPregunta(this.data.idPGeneral,this.data.idTemaForo).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.respuestas=x
      }
    })
  }
  EnviarRegistroRespuestaForo(){
    this.jsonEnvio.estadoAtendido=1;
    this._ForoCursoService.EnviarRegistroRespuestaForo(this.jsonEnvio).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.CerrarModal();
      }
    })
  }
  CerrarModal(){
    this.dialogRef.close();
  }
}
