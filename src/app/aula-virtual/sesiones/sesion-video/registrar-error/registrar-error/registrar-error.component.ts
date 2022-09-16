import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ErrorVideoPlayerDTO } from 'src/app/Core/Models/ErrorVideoPlayerDTO';
import { VideoSesionService } from 'src/app/Core/Shared/Services/VideoSesion/video-sesion.service';
import { SesionVideoComponent } from '../../sesion-video.component';

@Component({
  selector: 'app-registrar-error',
  templateUrl: './registrar-error.component.html',
  styleUrls: ['./registrar-error.component.scss']
})
export class RegistrarErrorComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
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
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
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
    this._VideoSesionService.EnviarErrorVideoPlayer(this.RegistroErrorVideo).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x)
      },
      error:e=>{
        console.log(e)
      },
      complete:()=>{
          this.dialogRef.close()
      }
    })
  }
}
