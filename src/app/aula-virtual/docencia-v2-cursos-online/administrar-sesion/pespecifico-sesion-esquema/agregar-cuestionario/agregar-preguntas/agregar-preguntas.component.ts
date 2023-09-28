import { Component, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PEspecificoSesionCuestionarioPreguntaFileDTO } from 'src/app/Core/Models/PEspecificoEsquema';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-agregar-preguntas',
  templateUrl: './agregar-preguntas.component.html',
  styleUrls: ['./agregar-preguntas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgregarPreguntasComponent implements OnInit ,OnChanges,OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }


  constructor(
    public dialogRef: MatDialogRef<AgregarPreguntasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _PEspecificoEsquemaService: PEspecificoEsquemaService,
    private _SnackBarServiceService:SnackBarServiceService
    ) { }
  public pregunta:PEspecificoSesionCuestionarioPreguntaFileDTO={
    Id:0,
    IdPreguntaTipo:0,
    Enunciado:'' ,
    Descripcion:'' ,
    Puntaje:0 ,
    NombreArchivo:'Seleccione Archivo'  ,
    UrlArchivoSubido:null ,
    Retroalimentacion:null ,
    NombreArchivoRetroalimentacion:'Seleccione Archivo' ,
    UrlArchivoSubidoRetroalimentacion:null ,
    file: new File([], ''),
    fileRetroalimentacion: new File([], ''),
    Alternativas :[]
  }

  public filestatus = false;
  public fileErrorMsg = '';
  public selectedFiles?: FileList;
  public Calificaciones: Array<any> = [];
  public filestatus2 = false;
  public fileErrorMsg2 = '';
  public selectedFiles2?: FileList;
  public Title="AGREGAR PREGUNTA"
  formularioTarea = new FormGroup({
    Enunciado: new FormControl('', [Validators.required]),
    Descripcion: new FormControl(''),
    IdPreguntaTipo: new FormControl(null, [Validators.required])
  });
  public tipoPregunta:Array<any>=[]
  public disabledAddPregunta=true;
  public IdTipoPreguntaAlternativa=0;
  ngOnInit(): void {

    for (let index = 1; index < 11; index++) {
      this.Calificaciones.push(index * 10);
    }
    console.log(this.data)
    this.tipoPregunta=this.data.tipoPregunta
    this.tipoPregunta.forEach((x:any) => {
      if(x.valor=='Ingresar palabra'){
        x.valor='Pregunta Abierta'
      }
    });
    if (this.data.pregunta != null) {
      this.Title = 'EDITAR PREGUNTA';
      this.pregunta = this.data.pregunta;
      this.formularioTarea.get('IdPreguntaTipo')?.setValue(this.pregunta.IdPreguntaTipo)
      this.formularioTarea.get('Enunciado')?.setValue(this.pregunta.Enunciado)
      this.formularioTarea.get('Descripcion')?.setValue(this.pregunta.Descripcion)
      this.formularioTarea.get('NombreArchivo')?.setValue(this.pregunta.NombreArchivo)
      this.formularioTarea.get('UrlArchivoSubido')?.setValue(this.pregunta.UrlArchivoSubido)
      this.formularioTarea.get('NombreArchivoRetroalimentacion')?.setValue(this.pregunta.NombreArchivoRetroalimentacion)
      this.formularioTarea.get('UrlArchivoSubidoRetroalimentacion')?.setValue(this.pregunta.UrlArchivoSubidoRetroalimentacion)
      if(this.pregunta!=null && this.pregunta.Id!=0){
        this.ObtenerPEspecificoSesionCuestionarioPreguntaAlternativaPorIdPregunta()
      }
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.formularioTarea.get('IdPreguntaTipo')?.value)
    if(this.formularioTarea.get('IdPreguntaTipo')?.value!=0)
    {
    console.log('XXXXXXXXXXXXXXXXXXX')

    }
    console.log('==================')
  }
  ObtenerPEspecificoSesionCuestionarioPreguntaAlternativaPorIdPregunta(){
    this._PEspecificoEsquemaService.ObtenerPEspecificoSesionCuestionarioPreguntaAlternativaPorIdPregunta(this.pregunta.Id).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x)
      },
      error: (x) => {},
    });
  }

  EliminarAlternatica(index:number){
    this.pregunta.Alternativas.splice(index,1)
  }
  AddAlternativa(){
    this.pregunta.Alternativas.push({
      Id:0,
      Alternativa:'',
      EsCorrecta:false,
      Puntaje:0,
      Disabled:false,
    })
  }
  getFileDetails2(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.filestatus2 = true;
      var name = event.target.files[i].name;
      this.pregunta.NombreArchivoRetroalimentacion = name;
      var size = event.target.files[i].size;
      if (Math.round(size / 1024 / 1024) > 15) {
        this.fileErrorMsg2 = 'El tamaño del archivo no debe superar los 15 MB';
        this.filestatus2 = false;
      }
      this.selectedFiles2 = event.target.files;
      // console.log ('Name: ' + name + "\n" +
      //   'Type: ' + extencion + "\n" +
      //   'Last-Modified-Date: ' + modifiedDate + "\n" +
      //   'Size: ' + Math.round((size/1024)/1024) + " MB");
    }
  }
  getFileDetails(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.filestatus = true;
      var name = event.target.files[i].name;
      this.pregunta.NombreArchivo = name;
      var size = event.target.files[i].size;
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
  AgregarPregunta(){
    this.pregunta.IdPreguntaTipo=this.formularioTarea.get('IdPreguntaTipo')?.value
    this.pregunta.Enunciado=this.formularioTarea.get('Enunciado')?.value
    this.pregunta.Descripcion=this.formularioTarea.get('Descripcion')?.value
    this.pregunta.Puntaje=0
    var vacias=0
    this.pregunta.Alternativas.forEach((a:any) => {
      this.pregunta.Puntaje+=a.Puntaje*1
      if(a.Alternativa.length==0){
        vacias++
      }
    });
    if(vacias>0){
      this._SnackBarServiceService.openSnackBar(
        "Debe ingresar el texto en todas las alternativas",
        'x',
        10,
        "snackbarCrucigramaerror");
      return false;
    }
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.pregunta.file = file;
      }
    }

    if (this.selectedFiles2) {
      const file: File | null = this.selectedFiles2.item(0);
      if (file) {
        this.pregunta.fileRetroalimentacion = file;
      }
    }
    this.dialogRef.close(this.pregunta)
    return true;
  }
  ChangeTipoPregunta(IdTipoPregunta:number){
    console.log(IdTipoPregunta)
    this.IdTipoPreguntaAlternativa=IdTipoPregunta,
    this.disabledAddPregunta=false;
    this.pregunta.Alternativas=[]
    if(IdTipoPregunta==3){
      this.pregunta.Alternativas.push({
        Id:0,
        Alternativa:'Verdadero',
        EsCorrecta:false,
        Puntaje:0,
        Disabled:true,
      })
      this.pregunta.Alternativas.push({
        Id:0,
        Alternativa:'Falso',
        EsCorrecta:false,
        Puntaje:0,
        Disabled:true,
      })
      this.disabledAddPregunta=true;
    }
    if(IdTipoPregunta==6){
      this.pregunta.Alternativas.push({
        Id:0,
        Alternativa:' ',
        EsCorrecta:true,
        Puntaje:0,
        Disabled:true,
      })
      this.disabledAddPregunta=true;
    }
  }
  ValidarLimiteSeleccionado(Correcto:any,Valor:any){
    console.log(Correcto)
    console.log(this.IdTipoPreguntaAlternativa)
    if(this.IdTipoPreguntaAlternativa==3 || this.IdTipoPreguntaAlternativa==5){
      let count=0
      this.pregunta.Alternativas.forEach((x:any) => {
        if(Correcto==true){
          if(count==Valor){
            x.EsCorrecta=true
          }
          else{
            x.EsCorrecta=false
          }
          x.Puntaje=0
        }
        else{
          x.EsCorrecta=false
        }
        count++
      });
    }
    // if(this.IdTipoPreguntaAlternativa==5){
    //   let count=0
    //   this.pregunta.Alternativas.forEach((x:any) => {
    //     if(count!=Valor){
    //       x.EsCorrecta=false
    //     }
    //     else{
    //       x.EsCorrecta=true
    //     }
    //     x.Puntaje=0
    //     count++
    //   });
    // }
    console.log(this.pregunta.Alternativas)
    // if(this.IdTipoPreguntaAlternativa==3){
    //   var count=0
    //   this.pregunta.Alternativas.forEach((x:any) => {
    //     if(count!=Valor){
    //       x.Correcto=false
    //     }
    //   });
    // }

  }
}
