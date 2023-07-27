import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { PEspecificoSesionCuestionarioSaveDTO } from 'src/app/Core/Models/PEspecificoEsquema';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AgregarPreguntasComponent } from './agregar-preguntas/agregar-preguntas.component';

@Component({
  selector: 'app-agregar-cuestionario',
  templateUrl: './agregar-cuestionario.component.html',
  styleUrls: ['./agregar-cuestionario.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgregarCuestionarioComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  constructor(
    public dialogRef: MatDialogRef<AgregarCuestionarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _PEspecificoEsquemaService: PEspecificoEsquemaService,
    public dialog: MatDialog,
  ) {}
  public Title="AGREGAR CUESTIONARIO"
  public save:PEspecificoSesionCuestionarioSaveDTO={
    IdPEspecificoSesion: 0,
    Usuario: '',
    Id: 0,
    Titulo: '',
    Descripcion: '',
    CalificacionMaxima: 10,
    IdCriterioEvaluacion: 0,
    FechaEntrega: '',
    TiempoLimite:0,
    Preguntas:[]
  }
  formularioTarea = new FormGroup({
    Titulo: new FormControl('', [Validators.required]),
    Descripcion: new FormControl(),
    CalificacionMaxima: new FormControl(0, [Validators.required]),
    FechaEntrega: new FormControl(null, [Validators.required]),
    HoraEntrega: new FormControl(null, [Validators.required]),
    MinutoEntrega: new FormControl(null, [Validators.required]),
    TiempoLimite: new FormControl(null, [Validators.required]),
  });
  public fecha = new Date();
  public filestatus = false;
  public Horas: Array<any> = [];
  public Minutos: Array<any> = [];
  public Calificaciones: Array<any> = [];
  public tipoagregra=-1
  public tipoPregunta:Array<any>=[]
  ngOnInit(): void {
    for (let index = 0; index < 24; index++) {
      var hora = '' + index;
      if (index < 10) {
        hora = '0' + index;
      }
      this.Horas.push(hora.toString());
    }
    for (let index = 1; index < 60; index++) {
      var Minutos = '' + index;
      if (index < 10) {
        Minutos = '0' + index;
      }
      this.Minutos.push(Minutos.toString());
    }
    for (let index = 0; index < 11; index++) {
      this.Calificaciones.push(index * 10);
    }
    console.log(this.data);
    this.save.IdCriterioEvaluacion = this.data.idCriterio;
    this.save.IdPEspecificoSesion = this.data.sesion.idSesion;
    if (this.data.id != 0) {
      this.Title = 'EDITAR CUESTIONARIO';
      this.save.Id = this.data.id;
      this.ObtenerPEspecificoSesionCuestionarioPorId()
      this.ObtenerpreguntasSesionV2()
    }

    this.ObtenerPreguntaTipo()
  }

  ObtenerPreguntaTipo(){
    this._PEspecificoEsquemaService.ObtenerPreguntaTipo().pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        this.tipoPregunta=x
        console.log(x)
      },
      error: (x) => {},
    });
  }
  GettipoPregunta(id:number|null):string{
    var text=''
    for (let index = 0; index < this.tipoPregunta.length; index++) {
      if(this.tipoPregunta[index].id==id){
        text=this.tipoPregunta[index].valor
        break;
      }
    }
    return text
  }
  ObtenerPEspecificoSesionCuestionarioPorId(){
    this._PEspecificoEsquemaService.ObtenerPEspecificoSesionCuestionarioPorId(this.data.id).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x)
        var date=new Date(x.fechaEntrega)
        console.log(date)
        this.save.IdCriterioEvaluacion = x.idCriterioEvaluacion;

        this.formularioTarea.get('Titulo')?.setValue(x.titulo)
        this.formularioTarea.get('Descripcion')?.setValue(x.descripcion)
        this.formularioTarea.get('CalificacionMaxima')?.setValue(x.calificacionMaxima)
        this.formularioTarea.get('FechaEntrega')?.setValue(date)
        this.formularioTarea.get('HoraEntrega')?.setValue(date.getHours().toString().length>1?date.getHours().toString():'0'+date.getHours().toString())
        this.formularioTarea.get('MinutoEntrega')?.setValue(date.getMinutes().toString().length>1?date.getMinutes().toString():'0'+date.getMinutes().toString())
        this.formularioTarea.get('TiempoLimite')?.setValue(x.tiempoLimite)
      },
      error: (x) => {},
    });
  }
  ObtenerpreguntasSesionV2(){
    this._PEspecificoEsquemaService.ObtenerpreguntasSesionV2(this.data.id).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x)
        if(x!=null){
          x.forEach((p:any) => {
            this.save.Preguntas.push({
              Id:p.id,
              IdPreguntaTipo:p.idPreguntaTipo,
              Enunciado:p.enunciado ,
              Descripcion:p.descripcion,
              Puntaje:p.puntaje ,
              NombreArchivo:p.nombreArchivo  ,
              UrlArchivoSubido:p.urlArchivoSubido ,
              Retroalimentacion:p.retroalimentacion ,
              NombreArchivoRetroalimentacion:p.nombreArchivoRetroalimentacion ,
              UrlArchivoSubidoRetroalimentacion:p.urlArchivoSubidoRetroalimentacion ,
              file: new File([], ''),
              fileRetroalimentacion: new File([], ''),
              Alternativas :[]
            })
          });
        }
      },
      error: (x) => {},
    });
  }
  AgregarPEspecificoCuestionario() {
    var datePipe = new DatePipe('en-US');
    this.save.Titulo = this.formularioTarea.get('Titulo')?.value;
    this.save.Descripcion = this.formularioTarea.get('Descripcion')?.value;
    this.save.TiempoLimite = this.formularioTarea.get('TiempoLimite')?.value;
    this.save.CalificacionMaxima =
      this.formularioTarea.get('CalificacionMaxima')?.value;
    var fecha: Date = this.formularioTarea.get('FechaEntrega')?.value;
    fecha.setHours(this.formularioTarea.get('HoraEntrega')?.value);
    fecha.setMinutes(this.formularioTarea.get('MinutoEntrega')?.value);
    fecha.setSeconds(0);
    if (fecha != null) {
      var s = datePipe.transform(fecha, 'dd/MM/yyyy HH:mm:ss');
      this.save.FechaEntrega = s != null ? s : '';
    }
    console.log(this.save);
    this._PEspecificoEsquemaService
      .AgregarPEspecificoCuestionario(this.save)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          if (x.type === HttpEventType.UploadProgress) {
            console.log(Math.round((100 * x.loaded) / x.total));
          } else if (x instanceof HttpResponse) {
            this.dialogRef.close('guardado');
          }
        },
        error: (x) => {},
      });
  }
  OpenCrearPregunta(){
    const dialogRef = this.dialog.open(AgregarPreguntasComponent, {
      width: '1000px',
      data: {pregunta:null,sesion:this.data.sesion,tipoPregunta:this.tipoPregunta},
      panelClass: 'dialog-Agregar-Tarea',
     // disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result)
      if(result!=undefined && result!=''){
        this.save.Preguntas.push(result)
      }
    });
  }
  OpenEditar(i:number){
    var json=JSON.stringify(this.save.Preguntas[i])
    const dialogRef = this.dialog.open(AgregarPreguntasComponent, {
      width: '1000px',
      data: {pregunta:this.save.Preguntas[i],sesion:this.data.sesion,tipoPregunta:this.tipoPregunta},
      panelClass: 'dialog-Agregar-Tarea',
     // disableClose:true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.signal$)).subscribe((result) => {
      console.log(result)
      if(result!=undefined && result!=''){
       // this.save.Preguntas.push(result)
      }else{
        this.save.Preguntas[i]=JSON.parse(json)
      }
    });
  }
  Eliminar(i:number){

  }
}
