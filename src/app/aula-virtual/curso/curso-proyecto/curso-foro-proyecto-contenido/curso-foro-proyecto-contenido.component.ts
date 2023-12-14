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
  @Output() volverProyecto = new EventEmitter<void>();
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
    file: new File([], ''),
  }
  public ForoCerrado=false;
  public file:any;
  public filestatus=false
  public fileErrorMsg=''
  public selectedFiles?: FileList;
  public nombrefile='Ningún archivo seleccionado'
  public Recarga=false
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
        if(x!=null){
          this.foroRespuesta.forEach(x=>{
            x.urlAvatarRespuesta=this._AvatarService.GetUrlImagenAvatar(x.avatar)
          })
          this.Recarga=true;
        }
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
    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.ForoRespuestaEnvio.file = file;
      }
    }
    this._ForoCursoService.EnviarRegistroRespuestaForo(this.ForoRespuestaEnvio).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {

      },
      complete:()=>{
        this.Recarga=false;
        this.RestaurarValores()
        this.ObtenerRespuestaForo()
      }
    });
  }
  VolverAtras(){
    this.volverProyecto.emit()
  }
  getFileDetails(event:any) {
    if(event!=null){
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
    else{
      this.filestatus=false
      this.nombrefile='Ningún archivo seleccionado'
      this.selectedFiles=undefined;
    }
  }
  RestaurarValores(){
    this.userForm.get('RespuestaForo')?.setValue('')
    this.ForoRespuestaEnvio.file = new File([], '')
    this.getFileDetails(null)
  }

}
