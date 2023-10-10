import { HttpEventType, HttpResponse } from '@angular/common/http';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AgregarCalificacionCuestionarioAlumnoDocenteDTO } from 'src/app/Core/Models/PEspecificoEsquema';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-detalles-cuestionario',
  templateUrl: './detalles-cuestionario.component.html',
  styleUrls: ['./detalles-cuestionario.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetallesCuestionarioComponent implements OnInit, OnDestroy {
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }

  constructor(
    public dialogRef: MatDialogRef<DetallesCuestionarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _PEspecificoEsquemaService: PEspecificoEsquemaService,
    private _SnackBarServiceService: SnackBarServiceService
  ) {}
  public preguntas: any;
  public respuestas: any;
  public nota = 0;
  public fechacalificacion: any;
  public json: AgregarCalificacionCuestionarioAlumnoDocenteDTO = {
    IdPwPEspecificoSesionCuestionarioAlumno: 0,
    Respuestas: [],
    Usuario: 'docente',
  };
  cargando=false

  public nombrefile='Ningún archivo seleccionado'
  public selectedFiles?: FileList;
  ngOnInit(): void {
    console.log(this.data);
    this.nota = this.data.nota*1;
    this.ObtenerActividadesRecursoSesionAlumnoPorIds();
  }
  ObtenerActividadesRecursoSesionAlumnoPorIds() {
    this.cargando=true
    this._PEspecificoEsquemaService
      .ObtenerActividadesRecursoSesionAlumnoPorIds(
        this.data.idCuestionario,
        this.data.idMatriculaCabecera
      )
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x);
          this.preguntas = x.preguntas;
          this.respuestas = x.respuestas;
          if (this.respuestas != null && this.respuestas.length > 0) {
            this.fechacalificacion = this.respuestas[0].fechaCalificacion;
            this.json.IdPwPEspecificoSesionCuestionarioAlumno =this.respuestas[0].id;
            if(this.respuestas[0].calificacionMaxima==null){
              this.respuestas[0].calificacionMaxima=100
            }
            this.preguntas.forEach((p: any) => {
              p.selectedFilesPrev=new File([], '');
              this.respuestas[0].respuestas.forEach((r: any) => {
                if (r.idPwPEspecificoSesionCuestionarioPregunta == p.id) {
                  if (p.idPreguntaTipo == 6) {
                    p.respuesta = [r.id,r.valor];
                    p.retroalimentacion=r.retroalimentacion
                    p.nombreArchivo=r.nombreArchivo
                    p.urlArchivoSubido=r.urlArchivoSubido
                    var maxPuntos = 0;
                    p.alternativas.forEach((a: any) => {
                      maxPuntos = a.puntaje;
                      if (r.valor.toString() == a.id.toString()) {
                        a.Correcto = r.correcto;
                      }
                    });
                    maxPuntos=maxPuntos*this.respuestas[0].calificacionMaxima/100

                    p.data = [];
                    var plus=5
                    if(maxPuntos<10)plus=2;
                    for (let index = 0; index <= maxPuntos; index=index+plus) {
                      p.data.push(index);
                    }
                    if (maxPuntos%plus!=0){
                      p.data.push(maxPuntos)
                    }
                    // for (let index = 0; index < maxPuntos; index++) {
                    //   p.data.push(index + 1 );
                    // }
                    p.valueSelec = p.puntos;
                  } else {
                    p.alternativas.forEach((a: any) => {
                      if (r.valor.toString() == a.id.toString()) {
                        a.select = true;
                        a.Correcto = r.correcto;
                      }
                    });
                  }
                }
              });
            });
            this.preguntas.forEach((p: any) => {
              p.FinalCorecto = false;
              p.puntos = 0;
              if (p.idPreguntaTipo == 6) {
                this.respuestas[0].respuestas.forEach((r: any) => {
                  if (r.idPwPEspecificoSesionCuestionarioPregunta == p.id) {
                    p.puntos=r.puntos,
                    p.FinalCorecto = r.correcto;
                  }
                });
              } else {
                var conparacion = true;
                p.alternativas.forEach((a: any) => {
                  var corect = a.Correcto == undefined ? false : a.Correcto;
                  if (corect != a.esCorrecta) {
                    conparacion = false;
                  }
                });
                p.FinalCorecto = conparacion;
              }
              p.alternativas.forEach((a: any) => {
                if (a.Correcto == true) {
                  p.puntos += a.puntaje;
                }
              });
            });
          }
          this.preguntas.forEach((p:any) => {
           // p.puntos=p.puntos*this.respuestas[0].calificacionMaxima/100
            p.puntaje=p.puntaje*this.respuestas[0].calificacionMaxima/100
          });
          this.cargando=false
          console.log(this.preguntas);
        },
      });
  }
  SetNota(item: any) {
    console.log(item);
    this.nota = this.data.nota*1;

    this.preguntas.forEach((p: any) => {
      if (p.idPreguntaTipo == 6) {
        if (p.puntos != null) {
          this.nota+=p.puntos*1
        }
      }
    })
  }

  SetRetro(item:any){
    console.log(this.preguntas)
    console.log(item)
    this.preguntas.forEach((p:any) => {
      if(p.id==item.id){
        p.retroalimentacion=item.retroalimentacion
        p.editado=true
      }
    });
    console.log(this.preguntas)
  }

  getFileDetails(event:any,item:any) {
    for (var i = 0; i < event.target.files.length; i++) {
      var name = event.target.files[i].name;
      this.nombrefile=name;
      var type = event.target.files[i].type;
      var size = event.target.files[i].size;
      var modifiedDate = event.target.files[i].lastModifiedDate;
      var extencion=name.split('.')[name.split('.').length-1]
      if( Math.round((size/1024)/1024)>150){
        item.fileErrorMsg='El tamaño del archivo no debe superar los 25 MB'
      }
      this.selectedFiles = event.target.files;
      if (this.selectedFiles) {
        const file: File | null = this.selectedFiles.item(0);
        if (file) {
          item.selectedFilesPrev = file;
          item.filestatus=true
          item.nombreArchivo=this.nombrefile
        }
      }
      console.log(this.preguntas)
      // console.log ('Name: ' + name + "\n" +
      //   'Type: ' + extencion + "\n" +
      //   'Last-Modified-Date: ' + modifiedDate + "\n" +
      //   'Size: ' + Math.round((size/1024)/1024) + " MB");
    }
  }

  SetFile(item:any){
    console.log(this.preguntas)
    console.log(item)
    item.ArchivoAdjunto=true
    this.preguntas.forEach((p:any) => {
      if(p.id==item.id){
        p.selectedFiles=item.selectedFilesPrev
        p.ArchivoAdjunto=true
        p.editado=true
      }
    });
    this._SnackBarServiceService.openSnackBar("Se adjuntó el archivo",'x',15,"snackbarCrucigramaSucces");
  }
  AgregarCalificacionCuestionarioAlumnoDocente() {
    this.cargando=true
    var erro = 0;
    this.json.Respuestas = [];
    console.log(this.preguntas)
    this.preguntas.forEach((p: any) => {
      if (p.idPreguntaTipo == 6) {
        if (p.puntos != null) {
          var f:any=null
          if (p.selectedFiles) {
            const file: File | null = p.selectedFiles;
            if (file) {
              f = file;
            }
          }
          this.json.Respuestas.push({
            Id: p.respuesta[0],
            Puntos: p.puntos,
            Retroalimentacion:p.retroalimentacion,
            file:f,
            Correcto:
              p.data[p.data.length - 1].toString() == p.puntos.toString()
                ? true
                : false,
          });
        } else {
          erro++;
        }
      }
    });
    if (erro > 0) {
      this._SnackBarServiceService.openSnackBar(
        'Es necesario que califique todas las preguntas manuales',
        'x',
        10,
        'snackbarCrucigramaerror'
      );
      this.cargando=false
    } else {
      console.log(this.json)
      this._PEspecificoEsquemaService
        .AgregarCalificacionCuestionarioAlumnoDocente(this.json)
        .pipe(takeUntil(this.signal$))
        .subscribe({
          next: (x) => {
            console.log(x);
            if (x.type === HttpEventType.UploadProgress) {
              console.log(Math.round((100 * x.loaded) / x.total));
            } else if (x instanceof HttpResponse) {
              this._SnackBarServiceService.openSnackBar(
                'Se califico correctamente',
                'x',
                10,
                'snackbarCrucigramaSucces'
              );
              this.cargando=false
              this.dialogRef.close("guardado")
            }
          },
        });
    }
  }
}
