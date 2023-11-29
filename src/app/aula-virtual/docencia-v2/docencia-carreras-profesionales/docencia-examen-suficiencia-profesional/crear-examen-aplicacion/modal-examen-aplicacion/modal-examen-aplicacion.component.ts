import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { PEspecificoCarreraExamenService } from 'src/app/Core/Shared/Services/PEspecificoCarreraExamen/pespecifico-carrera-examen.service';
import { PEspecificoCarreraExamenPreguntaAlternativaDTO, PEspecificoCarreraExamenPreguntaFileDTO, PEspecificoCarreraExamenSaveDTO } from 'src/app/Core/Models/PEspecificoCarreraExamenDTO';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ModalExamenAplicacionPreguntasComponent } from './modal-examen-aplicacion-preguntas/modal-examen-aplicacion-preguntas.component';

@Component({
  selector: 'app-modal-examen-aplicacion',
  templateUrl: './modal-examen-aplicacion.component.html',
  styleUrls: ['./modal-examen-aplicacion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalExamenAplicacionComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput')
  fileInput!: ElementRef;

  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  constructor(
    public dialogRef: MatDialogRef<ModalExamenAplicacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _PEspecificoCarreraExamenService: PEspecificoCarreraExamenService,
    public _SnackBarServiceService: SnackBarServiceService,
    private _PEspecificoEsquemaService:PEspecificoEsquemaService,
    private alertaService: AlertaService,
    public dialog: MatDialog,
  ) {}
  public file=new File([], '')
  public saveCarreraExamen: PEspecificoCarreraExamenSaveDTO = {
    IdPEspecifico: 0,
    Usuario: '',
    Id: 0,
    Titulo: '',
    Descripcion: '',
    CalificacionMaxima: 10,
    PlazoEntrega: 0,
    Preguntas:[],
    TiempoLimite:0
  };
  formularioCarreraExamen = new FormGroup({
    Titulo: new FormControl('', [Validators.required]),
    Descripcion: new FormControl(),
    CalificacionMaxima: new FormControl(100, [Validators.required]),
    PlazoEntrega: new FormControl(90, [Validators.required]),
    TiempoLimite: new FormControl(0, [Validators.required]),
  });
  public Title = 'Agregar examen de suficiencia profesional';
  public fecha = new Date();
  public tipoagregra = -1;
  public nombrefile = 'Seleccione Archivo';
  public filestatus = false;
  public fileErrorMsg = '';
  public selectedFiles?: FileList;
  public Horas: Array<any> = [];
  public Minutos: Array<any> = [0, 30, 59];
  public Calificaciones: Array<any> = [];
  public cargando = false;
  public dias: Array<any> = [];
  public tipoPregunta: Array<any> = [];
  ngOnInit(): void {
    for (let index = 0; index < 200; index++) {
      this.dias.push(index);
    }
    for (let index = 0; index < 24; index++) {
      var hora = '' + index;
      if (index < 10) {
        hora = '0' + index;
      }
      this.Horas.push(hora.toString());
    }
    // for (let index = 1; index < 60; index++) {
    //   var Minutos = '' + index;
    //   if (index < 10) {
    //     Minutos = '0' + index;
    //   }
    //   this.Minutos.push(Minutos.toString());
    // }
    for (let index = 0; index < 11; index++) {
      this.Calificaciones.push(index * 10);
    }
    console.log(this.data);
    this.saveCarreraExamen.IdPEspecifico = this.data.idPEspecifico;
    if (this.data.id != 0) {
      this.Title = 'Editar examen de suficiencia profesional';
      this.saveCarreraExamen.Id = this.data.id;
      this.ObtenerPEspecificoCarreraExamenPorId();
      this.ObtenerpreguntasExamen();
    }
    this.ObtenerPreguntaTipo();
  }
  ObtenerPreguntaTipo() {
    this._PEspecificoEsquemaService
      .ObtenerPreguntaTipo()
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.tipoPregunta = x;
          console.log(x);
        },
        error: (x) => {},
      });
  }

  GettipoPregunta(id: number | null): string {
    var text = '';
    for (let index = 0; index < this.tipoPregunta.length; index++) {
      if (this.tipoPregunta[index].id == id) {
        text = this.tipoPregunta[index].valor;
        break;
      }
    }
    return text;
  }
  ObtenerPEspecificoCarreraExamenPorId() {
    this._PEspecificoCarreraExamenService
      .ObtenerPEspecificoCarreraExamenPorId(this.data.id)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          this.formularioCarreraExamen.get('Titulo')?.setValue(x.titulo);
          this.formularioCarreraExamen.get('Descripcion')?.setValue(x.descripcion);
          this.formularioCarreraExamen.get('CalificacionMaxima')?.setValue(x.calificacionMaxima);
          this.formularioCarreraExamen.get('CalificacionMaximaSecundaria')?.setValue(x.calificacionMaximaSecundaria);
          this.formularioCarreraExamen.get('PlazoEntrega')?.setValue(x.plazoEntrega);
          this.formularioCarreraExamen.get('TiempoLimite')?.setValue(x.tiempoLimite);

        },
        error: (x) => {},
      });
  }
  ObtenerpreguntasExamen() {
    this._PEspecificoCarreraExamenService
      .ObtenerpreguntasExamen(this.data.id)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);

          if (x != null) {
            x.forEach((p: any) => {
              var alter: Array<PEspecificoCarreraExamenPreguntaAlternativaDTO>;
              alter = [];
              if (p.alternativas != null && p.alternativas.length > 0) {
                p.alternativas.forEach((al: any) => {
                  alter.push({
                    Id: al.id,
                    Alternativa: al.alternativa,
                    EsCorrecta: al.esCorrecta,
                    Puntaje: al.puntaje,
                    Disabled:false,
                  });
                });
              }
              this.saveCarreraExamen.Preguntas.push({
                Id: p.id,
                IdPreguntaTipo: p.idPreguntaTipo,
                Enunciado: p.enunciado,
                Descripcion: p.descripcion,
                Puntaje: p.puntaje,
                NombreArchivo: p.nombreArchivo,
                UrlArchivoSubido: p.urlArchivoSubido,
                Retroalimentacion: p.retroalimentacion,
                NombreArchivoRetroalimentacion: p.nombreArchivoRetroalimentacion,
                UrlArchivoSubidoRetroalimentacion:p.urlArchivoSubidoRetroalimentacion,
                file: new File([], ''),
                fileRetroalimentacion: new File([], ''),
                Alternativas: alter,
              });
            });
          }

        },
        error: (x) => {},
      });
  }
  AgregarPEspecificoExamen() {
    this.cargando=true
    this.saveCarreraExamen.Titulo = this.formularioCarreraExamen.get('Titulo')?.value;
    this.saveCarreraExamen.Descripcion = this.formularioCarreraExamen.get('Descripcion')?.value;
    this.saveCarreraExamen.TiempoLimite = this.formularioCarreraExamen.get('TiempoLimite')?.value;
    this.saveCarreraExamen.CalificacionMaxima =this.formularioCarreraExamen.get('CalificacionMaxima')?.value;
    this.saveCarreraExamen.PlazoEntrega = this.formularioCarreraExamen.get('PlazoEntrega')?.value;
    console.log(this.saveCarreraExamen);
    this.alertaService.mensajeConfirmacionRegistro('El examen no será visible hasta su publicación. ¿Desea continuar?','').then((result) => {
      if (result.isConfirmed) {
        this._PEspecificoCarreraExamenService
      .AgregarPEspecificoExamen(this.saveCarreraExamen)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          if (x.type === HttpEventType.UploadProgress) {
            console.log(Math.round((100 * x.loaded) / x.total));
          } else if (x instanceof HttpResponse) {
            this._SnackBarServiceService.openSnackBar("El examen se ha guardado correctamente.",
            'x',
            10,
            "snackbarCrucigramaSucces")
            this.cargando=false
            this.dialogRef.close('guardado');
          }
        },
        error: (x) => {},
      });
      }
      else{
        this.dialogRef.close();
      }
    });
  }
  OpenCrearPregunta() {
    const dialogRef = this.dialog.open(ModalExamenAplicacionPreguntasComponent, {
      width: '1000px',
      data: {
        pregunta: null,
        sesion: this.data.sesion,
        tipoPregunta: this.tipoPregunta,
      },
      panelClass: 'dialog-Agregar-Tarea',
      disableClose:true
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.signal$))
      .subscribe((result) => {
        console.log(result);
        if (result != undefined && result != '') {
          this.saveCarreraExamen.Preguntas.push(result);
        }
      });
  }

  getFileDetails(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.filestatus = true;
      var name = event.target.files[i].name;
      var size = event.target.files[i].size;
      console.log(event);
      if (Math.round(size / 1024 / 1024) > 15) {
        this._SnackBarServiceService.openSnackBar(
          'El tamaño del archivo no debe superar los 15 MB',
          'x',
          15,
          'snackbarCrucigramaerror'
        );
      } else {
        if(name.split('.')[name.split('.').length-1]!='csv'){

          this._SnackBarServiceService.openSnackBar(
            'El formato de subida es (csv)',
            'x',
            15,
            'snackbarCrucigramaerror'
          );
        }else{
          this.selectedFiles = event.target.files;
          this.ImportarExel()
        }
      }

      // console.log ('Name: ' + name + "\n" +
      //   'Type: ' + extencion + "\n" +
      //   'Last-Modified-Date: ' + modifiedDate + "\n" +
      //   'Size: ' + Math.round((size/1024)/1024) + " MB");
    }
  }
  ImportarExel() {
    if(this.selectedFiles){
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.file = file;
      }
    }
    if (this.selectedFiles) {
      this._PEspecificoEsquemaService.ImportarExel(this.file).pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          if (x.type === HttpEventType.UploadProgress) {
            console.log(Math.round((100 * x.loaded) / x.total));
          } else if (x instanceof HttpResponse) {
            console.log(x);
            console.log(this.fileInput.nativeElement.value)
            this.fileInput.nativeElement.value=""
            if (x.body != null) {
              x.body.forEach((p: any) => {
                var alter: Array<PEspecificoCarreraExamenPreguntaAlternativaDTO>;
                alter = [];
                if (p.alternativas != null && p.alternativas.length > 0) {
                  p.alternativas.forEach((al: any) => {
                    alter.push({
                      Id: al.id,
                      Alternativa: al.alternativa,
                      EsCorrecta: al.esCorrecta,
                      Puntaje: al.puntaje,
                      Disabled:false,
                    });
                  });
                }
                this.saveCarreraExamen.Preguntas.push({
                  Id: p.id,
                  IdPreguntaTipo: p.idPreguntaTipo,
                  Enunciado: p.enunciado,
                  Descripcion: p.descripcion,
                  Puntaje: p.puntaje,
                  NombreArchivo: p.nombreArchivo,
                  UrlArchivoSubido: p.urlArchivoSubido,
                  Retroalimentacion: p.retroalimentacion,
                  NombreArchivoRetroalimentacion:
                    p.nombreArchivoRetroalimentacion,
                  UrlArchivoSubidoRetroalimentacion:
                    p.urlArchivoSubidoRetroalimentacion,
                  file: new File([], ''),
                  fileRetroalimentacion: new File([], ''),
                  Alternativas: alter,
                });
              });
              this._SnackBarServiceService.openSnackBar(
                'Se importaron las '+x.body.length+' preguntas',
                'x',
                15,
                'snackbarCrucigramaSucces'
              );
            }else{
              this._SnackBarServiceService.openSnackBar(
                'Existe un error con el formato de su archivo',
                'x',
                15,
                'snackbarCrucigramaerror'
              );
            }
          }
        },
        error: (x) => {},
      });
    }
  }
  OpenEditar(i: number) {
    var json = JSON.stringify(this.saveCarreraExamen.Preguntas[i]);
    const dialogRef = this.dialog.open(ModalExamenAplicacionPreguntasComponent, {
      width: '1000px',
      data: {
        pregunta: this.saveCarreraExamen.Preguntas[i],
        sesion: this.data.sesion,
        tipoPregunta: this.tipoPregunta,
      },
      panelClass: 'dialog-Agregar-Tarea',
      disableClose:true
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.signal$))
      .subscribe((result) => {
        console.log(result);
        if (result != undefined && result != '') {
          // this.save.Preguntas.push(result)
        } else {
          this.saveCarreraExamen.Preguntas[i] = JSON.parse(json);
        }
      });
  }
  Eliminar(index: number) {
    this.saveCarreraExamen.Preguntas.splice(index,1)
  }
}
