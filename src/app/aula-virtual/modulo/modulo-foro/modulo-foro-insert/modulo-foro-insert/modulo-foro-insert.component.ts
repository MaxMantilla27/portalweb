import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ForoDTO, ForoDTOCompleto } from 'src/app/Core/Models/ForoDTO';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';


@Component({
  selector: 'app-modulo-foro-insert',
  templateUrl: './modulo-foro-insert.component.html',
  styleUrls: ['./modulo-foro-insert.component.scss'],
})
export class ModuloForoInsertComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  public userForm: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private _ForoCursoService: ForoCursoService,
    private _HelperService:HelperService
  ) { this.userForm =fb.group({
    Titulo: ['', [Validators.required]],
    Contenido: ['', [Validators.required]],
    // Archivo: ['', [Validators.required]],
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
  @Output() volver:EventEmitter<void>=new EventEmitter<void>();
  public NuevoForo =false;
  public AnadirForo =false;
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
  public file:any;
  public filestatus=false
  public fileErrorMsg=''
  public selectedFiles?: FileList;
  public nombrefile='Ningún archivo seleccionado'
  public progress=0
  ngOnInit(): void {

  }
  InsertarForo(){
    // this.ForoCurso.idPrincipal = this.IdPprincipal;
    // this.ForoCurso.idCurso = this.IdPgeneral;
    // this.ForoCurso.idPEspecificoPadre = this.IdPEspecificoPadre;
    // this.ForoCurso.idPEspecificoHijo = this.IdPEspecificoHijo;
    // this.ForoCurso.titulo =this.userForm.get('Titulo')?.value;
    // this.ForoCurso.contenido = this.userForm.get('Contenido')?.value;
    // this.ForoCurso.idOrigenForo=1
    // this.ForoCurso.idCapitulo=0
    // this.ForoCurso.idSesion=0
    // this.ForoCurso.idSubSesion=0
    // this.ForoCurso.idVideo="0"
    this.ForoCurso.idPrincipal=this.IdPprincipal;
    this.ForoCurso.idCurso=this.IdPgeneral;
    this.ForoCurso.idPEspecificoPadre=this.IdPEspecificoPadre;
    this.ForoCurso.idPEspecificoHijo=this.IdPEspecificoHijo;
    this.ForoCurso.titulo=this.userForm.get('Titulo')?.value;
    this.ForoCurso.contenido=this.userForm.get('Contenido')?.value
    this.ForoCurso.idOrigenForo=1
    this.ForoCurso.idCapitulo=0
    this.ForoCurso.idSesion=0
    this.ForoCurso.idSubSesion=0
    this.ForoCurso.idVideo="0"
    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.ForoCurso.file = file;
      }
    }
    console.log(this.ForoCurso)
    this._HelperService.enviarMsjAcciones({Tag:"Button",Nombre:'Publica Tema',Seccion:'Foro',valorTitulo:this.ForoCurso.titulo,valorContenido:this.ForoCurso.contenido})
    this._ForoCursoService.InsertarForoCursoPorUsuario(this.ForoCurso).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x);
      },
      complete:()=>{
        this.VolverAtras();
      }
    });
  }
  VolverAtras(){
    this.volver.emit()
  }
  EventoInteraccionButton(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:"Button",Nombre:nombre,Seccion:'Foro'})
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
