import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PEspecificoEsquemaService } from 'src/app/Core/Shared/Services/PEspecificoEsquema/pespecifico-esquema.service';
import * as moment from 'moment';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import {
  AgregarPEspecificoSesionCuestionarioAlumnoDTO,
  RespuestasCuestionarioDTO,
} from 'src/app/Core/Models/PEspecificoEsquema';
import { ImagenModalComponent } from 'src/app/Core/Shared/Containers/Dialog/imagen-modal/imagen-modal.component';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-envio-cuestionario',
  templateUrl: './envio-cuestionario.component.html',
  styleUrls: ['./envio-cuestionario.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EnvioCuestionarioComponent implements OnInit, OnDestroy {
  private signal$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<EnvioCuestionarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _SessionStorageService: SessionStorageService,
    private _PEspecificoEsquemaService: PEspecificoEsquemaService,
    public dialog: MatDialog,
    public _SnackBarServiceService: SnackBarServiceService
  ) {}

  public CuestionarioAvance: {
    Inicio: boolean;
    fechaInicio: Date;
    valores: Array<{ IdPregunta: number; valorRespues: Array<any> }>;
    id: number;
  } = { Inicio: false, fechaInicio: new Date(), valores: [], id: 0 };
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
    clearInterval(this.interval);
  }
  public interval: any;
  public minutos = 0;
  public segundos = 0;
  public vertiempo = false;
  public disableAll = false;
  public json: AgregarPEspecificoSesionCuestionarioAlumnoDTO = {
    IdMatriculaCabecera: 0,
    IdPEspecificoSesion: 0,
    IdPwPEspecificoSesionCuestionario: 0,
    Preguntas: [],
    Usuario: 'Alumno',
  };
  public CuestionarioValido = false;
  public PuntuacionActual = 0;
  public PuntuacionActualEnviada = 0;
  public dataguardada: any;
  public CuestionarioEnviado = false;
  public PuntajeInicial = 0;
  public BotonEnvioActivo = true;
  ngOnInit(): void {
    this.PuntuacionActual = this.data.cuestionario.calificacionActual;
    if (
      this.data.cuestionario != undefined &&
      this.data.cuestionario.preguntasCuestionario != undefined &&
      this.data.cuestionario.preguntasCuestionario != null
    ) {
      this.minutos = this.data.cuestionario.tiempoLimite;
      if (
        this.data.cuestionario.respuestaCuestionario != null &&
        this.data.cuestionario.respuestaCuestionario != undefined &&
        this.data.cuestionario.respuestaCuestionario.length > 0
      ) {
        this.dataguardada = [];
        this.dataguardada = this.data.cuestionario.respuestaCuestionario[0];
        this.PuntuacionActualEnviada =
          this.data.cuestionario.respuestaCuestionario[0].calificacionMaxima;
        this.CuestionarioEnviado = true;
        this.disableAll = true;
        this._SessionStorageService.SessionDeleteValue(
          'cuest-' + this.CuestionarioAvance.id.toString()
        );
        this.CuestionarioAvance.Inicio = true;
        var OrdenMostrar = 0;
        this.data.cuestionario.preguntasCuestionario.forEach((p: any) => {
          if (p.idPreguntaTipo == 11) {
            p.ordenMostrar = 0;
          } else {
            OrdenMostrar = OrdenMostrar + 1;
            p.ordenMostrar = OrdenMostrar;
          }
          p.respuesta = [];
          var vaRes: Array<any> = [];
          var vaCorr: Array<any> = [];
          var vaInCorr: Array<any> = [];
          var retroalimentacion = null;
          var nombreArchivoRetroalimentacion = null;
          var urlArchivoSubidoRetroalimentacion = null;
          this.dataguardada.respuestas.forEach((r: any) => {
            if (p.id == r.idPwPEspecificoSesionCuestionarioPregunta) {
              vaRes.push(r.valor);
              if (r.correcto == true) {
                vaCorr.push(r.valor);
              }
              if (r.correcto == false) {
                vaInCorr.push(r.valor);
              }
              if (p.idPreguntaTipo == 6) {
                this.PuntajeInicial = 0;
                this.PuntajeInicial = r.puntos;
                p.puntajePregunta = this.PuntajeInicial;
                retroalimentacion = r.retroalimentacion;
                nombreArchivoRetroalimentacion = r.nombreArchivo;
                urlArchivoSubidoRetroalimentacion = r.urlArchivoSubido;
              }
            }
          });
          if (p.idPreguntaTipo == 6) {
            p.respuesta = vaRes;
            p.retroalimentacion = retroalimentacion;
            p.nombreArchivoRetroalimentacion = nombreArchivoRetroalimentacion;
            p.urlArchivoSubidoRetroalimentacion =
              urlArchivoSubidoRetroalimentacion;
          } else {
            let respuestasMinimas = 0;
            this.PuntajeInicial = 0;
            p.alternativas.forEach((a: any) => {
              if (p.idPreguntaTipo == 4) {
                if (a.puntaje != 0) {
                  respuestasMinimas = respuestasMinimas + 1;
                }
              } else {
                respuestasMinimas = 1;
              }
              p.respuestasMinimas = respuestasMinimas;
              vaRes.forEach((vr: any) => {
                if (a.id == vr) {
                  a.select = true;
                  this.PuntajeInicial = this.PuntajeInicial + a.puntaje;
                }
              });
              vaCorr.forEach((vr: any) => {
                if (a.id == vr) {
                  a.Correcto = true;
                }
              });
              vaInCorr.forEach((vr: any) => {
                if (a.id == vr) {
                  a.Correcto = false;
                }
              });
            });
          }
          if (p.idPreguntaTipo != 6) {
            p.puntajePregunta = this.PuntajeInicial;
          }
        });
      } else {
        var OrdenMostrar = 0;
        this.data.cuestionario.preguntasCuestionario.forEach((p: any) => {
          if (p.idPreguntaTipo == 11) {
            p.ordenMostrar = 0;
          } else {
            OrdenMostrar = OrdenMostrar + 1;
            p.ordenMostrar = OrdenMostrar;
          }
          let respuestasMinimas = 0;
          p.alternativas.forEach((a: any) => {
            if (p.idPreguntaTipo == 4) {
              if (a.puntaje != 0) {
                respuestasMinimas = respuestasMinimas + 1;
              }
            } else {
              respuestasMinimas = 1;
            }
            p.respuestasMinimas = respuestasMinimas;
          });
          p.respuesta = [];
          if (p.idPreguntaTipo == 6) {
            p.respuesta.push('');
          }
          this.CuestionarioAvance.valores.push({
            IdPregunta: p.id,
            valorRespues: [],
          });
        });
        this.json.IdMatriculaCabecera = this.data.IdMatriculaCabecera;
        this.json.IdPEspecificoSesion =
          this.data.cuestionario.idPEspecificoSesion;
        this.json.IdPwPEspecificoSesionCuestionario = this.data.cuestionario.id;
        this.CuestionarioAvance.id = this.data.cuestionario.id;
        if (
          this._SessionStorageService.SessionGetValue(
            'cuest-' + this.CuestionarioAvance.id.toString()
          ) != ''
        ) {
          var cuest = JSON.parse(
            atob(
              this._SessionStorageService.SessionGetValue(
                'cuest-' + this.CuestionarioAvance.id.toString()
              )
            )
          );
          this.AddValoresActuales(cuest);
          if (this.CuestionarioAvance.Inicio == true) {
            this.vertiempo = true;
            this.cronometro();
          }
        }
      }
    }
  }
  getUrl(url: string) {
    return "url('" + url + "')";
  }
  OpenImage(url: string) {
    this.dialog.open(ImagenModalComponent, {
      width: '1000px',
      data: url,
      panelClass: 'dialog-Imagen-Modal',
    });
  }

  IniciarCuestionario() {
    this._PEspecificoEsquemaService
      .ObtenerEstadoDeFechasPorCuestionario(this.data.cuestionario.id)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          if (x == true) {
            this.CuestionarioAvance.Inicio = true;
            this.CuestionarioAvance.fechaInicio = new Date();
            this.vertiempo = true;

            this._SessionStorageService.SessionSetValue(
              'cuest-' + this.CuestionarioAvance.id.toString(),
              btoa(JSON.stringify(this.CuestionarioAvance))
            );
            this.cronometro();
          } else {
            this._SnackBarServiceService.openSnackBar(
              'Ya culmino el plazo para presentar este cuestionario.',
              'x',
              15,
              'snackbarCrucigramaerror'
            );
          }
        },
        error: (e) => {
          this._SnackBarServiceService.openSnackBar(
            'Ocurrio un error',
            'x',
            15,
            'snackbarCrucigramaerror'
          );
        },
      });
  }
  AddValoresActuales(cuest: any) {
    this.CuestionarioAvance.fechaInicio = cuest.fechaInicio;
    this.CuestionarioAvance.Inicio = cuest.Inicio;
    this.data.cuestionario.preguntasCuestionario.forEach((p: any) => {
      cuest.valores.forEach((av: any) => {
        if (av.IdPregunta == p.id) {
          if (p.idPreguntaTipo == 6) {
            p.respuesta = av.valorRespues;
          } else {
            p.alternativas.forEach((a: any) => {
              av.valorRespues.forEach((res: any) => {
                if (res == a.id) {
                  a.select = true;
                }
              });
            });
          }
        }
      });
    });
  }
  cronometro() {
    this.interval = setInterval(() => {
      var fecha1 = moment(this.CuestionarioAvance.fechaInicio);
      var fecha2 = moment(new Date());
      var segundoDif = fecha2.diff(fecha1, 'seconds');
      var totalSegundo = this.data.cuestionario.tiempoLimite * 60;

      if (segundoDif > totalSegundo) {
        this.vertiempo = false;
        clearInterval(this.interval);
        this.AgregarPEspecificoSesionCuestionarioAlumno(true);
      } else {
        this.minutos = Math.floor((totalSegundo - segundoDif) / 60);
        this.segundos = (totalSegundo - segundoDif) % 60;
      }
    }, 1000);
  }
  AgregarPEspecificoSesionCuestionarioAlumno(TiempoCumplido: boolean) {
    this.json.Preguntas = [];
    let Orden = 0;
    this.data.cuestionario.preguntasCuestionario.forEach((p: any) => {
      var respues: Array<RespuestasCuestionarioDTO> = [];
      if (p.idPreguntaTipo == 6) {
        if (
          p.respuesta != null &&
          p.respuesta != undefined &&
          p.respuesta.length > 0
        ) {
          respues.push({
            valor: p.respuesta[0],
          });
        }
      } else {
        p.alternativas.forEach((a: any) => {
          if (a.select == true) {
            respues.push({
              valor: a.id.toString(),
            });
          }
        });
      }
      if (respues.length == 0) {
        respues.push({
          valor: ' ',
        });
      }
      let validado = false;
      if (
        (p.idPreguntaTipo == 3 ||
          p.idPreguntaTipo == 4 ||
          p.idPreguntaTipo == 5) &&
        TiempoCumplido == false
      ) {
        respues.forEach((a: any) => {
          if (respues.length == p.respuestasMinimas && a.valor != ' ') {
            validado = true;
          }
        });
      } else {
        validado = true;
      }
      Orden = Orden + 1;
      this.json.Preguntas.push({
        IdPwPEspecificoSesionCuestionarioPregunta: p.id,
        Respuestas: respues,
        Validado: validado,
        Orden: Orden,
        RespuestasMinimas: p.respuestasMinimas,
      });
      this.CuestionarioValido = true;
      this.json.Preguntas.forEach((pre: any) => {
        if (pre.Validado == false) {
          this.CuestionarioValido = false;
        }
      });
    });
    if (this.CuestionarioValido == false) {
      this.json.Preguntas.reverse();
      this.json.Preguntas.forEach((pre: any) => {
        if (!pre.Validado) {
          const plural =
            pre.RespuestasMinimas === 1 ? 'alternativa' : 'alternativas';
          this._SnackBarServiceService.openSnackBar(
            `Selecciona ${pre.RespuestasMinimas} ${plural} en la pregunta N° ${pre.Orden}`,
            'x',
            5,
            'snackbarCrucigramaerror'
          );
        }
      });
    } else {
        this.BotonEnvioActivo=false
        this._PEspecificoEsquemaService.AgregarPEspecificoSesionCuestionarioAlumno(this.json).pipe(takeUntil(this.signal$))
        .subscribe({
        next: (x) => {
          this.dialogRef.close('guardado');
        },
        complete:()=>{
          this.BotonEnvioActivo=true
        }
      });
      this._SessionStorageService.SessionDeleteValue('cuest-'+this.CuestionarioAvance.id.toString())
    }
  }
  changeRadio(indexPregunta: number, index: number) {
    if (this.disableAll != true) {
      this.data.cuestionario.preguntasCuestionario[
        indexPregunta
      ].alternativas.forEach((a: any) => {
        a.select = false;
      });
      this.data.cuestionario.preguntasCuestionario[indexPregunta].alternativas[
        index
      ].select = true;
      this.AddToAvance();
    }
  }
  changeCheck(indexPregunta: number, index: number) {
    if (this.disableAll != true) {
      this.data.cuestionario.preguntasCuestionario[indexPregunta].alternativas[
        index
      ].select =
        !this.data.cuestionario.preguntasCuestionario[indexPregunta]
          .alternativas[index].select;
      this.AddToAvance();
    }
  }
  AddToAvance() {
    this.CuestionarioAvance.valores.forEach((av: any) => {
      av.valorRespues = [];
    });
    this.data.cuestionario.preguntasCuestionario.forEach((p: any) => {
      this.CuestionarioAvance.valores.forEach((av: any) => {
        if (av.IdPregunta == p.id) {
          if (p.idPreguntaTipo == 6) {
            av.valorRespues.push(p.respuesta[0]);
          } else {
            p.alternativas.forEach((a: any) => {
              if (a.select == true) {
                av.valorRespues.push(a.id);
              }
            });
          }
        }
      });
    });
    this._SessionStorageService.SessionSetValue(
      'cuest-' + this.CuestionarioAvance.id.toString(),
      btoa(JSON.stringify(this.CuestionarioAvance))
    );
  }
}
