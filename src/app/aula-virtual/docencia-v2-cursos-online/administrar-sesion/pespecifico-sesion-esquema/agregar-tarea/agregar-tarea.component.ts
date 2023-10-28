import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgregarCuestionarioComponent } from '../agregar-cuestionario/agregar-cuestionario.component';
import { PEspecificoSesionTareaSaveDTO } from 'src/app/Core/Models/PEspecificoEsquema';
import {
  FormGroup,
  FormControl,
  Validators,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';

@Component({
  selector: 'app-agregar-tarea',
  templateUrl: './agregar-tarea.component.html',
  styleUrls: ['./agregar-tarea.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgregarTareaComponent implements OnInit, OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  constructor(
    public dialogRef: MatDialogRef<AgregarTareaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _PEspecificoEsquemaService: PEspecificoEsquemaService,
    public _SnackBarServiceService: SnackBarServiceService,
    private alertaService: AlertaService,

  ) {}
  public saveTarea: PEspecificoSesionTareaSaveDTO = {
    file: new File([], ''),
    IdPEspecificoSesion: 0,
    Usuario: '',
    Id: 0,
    Titulo: '',
    Descripcion: '',
    CalificacionMaxima: 10,
    FechaEntrega: '',
    IdCriterioEvaluacion: 0,
    TieneArchivo:false,
    CalificacionMaximaSecundaria:0,
    FechaEntregaSecundaria:''
  };

  formularioTarea = new FormGroup({
    Titulo: new FormControl('', [Validators.required]),
    Descripcion: new FormControl(),
    CalificacionMaxima: new FormControl(100, [Validators.required]),
    FechaEntrega: new FormControl(null, [Validators.required]),
    HoraEntrega: new FormControl(null, [Validators.required]),
    MinutoEntrega: new FormControl(null, [Validators.required]),
    CalificacionMaximaSecundaria: new FormControl(0, [Validators.required]),
    FechaEntregaSecundaria: new FormControl(),
    HoraEntregaSecundaria: new FormControl(),
    MinutoEntregaSecundaria: new FormControl(),
    IdCriterioEvaluacion: new FormControl(0, [Validators.required]),
  });
  public Title = 'AGREGAR TAREA';
  public fecha = new Date();
  public nombrefile = 'Seleccione Archivo';
  public filestatus = false;
  public fileErrorMsg = '';
  public selectedFiles?: FileList;
  public Horas: Array<any> = [];
  public Minutos: Array<any> = [0,30,59];
  public Calificaciones: Array<any> = [];
  public cargando=false
  public esquemas : any;

  ngOnInit(): void {
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
    // this.saveTarea.IdCriterioEvaluacion = this.data.idCriterio;
    this.saveTarea.IdPEspecificoSesion = this.data.sesion.idSesion;
    if (this.data.id != 0) {
      this.Title = 'EDITAR TAREA';
      this.saveTarea.Id = this.data.id;
      this.ObtenerPEspecificoSesionTareaPorId()
    }
    else{
      this.ObtenerTipoCriteriosPorProgramaEspecifico(this.data.idTipoCriterioEvaluacion)
    }
  }
  ObtenerPEspecificoSesionTareaPorId() {
    this._PEspecificoEsquemaService
      .ObtenerPEspecificoSesionTareaPorId(this.data.id)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x)
          this.ObtenerTipoCriteriosPorProgramaEspecifico(x.idTipoCriterioEvaluacion)
          var date=new Date(x.fechaEntrega)
          this.saveTarea.IdCriterioEvaluacion = x.idCriterioEvaluacion;
          var date2=new Date(x.fechaEntregaSecundaria)
          console.log(date2.getMinutes().toString())
          // this.saveTarea.IdCriterioEvaluacion = x.idCriterioEvaluacion;


          this.formularioTarea.get('Titulo')?.setValue(x.titulo)
          this.formularioTarea.get('Descripcion')?.setValue(x.descripcion)
          this.formularioTarea.get('CalificacionMaxima')?.setValue(x.calificacionMaxima)
          this.formularioTarea.get('FechaEntrega')?.setValue(date)
          this.formularioTarea.get('HoraEntrega')?.setValue(date.getHours().toString().length>1?date.getHours().toString():'0'+date.getHours().toString())
          this.formularioTarea.get('MinutoEntrega')?.setValue(date.getMinutes())
          if(x.fechaEntregaSecundaria!=null){
            var date2=new Date(x.fechaEntregaSecundaria)
            console.log(date2.getMinutes().toString())
            this.formularioTarea.get('FechaEntregaSecundaria')?.setValue(date2)
            this.formularioTarea.get('HoraEntregaSecundaria')?.setValue(date2.getHours().toString().length>1?date2.getHours().toString():'0'+date2.getHours().toString())
            this.formularioTarea.get('MinutoEntregaSecundaria')?.setValue(date2.getMinutes())
          }
          this.formularioTarea.get('CalificacionMaximaSecundaria')?.setValue(x.calificacionMaximaSecundaria)
          this.formularioTarea.get('IdCriterioEvaluacion')?.setValue(x.idCriterioEvaluacion)

          if(x.nombreArchivo!=null){
            this.nombrefile=x.nombreArchivo
            this.saveTarea.TieneArchivo=true
          }
          this.fecha=date
        },
        error: (x) => {},
      });
  }
  getFileDetails(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.filestatus = true;
      var name = event.target.files[i].name;
      this.nombrefile = name;
      var type = event.target.files[i].type;
      var size = event.target.files[i].size;
      var modifiedDate = event.target.files[i].lastModifiedDate;
      var extencion = name.split('.')[name.split('.').length - 1];
      if (Math.round(size / 1024 / 1024) > 15) {
        this.fileErrorMsg = 'El tamaño del archivo no debe superar los 15 MB';
        this.filestatus = false;
      }
      this.selectedFiles = event.target.files;
      // console.log ('Name: ' + name + "\n" +
      //   'Type: ' + extencion + "\n" +
      //   'Last-Modified-Date: ' + modifiedDate + "\n" +
      //   'Size: ' + Math.round((size/1024)/1024) + " MB");
    }
  }
  AgregarPEspecificoSesionTarea() {
    this.cargando=true
    var datePipe = new DatePipe('en-US');
    this.saveTarea.Titulo = this.formularioTarea.get('Titulo')?.value;
    this.saveTarea.Descripcion = this.formularioTarea.get('Descripcion')?.value;
    this.saveTarea.CalificacionMaxima = this.formularioTarea.get('CalificacionMaxima')?.value;
    this.saveTarea.CalificacionMaximaSecundaria = this.formularioTarea.get('CalificacionMaximaSecundaria')?.value;
    var fecha: Date = this.formularioTarea.get('FechaEntrega')?.value;
    this.saveTarea.IdCriterioEvaluacion = this.formularioTarea.get('IdCriterioEvaluacion')?.value;

    fecha.setHours(this.formularioTarea.get('HoraEntrega')?.value);
    fecha.setMinutes(this.formularioTarea.get('MinutoEntrega')?.value);
    fecha.setSeconds(0);
    if (fecha != null) {
      var s = datePipe.transform(fecha, 'yyyy-MM-ddTHH:mm:ss.SSS');
      this.saveTarea.FechaEntrega = s != null ? s : '';
    }

    fecha = this.formularioTarea.get('FechaEntregaSecundaria')?.value;
    if (fecha != null) {
      fecha.setHours(this.formularioTarea.get('HoraEntregaSecundaria')?.value);
      fecha.setMinutes(this.formularioTarea.get('MinutoEntregaSecundaria')?.value);
      var s = datePipe.transform(fecha, 'yyyy-MM-ddTHH:mm:ss.SSS');
      this.saveTarea.FechaEntregaSecundaria = s != null ? s : '';
    }
    console.log(this.saveTarea);
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.saveTarea.file = file;
        this.saveTarea.TieneArchivo=true
      }
    }
    if(this.saveTarea.Id==0){
      this.alertaService.mensajeConfirmacionRegistroTarea().then((result) => {
        if (result.isConfirmed) {
          this._PEspecificoEsquemaService
        .AgregarPEspecificoSesionTarea(this.saveTarea)
        .pipe(takeUntil(this.signal$))
        .subscribe({
          next: (x) => {
            console.log(x);
            if (x.type === HttpEventType.UploadProgress) {
              console.log(Math.round((100 * x.loaded) / x.total));
            } else if (x instanceof HttpResponse) {
              this._SnackBarServiceService.openSnackBar("La tarea se ha guardado correctamente.",
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
    else{
      this.alertaService.mensajeConfirmacionEdicionTarea().then((result) => {
        if (result.isConfirmed) {
          this._PEspecificoEsquemaService
        .AgregarPEspecificoSesionTarea(this.saveTarea)
        .pipe(takeUntil(this.signal$))
        .subscribe({
          next: (x) => {
            console.log(x);
            if (x.type === HttpEventType.UploadProgress) {
              console.log(Math.round((100 * x.loaded) / x.total));
            } else if (x instanceof HttpResponse) {
              this._SnackBarServiceService.openSnackBar("La tarea se ha guardado correctamente.",
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

  }
  ObtenerTipoCriteriosPorProgramaEspecifico(idTipoCriterioEvaluacion:number){
    this._PEspecificoEsquemaService.ObtenerTipoCriteriosPorProgramaEspecifico(this.data.idPEspecifico,idTipoCriterioEvaluacion).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        if(x!=null){
          this.esquemas=x;

        }
      },
    });
  }
}
