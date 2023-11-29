import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PEspecificoCarreraTrabajoDTO } from 'src/app/Core/Models/PEspecificoCarreraTrabajoDTO';
import { PEspecificoCarreraTrabajoService } from 'src/app/Core/Shared/Services/PEspecificoCarreraTrabajo/pespecifico-carrera-trabajo.service';
import { AgregarTareaComponent } from 'src/app/aula-virtual/docencia-v2-cursos-online/administrar-sesion/pespecifico-sesion-esquema/agregar-tarea/agregar-tarea.component';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { AlertaService } from 'src/app/shared/services/alerta.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-modal-trabajo-aplicacion',
  templateUrl: './modal-trabajo-aplicacion.component.html',
  styleUrls: ['./modal-trabajo-aplicacion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalTrabajoAplicacionComponent implements OnInit, OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  constructor(
    public dialogRef: MatDialogRef<ModalTrabajoAplicacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _PEspecificoCarreraTrabajoService: PEspecificoCarreraTrabajoService,
    public _SnackBarServiceService: SnackBarServiceService,
    private alertaService: AlertaService
  ) {}
  public saveCarreraTrabajo: PEspecificoCarreraTrabajoDTO = {
    file: new File([], ''),
    IdPEspecifico: 0,
    Usuario: '',
    Id: 0,
    Titulo: '',
    Descripcion: '',
    CalificacionMaxima: 10,
    PlazoEntrega: 0,
    TieneArchivo: false,
  };
  formularioCarreraTrabajo = new FormGroup({
    Titulo: new FormControl('', [Validators.required]),
    Descripcion: new FormControl(),
    CalificacionMaxima: new FormControl(100, [Validators.required]),
    PlazoEntrega: new FormControl(90, [Validators.required]),
  });
  public Title = 'Agregar trabajo de aplicación profesional';
  public fecha = new Date();
  public nombrefile = 'Seleccione Archivo';
  public filestatus = false;
  public fileErrorMsg = '';
  public selectedFiles?: FileList;
  public Horas: Array<any> = [];
  public Minutos: Array<any> = [0, 30, 59];
  public Calificaciones: Array<any> = [];
  public cargando = false;
  public dias: Array<any> = [];
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
    this.saveCarreraTrabajo.IdPEspecifico = this.data.idPEspecifico;
    if (this.data.id != 0) {
      this.Title = 'Editar trabajo de aplicación profesional';
      this.saveCarreraTrabajo.Id = this.data.id;
      this.ObtenerPEspecificoCarreraTrabajoPorId();
    }
  }
  ObtenerPEspecificoCarreraTrabajoPorId() {
    this._PEspecificoCarreraTrabajoService
      .ObtenerPEspecificoCarreraTrabajoPorId(this.data.id)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          this.formularioCarreraTrabajo.get('Titulo')?.setValue(x.titulo);
          this.formularioCarreraTrabajo
            .get('Descripcion')
            ?.setValue(x.descripcion);
          this.formularioCarreraTrabajo
            .get('CalificacionMaxima')
            ?.setValue(x.calificacionMaxima);
          this.formularioCarreraTrabajo
            .get('CalificacionMaximaSecundaria')
            ?.setValue(x.calificacionMaximaSecundaria);
          this.formularioCarreraTrabajo
            .get('PlazoEntrega')
            ?.setValue(x.plazoEntrega);
          if (x.nombreArchivo != null) {
            this.nombrefile = x.nombreArchivo;
            this.saveCarreraTrabajo.TieneArchivo = true;
          }
        },
        error: (x) => {},
      });
  }
  EliminarArchivo() {
    this.nombrefile = 'Seleccione Archivo';
    this.selectedFiles = undefined;
    this.fileErrorMsg = '';
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
  AgregarPEspecificoCarreraTrabajo() {
    this.cargando = true;
    this.saveCarreraTrabajo.Titulo =
      this.formularioCarreraTrabajo.get('Titulo')?.value;
    this.saveCarreraTrabajo.Descripcion =
      this.formularioCarreraTrabajo.get('Descripcion')?.value;
    this.saveCarreraTrabajo.CalificacionMaxima =
      this.formularioCarreraTrabajo.get('CalificacionMaxima')?.value;
    this.saveCarreraTrabajo.PlazoEntrega =
      this.formularioCarreraTrabajo.get('PlazoEntrega')?.value;
    console.log(this.saveCarreraTrabajo);
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.saveCarreraTrabajo.file = file;
        this.saveCarreraTrabajo.TieneArchivo = true;
      }
    }
    this.alertaService
      .mensajeConfirmacionRegistro(
        'El trabajo no será visible hasta su publicación. ¿Desea continuar?',
        ''
      )
      .then((result) => {
        if (result.isConfirmed) {
          this._PEspecificoCarreraTrabajoService
            .AgregarPEspecificoCarreraTrabajo(this.saveCarreraTrabajo)
            .pipe(takeUntil(this.signal$))
            .subscribe({
              next: (x) => {
                console.log(x);
                if (x.type === HttpEventType.UploadProgress) {
                  console.log(Math.round((100 * x.loaded) / x.total));
                } else if (x instanceof HttpResponse) {
                  this._SnackBarServiceService.openSnackBar(
                    'El trabajo se ha guardado correctamente.',
                    'x',
                    10,
                    'snackbarCrucigramaSucces'
                  );
                  this.cargando = false;
                  this.dialogRef.close('guardado');
                }
              },
              error: (x) => {},
            });
        } else {
          this.dialogRef.close();
        }
      });
  }
}
