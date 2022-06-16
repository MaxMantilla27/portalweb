import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorVideoPlayerDTO } from 'src/app/Core/Models/ErrorVideoPlayerDTO';
import { VideoSesionService } from 'src/app/Core/Shared/Services/VideoSesion/video-sesion.service';
import { SesionVideoComponent } from '../../sesion-video.component';

@Component({
  selector: 'app-registrar-error',
  templateUrl: './registrar-error.component.html',
  styleUrls: ['./registrar-error.component.scss']
})
export class RegistrarErrorComponent implements OnInit {
  public userForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    protected _VideoSesionService:VideoSesionService,
    public dialogRef: MatDialogRef<SesionVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){ this.userForm =fb.group({
    Descripcion: ['', [Validators.required]],
    Comentario: ['', [Validators.required]],
  });
  }
  @Output() volver:EventEmitter<void>=new EventEmitter<void>();

  public RegistroErrorVideo:ErrorVideoPlayerDTO={
    idTipoCategoriaError:0,
    idPGeneral:0,
    ordenCapitulo:0,
    ordenSesion:0,
    descripcion:'',
    comentario:''
  }
  ngOnInit(): void {
  }

  RegistrarErrorVideoPlayer(){
    this.RegistroErrorVideo.idTipoCategoriaError=4,
    this.RegistroErrorVideo.idPGeneral=this.data.IdPGeneral,
    this.RegistroErrorVideo.ordenCapitulo=this.data.IdCapitulo,
    this.RegistroErrorVideo.ordenSesion=this.data.IdSesion,
    this.RegistroErrorVideo.descripcion=this.userForm.get('Descripcion')?.value;
    this.RegistroErrorVideo.comentario=this.userForm.get('Comentario')?.value;
    this._VideoSesionService.EnviarErrorVideoPlayer(this.RegistroErrorVideo).subscribe({
      next: (x) => {

      }
    })
    this.dialogRef.close()
  }
}
