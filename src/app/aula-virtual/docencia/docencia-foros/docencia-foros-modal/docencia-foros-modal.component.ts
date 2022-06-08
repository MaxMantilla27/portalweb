import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ForoRespuestaDTO } from 'src/app/Core/Models/ForoDTO';
import { AvatarService } from 'src/app/Core/Shared/Services/Avatar/avatar.service';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';

@Component({
  selector: 'app-docencia-foros-modal',
  templateUrl: './docencia-foros-modal.component.html',
  styleUrls: ['./docencia-foros-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocenciaForosModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DocenciaForosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _ForoCursoService:ForoCursoService,
    public _AvatarService:AvatarService
    ) { }
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
  }
  ngOnInit(): void {
    this.jsonEnvio.idPGeneral=this.data.idPGeneral
    this.jsonEnvio.idForoCurso=this.data.idTemaForo
    console.log(this.data)
    this.ContenidoPreguntaForoCurso()
    this.PartialRespuestaPregunta()
  }
  ContenidoPreguntaForoCurso(){
    console.log(this.data.idTemaForo)
    this._ForoCursoService.ContenidoPreguntaForoCurso(this.data.idTemaForo).subscribe({
      next:x=>{
        console.log(x)
        this.pregunta=x
        if(this.pregunta!=null && this.pregunta.length>0){
          this.imgForo=this._AvatarService.GetUrlImagenAvatar(this.pregunta[0].avatar)
        }
      },
      error:e=>{
        this.pregunta=null
      }
    })
  }
  PartialRespuestaPregunta(){
    this._ForoCursoService.PartialRespuestaPregunta(this.data.idPGeneral,this.data.idTemaForo).subscribe({
      next:x=>{
        console.log(x)
        this.respuestas=x
      }
    })
  }
  EnviarRegistroRespuestaForo(){
    this._ForoCursoService.EnviarRegistroRespuestaForo(this.jsonEnvio).subscribe({
      next:x=>{
        console.log(x)
        this.CerrarModal()
      }
    })
  }
  CerrarModal(){
    this.dialogRef.close();
  }
}
