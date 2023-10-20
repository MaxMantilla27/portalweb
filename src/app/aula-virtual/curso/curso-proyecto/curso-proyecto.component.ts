import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { ModelTareaEvaluacionTareaDTO, ParametroObtenerEvaluacionTarea } from 'src/app/Core/Models/TareaEvaluacionDTO';
import { EliminarComponent } from 'src/app/Core/Shared/Containers/Dialog/eliminar/eliminar.component';
import { AvatarService } from 'src/app/Core/Shared/Services/Avatar/avatar.service';
import { ForoCursoService } from 'src/app/Core/Shared/Services/ForoCurso/foro-curso.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { TareaEvaluacionService } from 'src/app/Core/Shared/Services/TareaEvaluacion/tarea-evaluacion.service';
import { RegistrarForoProyectoComponent } from './registrar-foro-proyecto/registrar-foro-proyecto.component';

@Component({
  selector: 'app-curso-proyecto',
  templateUrl: './curso-proyecto.component.html',
  styleUrls: ['./curso-proyecto.component.scss'],
})
export class CursoProyectoComponent implements OnInit,OnChanges,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _TareaEvaluacionService: TareaEvaluacionService,
    private _SnackBarServiceService: SnackBarServiceService,
    public dialog: MatDialog,
    private _HelperService:HelperService,
    private _ForoCursoService: ForoCursoService,
    private _AvatarService: AvatarService
  ) {}
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  @Input() idProyecto:any;
  @Input() idPGeneral=0;;
  @Input() idPEspecifico=0;
  @Input() curso:any;
  @Input() idMatricula:any;
  public proyecto:any
  public params: ParametroObtenerEvaluacionTarea = {
    id:0,
    idEvaluacion: 0,
    idPEspecifico: 0,
    idPEspecificoPadre: 0,
    idPGeneral: 0,
    idPrincipal: 0,
  };
  public miPerfil:any
  public progress=0
  public selectedFiles?: FileList;
  public file:any;
  public filestatus=false
  public fileErrorMsg=''
  public instruccionesAcerca=false;
  public instruccionesSubir=false
  public instruccionesAnexos=false
  public foroAbrir=false
  public nombrefile='Ningún archivo seleccionado'
  public sendFile:ModelTareaEvaluacionTareaDTO={
    idEsquemaEvaluacionPGeneralDetalle:0,
    idEsquemaEvaluacionPGeneralDetalle_Anterior:0,
    idEvaluacion:0,
    idPEspecificoHijo:0,
    idPEspecificoPadre:0,
    idPGeneral:0,
    idPrincipal:0,
    idTipoEvaluacionTrabajo:0,
    file:new File([],''),
    idMatriculaCabecera:0
  }
  public anexos:Array<any>=[]
  public valorNavegarForoPrincipal=0;
  public NuevoForo=false;
  public ContenidoForo=false;
  public IdForo=0;
  public foro: Array<any> = [];
  public foroFiltrado: Array<any> = [];
  public paginacion = [1];
  public pagina = 1;
  public paginaCeil = Math.ceil(this.pagina / 5);
  public IdPprincipal = 0;
  public IdPEspecificoPadre = 0;
  public IdPEspecificoHijo = 0;
  public Capitulo = '';
  public UrlArchivo ='';
  @Input() json: ParametrosEstructuraEspecificaDTO = {
    AccesoPrueba: false,
    IdMatriculaCabecera: 0,
    IdPEspecificoPadre: 0,
    IdPGeneralPadre: 0,
    IdPEspecificoHijo: 0,
    IdPGeneralHijo: 0,
    NombreCapitulo: '',
    NombrePrograma: '',
    idModalidad:1
  };
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.miPerfil=x
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.idProyecto!=undefined){
      this.params.idEvaluacion=this.idProyecto;
      this.params.idPEspecifico=this.idPEspecifico
      this.params.idPEspecificoPadre=this.idPEspecifico
      this.params.idPGeneral=this.idPGeneral
      this.params.idPrincipal=this.idPGeneral
      this.ObtenerEvaluacionProyectoAplicacion();
      this.ListaPgeneralProyectoAplicacionAnexo();
    }
    if (this.idPGeneral != 0 && this.valorNavegarForoPrincipal==0) {
      this.ObtenerForoCursoProyecto();
    }
  }

  maxValue(array:Array<any>){
    return Math.max(...array.map(o => o.valor))
  }
  minValue(array:Array<any>){
    return Math.min(...array.map(o => o.valor))
  }
  mensajeError(){
    this._SnackBarServiceService.openSnackBar('Aún no puedes subir otra versión de tu proyecto, comunícate con tu asistente de atención al cliente.','x',
    10,'snackbarCrucigramaerror')
  }
  ObtenerEvaluacionProyectoAplicacion(){
    this._TareaEvaluacionService.ObtenerEvaluacionProyectoAplicacion(this.params).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.proyecto=x
        this.proyecto.habilitado=true
        if(this.proyecto.registroEvaluacionArchivo.length>0){
          this.proyecto.registroEvaluacionArchivo.forEach((r:any) => {
            this.UrlArchivo=r.direccionUrl;
          })
          if(this.proyecto.registroEvaluacionArchivo[this.proyecto.registroEvaluacionArchivo.length-1].estadoDevuelto!=true){
            if(this.proyecto.registroEvaluacionArchivo[this.proyecto.registroEvaluacionArchivo.length-1].calificado==false){
              this.proyecto.habilitado=false
            }else{
              var nota=this.proyecto.registroEvaluacionArchivo[this.proyecto.registroEvaluacionArchivo.length-1].notaProyecto.valorEscala;
              if(nota==null){
                this.proyecto.habilitado=false
              }else{
                if(nota>60){
                  this.proyecto.habilitado=false
                }
              }
            }
          }
        }
      }
    })
  }
  ListaPgeneralProyectoAplicacionAnexo(){
    this._TareaEvaluacionService.ListaPgeneralProyectoAplicacionAnexo(this.params.idPGeneral).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x!=null){
          this.anexos=x
          this.anexos.forEach((a:any) => {
            a.ver=false
          });
        }
      }
    })
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
      // console.log ('Name: ' + name + "\n" +
      //   'Type: ' + extencion + "\n" +
      //   'Last-Modified-Date: ' + modifiedDate + "\n" +
      //   'Size: ' + Math.round((size/1024)/1024) + " MB");
    }
  }

  setData(){
    this.sendFile.idEsquemaEvaluacionPGeneralDetalle=this.proyecto.criteriosEvaluacion.idEsquemaEvaluacionPGeneralDetalle
    this.sendFile.idEsquemaEvaluacionPGeneralDetalle_Anterior=this.proyecto.criteriosEvaluacion.idEsquemaEvaluacionPGeneralDetalle_Anterior
    this.sendFile.idEvaluacion=this.idProyecto
    this.sendFile.idPEspecificoHijo=this.idPEspecifico
    this.sendFile.idPEspecificoPadre=this.idPEspecifico
    this.sendFile.idPGeneral=this.idPGeneral
    this.sendFile.idPrincipal=this.idPGeneral
    this.sendFile.idTipoEvaluacionTrabajo=2
    this.sendFile.idMatriculaCabecera=this.idMatricula
    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.sendFile.file = file;
      }
    }
  }
  EnviarFile(){
    if(this.filestatus){
      var cantidad=0
      this.proyecto.registroEvaluacionArchivo.forEach((e:any) => {
        if(e.estadoDevuelto!=true){
          cantidad++
        }
      });
      if(cantidad>=2){
        this._SnackBarServiceService.openSnackBar("Solo tiene 2 intentos para subir su proyecto.",'x',15,"snackbarCrucigramaerror");
      }else{
        this.setData()
        console.log(this.sendFile)
        this._TareaEvaluacionService.EnviarEvaluacionTarea(this.sendFile).pipe(takeUntil(this.signal$)).subscribe({
          next:x=>{
            if (x.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * x.loaded / x.total);
              console.log(this.progress)
            } else if (x instanceof HttpResponse) {
              this.progress=0;
              if(x.body==true){
                this.ObtenerEvaluacionProyectoAplicacion()
                //this._SnackBarServiceService.openSnackBar(x.body.mensaje,'x',20,"snackbarCrucigramaSucces");
              }else{
                if(x.body==false){
                  this._SnackBarServiceService.openSnackBar("Solo tiene 3 intentos para subir su tarea.",'x',15,"snackbarCrucigramaerror");
                }else{
                  if(x.body.estado==true){
                    this.ObtenerEvaluacionProyectoAplicacion()
                    this._SnackBarServiceService.openSnackBar(x.body.mensaje,'x',20,"snackbarCrucigramaSucces");
                  }else{
                    this._SnackBarServiceService.openSnackBar(x.body.mensaje,'x',20,"snackbarCrucigramaerror");
                  }
                }
              }
            }
          },
          error:x=>{
            this.progress=0;

          }
        })
      }
    }else{
      this._SnackBarServiceService.openSnackBar("Ningún archivo seleccionado.",'x',15,"snackbarCrucigramaerror");
    }
  }
  EventoInteraccionButton(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:"Button",Nombre:nombre,Seccion:'Proyecto'})
  }
  EventoInteraccionAccordionCertificado(nombre:string,estado:string){
    this._HelperService.enviarMsjAcciones({Tag:'Accordion',Nombre:nombre,Estado:estado,Seccion:'Proyecto'})
  }
  OpenModalDelete(tarea:any){
    const dialogRef = this.dialog.open(EliminarComponent, {
      width: '550px',
      data: {
        titulo:'¿Está seguro de eliminar la tarea registrada?',
        sub:'¡No podrás revertir esta acción!'},
      panelClass: 'custom-dialog-eliminar',
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe(result => {
      if(result==true){
        this.DeleteTarea(tarea)
      }
    });


  }
  DeleteTarea(tarea:any){
    console.log(tarea)
    this._TareaEvaluacionService.DeleteEvaluacionTareaEvaluacionTarea(tarea.id).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x.estado==true){
          this.ObtenerEvaluacionProyectoAplicacion()
          this._SnackBarServiceService.openSnackBar(x.mensaje,'x',20,"snackbarCrucigramaSucces");
        }else{
          this._SnackBarServiceService.openSnackBar(x.mensaje,'x',20,"snackbarCrucigramaerror");
        }
      }
    })
  }
  ObtenerForoCursoProyecto() {
    this._ForoCursoService.ObtenerForoCursoProyecto(this.idPGeneral).pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.foro=[];
        console.log(x);
        this.foro = x;
        if (this.foro != null && this.foro != undefined) {
          this.foro.forEach((x) => {
            x.urlAvatar = this._AvatarService.GetUrlImagenAvatar(x.avatar);
          });
          var pag = Math.ceil(this.foro.length / 4);
          this.paginacion = [];
          for (let index = 0; index < pag; index++) {
            this.paginacion.push(index + 1);
          }
        }
      },
    });
  }
  minusPage() {
    if (this.pagina > 1) {
      this.pagina--;
      this.paginaCeil = Math.ceil(this.pagina / 5);
    }
  }
  plusPage() {
    if(this.foro!=null){
      if (this.pagina < Math.ceil(this.foro.length / 4)) {
        this.pagina++;
        this.paginaCeil = Math.ceil(this.pagina / 5);
      }
    }
  }
  page(p: number) {
    this.pagina = p;
    this.paginaCeil = Math.ceil(this.pagina / 5);
  }
  RefrescarForo(){
    this.NuevoForo=false;
    this.ContenidoForo=false;
    console.log('REFRESCANDO==================')
    this.ObtenerForoCursoProyecto() ;
  }
  Interaccion(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:"Button",Nombre:nombre})
  }
  OpenModalForo(): void {
    const dialogRef = this.dialog.open(RegistrarForoProyectoComponent, {
      width: '500px',
      data: {
        IdPGeneral:this.idPGeneral,
        IdPrincipal:this.idPGeneral,
        IdPEspecificoPadre:this.idPEspecifico,
        IdPEspecificoHijo:this.idPEspecifico,
        Curso:this.curso,
        UrlArchivo:this.UrlArchivo
        },
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      if(result==true){
        this.ObtenerForoCursoProyecto();
      }
    });
  }
}
