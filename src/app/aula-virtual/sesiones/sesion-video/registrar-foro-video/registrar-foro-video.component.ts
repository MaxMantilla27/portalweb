import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ErrorVideoPlayerDTO } from 'src/app/Core/Models/ErrorVideoPlayerDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { VideoSesionService } from 'src/app/Core/Shared/Services/VideoSesion/video-sesion.service';
import { SesionVideoComponent } from '../sesion-video.component';
import { ForoDTOCompleto } from 'src/app/Core/Models/ForoDTO';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-registrar-foro-video',
  templateUrl: './registrar-foro-video.component.html',
  styleUrls: ['./registrar-foro-video.component.scss']
})
export class RegistrarForoVideoComponent implements OnInit {

  private signal$ = new Subject();
  public userForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    protected _VideoSesionService:VideoSesionService,
    public dialogRef: MatDialogRef<SesionVideoComponent>,
    private _HelperService:HelperService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _ForoCursoService: ForoCursoService,
    private _SnackBarServiceService: SnackBarServiceService,
  ){ this.userForm =fb.group({
    Contenido: ['', [Validators.required]],
  });
  }
  @Output() volver:EventEmitter<void>=new EventEmitter<void>();
  public ForoCurso: ForoDTOCompleto ={
    idPrincipal:0,
    idCurso: 0,
    idPEspecificoPadre: 0,
    idPEspecificoHijo: 0,
    titulo: '',
    contenido: '',
    idOrigenForo: 0,
    idCapitulo: 0,
    idSesion: 0,
    idSubSesion: 0,
    idVideo: '',
    urlArchivo: '',
  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
  }

  InsertarForo(){
    console.log(this.data)
    this.ForoCurso.idPrincipal=this.data.IdPrincipal
    this.ForoCurso.idCurso=this.data.IdCurso
    this.ForoCurso.idPEspecificoPadre=this.data.IdPEspecificoPadre
    this.ForoCurso.idPEspecificoHijo=this.data.IdPEspecificoHijo
    // if(this.data.NombreSubSesion!=''){
    // this.ForoCurso.titulo=this.data.NombreCapitulo + ' - ' + this.data.NombreSesion+' - '+this.data.NombreSubSesion
    // }
    // else{
    //   this.ForoCurso.titulo=this.data.NombreCapitulo + ' - ' + this.data.NombreSesion
    // }
    if(this.data.NombreSubSesion!=''){
    this.ForoCurso.titulo=this.data.NombreSubSesion
    }
    else{
      this.ForoCurso.titulo=this.data.NombreSesion
    }
    this.ForoCurso.contenido=this.userForm.get('Contenido')?.value
    this.ForoCurso.idOrigenForo=2
    this.ForoCurso.idCapitulo=this.data.NumeroCapitulo
    this.ForoCurso.idSesion=this.data.NumeroSesion
    this.ForoCurso.idSubSesion=this.data.NumeroSubSesion
    this.ForoCurso.idVideo=this.data.IdVideo
    this.ForoCurso.urlArchivo=''
    console.log(this.ForoCurso)
    this._ForoCursoService.InsertarForoCursoPorUsuario(this.ForoCurso).pipe(takeUntil(this.signal$)).subscribe({
        next: (x) => {
          this._SnackBarServiceService.openSnackBar("Se ha registrado con éxito su consulta. Se atenderá en un plazo máximo de 72 horas y visualizara su respuesta en el menú Foro",'x',10,"snackbarCrucigramaSucces");
          this.dialogRef.close();
        },
      });

  }

}
