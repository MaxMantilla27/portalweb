import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgregarCuestionarioComponent } from '../agregar-cuestionario/agregar-cuestionario.component';
import { PEspecificoSesionActividadSaveDTO } from 'src/app/Core/Models/PEspecificoEsquema';
import { FormGroup, FormControl, Validators, NG_VALUE_ACCESSOR} from '@angular/forms';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';

@Component({
  selector: 'app-agregar-actividad-adicional',
  templateUrl: './agregar-actividad-adicional.component.html',
  styleUrls: ['./agregar-actividad-adicional.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgregarActividadAdicionalComponent implements OnInit, OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  constructor(
    public dialogRef: MatDialogRef<AgregarActividadAdicionalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _PEspecificoEsquemaService: PEspecificoEsquemaService,
    public _SnackBarServiceService: SnackBarServiceService,
    private alertaService: AlertaService,

  ) {}
  public saveActividad: PEspecificoSesionActividadSaveDTO = {
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
  };

  formularioActividad = new FormGroup({
    Titulo: new FormControl('', [Validators.required]),
    Descripcion: new FormControl(),
    CalificacionMaxima: new FormControl(100, [Validators.required]),
    FechaEntrega: new FormControl(this.data.fechaFinSesion, [Validators.required]),
    HoraEntrega: new FormControl('23', [Validators.required]),
    MinutoEntrega: new FormControl(59, [Validators.required]),
    IdCriterioEvaluacion: new FormControl(null, [Validators.required]),
  });
  public Title = 'AGREGAR ACTIVIDAD';
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
    for (let index = 0; index < 11; index++) {
      this.Calificaciones.push(index * 10);
    }
    this.saveActividad.IdPEspecificoSesion = this.data.sesion.idSesion;
    if (this.data.id != 0) {
      this.Title = 'EDITAR ACTIVIDAD';
      this.saveActividad.Id = this.data.id;
      this.ObtenerPEspecificoSesionActividadPorId()
    }
    else{
      this.ObtenerTipoCriteriosPorProgramaEspecifico(this.data.idTipoCriterioEvaluacion)
    }
  }
  ObtenerPEspecificoSesionActividadPorId() {
    this._PEspecificoEsquemaService
      .ObtenerPEspecificoSesionActividadPorId(this.data.id)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.ObtenerTipoCriteriosPorProgramaEspecifico(x.idTipoCriterioEvaluacion)
          var date=new Date(x.fechaEntrega)
          this.saveActividad.IdCriterioEvaluacion = x.idCriterioEvaluacion;

          this.formularioActividad.get('Titulo')?.setValue(x.titulo)
          this.formularioActividad.get('Descripcion')?.setValue(x.descripcion)
          this.formularioActividad.get('CalificacionMaxima')?.setValue(x.calificacionMaxima)
          this.formularioActividad.get('FechaEntrega')?.setValue(date)
          this.formularioActividad.get('HoraEntrega')?.setValue(date.getHours().toString().length>1?date.getHours().toString():'0'+date.getHours().toString())
          this.formularioActividad.get('MinutoEntrega')?.setValue(date.getMinutes())
          this.formularioActividad.get('IdCriterioEvaluacion')?.setValue(x.idCriterioEvaluacion)

          if(x.nombreArchivo!=null){
            this.nombrefile=x.nombreArchivo
            this.saveActividad.TieneArchivo=true
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
    }
  }
  AgregarPEspecificoSesionActividad() {
    this.cargando=true
    var datePipe = new DatePipe('en-US');
    this.saveActividad.Titulo = this.formularioActividad.get('Titulo')?.value;
    this.saveActividad.Descripcion = this.formularioActividad.get('Descripcion')?.value;
    this.saveActividad.CalificacionMaxima = this.formularioActividad.get('CalificacionMaxima')?.value;
    var fecha: Date = this.formularioActividad.get('FechaEntrega')?.value;
    this.saveActividad.IdCriterioEvaluacion = this.formularioActividad.get('IdCriterioEvaluacion')?.value;

    fecha.setHours(this.formularioActividad.get('HoraEntrega')?.value);
    fecha.setMinutes(this.formularioActividad.get('MinutoEntrega')?.value);
    fecha.setSeconds(0);
    if (fecha != null) {
      var s = datePipe.transform(fecha, 'yyyy-MM-ddTHH:mm:ss.SSS');
      this.saveActividad.FechaEntrega = s != null ? s : '';
    }
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.saveActividad.file = file;
        this.saveActividad.TieneArchivo=true
      }
    }
    if(this.saveActividad.Id==0){
      this.alertaService.mensajeConfirmacionRegistroActividad().then((result) => {
        if (result.isConfirmed) {
          this._PEspecificoEsquemaService
        .AgregarPEspecificoSesionActividad(this.saveActividad)
        .pipe(takeUntil(this.signal$))
        .subscribe({
          next: (x) => {
            if (x.type === HttpEventType.UploadProgress) {
              console.log(Math.round((100 * x.loaded) / x.total));
            } else if (x instanceof HttpResponse) {
              this._SnackBarServiceService.openSnackBar("La actividad se ha guardado correctamente.",
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
      this.alertaService.mensajeConfirmacionEdicionActividad().then((result) => {
        if (result.isConfirmed) {
          this._PEspecificoEsquemaService
        .AgregarPEspecificoSesionActividad(this.saveActividad)
        .pipe(takeUntil(this.signal$))
        .subscribe({
          next: (x) => {
            if (x.type === HttpEventType.UploadProgress) {
              console.log(Math.round((100 * x.loaded) / x.total));
            } else if (x instanceof HttpResponse) {
              this._SnackBarServiceService.openSnackBar("La actividad se ha guardado correctamente.",
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
        if(x!=null){
          this.esquemas=x;

        }
      },
    });
  }
}
