
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ForoDTO, ForoDTOCompleto } from 'src/app/Core/Models/ForoDTO';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';


@Component({
  selector: 'app-curso-foro-proyecto-insert',
  templateUrl: './curso-foro-proyecto-insert.component.html',
  styleUrls: ['./curso-foro-proyecto-insert.component.scss']
})
export class CursoForoProyectoInsertComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  public userForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private _ForoCursoService: ForoCursoService,
    private _HelperService:HelperService,
    private _SnackBarServiceService: SnackBarServiceService,
  ) { this.userForm =fb.group({
    Contenido: ['', [Validators.required]],
    Archivo: ['',],
  });
  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  @Input() valorNavegacionForo=-1;
  @Input() IdPprincipal=0;
  @Input() IdPgeneral=0;
  @Input() IdPEspecificoPadre=0;
  @Input() IdPEspecificoHijo=0;
  @Input() Curso:any;
  @Input() NombreCurso='';
  @Input() UrlArchivo='';
  @Output() volver:EventEmitter<void>=new EventEmitter<void>();
  public NuevoForo =false;
  public AnadirForo =false;
  public CargarArchivoForo =true;
  // public ForoCurso: ForoDTO ={
  //   idPrincipal:0,
  //   idCurso: 0,
  //   idPEspecificoPadre: 0,
  //   idPEspecificoHijo: 0,
  //   titulo: '',
  //   contenido: ''
  // }
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
    file: new File([], ''),

  }
  public progress=0
  public selectedFiles?: FileList;
  public file:any;
  public filestatus=false
  public fileErrorMsg=''
  public nombrefile='Ningún archivo seleccionado'
  ngOnInit(): void {

  }
  InsertarForo(){
    this.ForoCurso.idPrincipal = this.IdPprincipal;
    this.ForoCurso.idCurso = this.IdPgeneral;
    this.ForoCurso.idPEspecificoPadre = this.IdPEspecificoPadre;
    this.ForoCurso.idPEspecificoHijo = this.IdPEspecificoHijo;
    this.ForoCurso.titulo = this.Curso.programaEspecifico + '- Proyecto de aplicación';
    this.ForoCurso.contenido = this.userForm.get('Contenido')?.value;
    this.ForoCurso.idOrigenForo=4
    this.ForoCurso.idCapitulo=0
    this.ForoCurso.idSesion=0
    this.ForoCurso.idSubSesion=0
    this.ForoCurso.idVideo="0"
    console.log(this.ForoCurso)
    this._HelperService.enviarMsjAcciones({Tag:"Button",Nombre:'Publica Tema',Seccion:'Foro',valorTitulo:this.ForoCurso.titulo,valorContenido:this.ForoCurso.contenido})
    this._ForoCursoService.InsertarForoCursoPorUsuario(this.ForoCurso).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x);
        this.VolverAtras();
      },
    });
  }
  VolverAtras(){
    this.volver.emit()
  }
  EventoInteraccionButton(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:"Button",Nombre:nombre,Seccion:'Foro'})
  }
  mensajeError(){
    this._SnackBarServiceService.openSnackBar('No puedes agregar un archivo, comunícate con tu asistente de atención al cliente.','x',
    10,'snackbarCrucigramaerror')
  }
  getFileDetails(event:any) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.filestatus=true
      var name = event.target.files[i].name;
      this.nombrefile=name;
      var type = event.target.files[i].type;
      var size = event.target.files[i].size;
      var modifiedDate = event.target.files[i].lastModifiedDate;
      var extencion=name.split('.')[name.split('.').length-1]
      if( Math.round((size/1024)/1024)>150){
        this.fileErrorMsg='El tamaño del archivo no debe superar los 25 MB'
        this.filestatus=false
      }
      this.selectedFiles = event.target.files;
    }
  }

}

