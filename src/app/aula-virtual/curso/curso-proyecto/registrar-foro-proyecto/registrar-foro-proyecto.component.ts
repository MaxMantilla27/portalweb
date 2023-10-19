import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { VideoSesionService } from 'src/app/Core/Shared/Services/VideoSesion/video-sesion.service';
import { ForoDTOCompleto } from 'src/app/Core/Models/ForoDTO';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { SesionVideoComponent } from 'src/app/aula-virtual/sesiones/sesion-video/sesion-video.component';

@Component({
  selector: 'app-registrar-foro-proyecto',
  templateUrl: './registrar-foro-proyecto.component.html',
  styleUrls: ['./registrar-foro-proyecto.component.scss']
})
export class RegistrarForoProyectoComponent implements OnInit {

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
    urlArchivo:'',
  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
  }

  InsertarForo(){
    console.log(this.data)
    this.ForoCurso.idPrincipal = this.data.IdPrincipal;
    this.ForoCurso.idCurso = this.data.IdPGeneral;
    this.ForoCurso.idPEspecificoPadre = this.data.IdPEspecificoPadre;
    this.ForoCurso.idPEspecificoHijo = this.data.IdPEspecificoHijo;
    this.ForoCurso.titulo = this.data.Curso.programaEspecifico + '- Proyecto de aplicación';
    this.ForoCurso.contenido = this.userForm.get('Contenido')?.value;
    this.ForoCurso.idOrigenForo=4
    this.ForoCurso.idCapitulo=0
    this.ForoCurso.idSesion=0
    this.ForoCurso.idSubSesion=0
    this.ForoCurso.idVideo=''
    this.ForoCurso.urlArchivo=this.data.UrlArchivo
    console.log(this.ForoCurso)
    this._ForoCursoService.InsertarForoCursoPorUsuario(this.ForoCurso).pipe(takeUntil(this.signal$)).subscribe({
        next: (x) => {
          this._SnackBarServiceService.openSnackBar("Se ha registrado con éxito su consulta. Se atenderá en un plazo máximo de 72 horas y visualizara su respuesta en el menú Foro",'x',10,"snackbarCrucigramaSucces");
        },
        complete:()=>{
          this.dialogRef.close(true);
        }
    });

  }

}
