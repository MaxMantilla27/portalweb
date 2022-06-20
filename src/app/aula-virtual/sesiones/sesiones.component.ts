import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-sesiones',
  templateUrl: './sesiones.component.html',
  styleUrls: ['./sesiones.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SesionesComponent implements OnInit {
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _ProgramaContenidoService: ProgramaContenidoService,
    private _SessionStorageService: SessionStorageService
  ) {}

  tabLoadTimes: Date[] = [];
  public migaPan = [
    {
      titulo: 'Mis Cursos',
      urlWeb: '/AulaVirtual/MisCursos',
    },
  ];
  public tabIndex = 0;
  public idMatricula = 0;
  public idPEspecificoHijo = 0;
  public json: ParametrosEstructuraEspecificaDTO = {
    AccesoPrueba: false,
    IdMatriculaCabecera: 0,
    IdPEspecificoPadre: 0,
    IdPGeneralPadre: 0,
    IdPEspecificoHijo: 0,
    IdPGeneralHijo: 0,
    NombreCapitulo: '',
    NombrePrograma: '',
    idModalidad: 1,
  };
  public estructuraCapitulo: any = [];
  public idcapitulo = 0;
  public idSesion = 0;
  public tipo = 0;
  public nextCapter = { name: '', time: '' };
  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe({
      next: (x) => {
        this.idMatricula = parseInt(x['IdMatricula']);
        this.idPEspecificoHijo = x['idPEspecificoHijo'];
        this.idcapitulo = parseInt(x['IdCapitulo']);
        this.idSesion = parseInt(x['IdSesion']);
        this.tipo = parseInt(x['Tipo']);

        this.ObtenerListadoProgramaContenido();
      },
    });
  }

  siguiente(tipo: number, indexc: number, index: number, indexss: number) {
    console.log(index);
    console.log(indexss);
    var maxindexc =
      this.estructuraCapitulo.registroEstructuraCursoCapitulo.length - 1;
    if (tipo == 1) {
      if (indexss == -1) {
        var maxses =
          this.estructuraCapitulo.registroEstructuraCursoCapitulo[indexc]
            .registroEstructuraCursoSesion.length - 1;
        var encuestas = this.estructuraCapitulo.registroEstructuraCursoCapitulo[
          indexc
        ].registroEstructuraCursoEncuesta.filter(
          (x: any) => x.nombreEncuesta != 'Encuesta Inicial'
        ).length;
        if (
          maxses == index &&
          this.estructuraCapitulo.registroEstructuraCursoCapitulo[indexc]
            .registroCursoTareaCalificar.length == 0 &&
          this.estructuraCapitulo.registroEstructuraCursoCapitulo[indexc]
            .registroEstructuraCursoTarea.length == 0 &&
          encuestas == 0
        ) {
          this.tabIndex++;
        }
      } else {
        var maxses =
          this.estructuraCapitulo.registroEstructuraCursoCapitulo[indexc]
            .registroEstructuraCursoSesion.length - 1;
        var maxsubses =
          this.estructuraCapitulo.registroEstructuraCursoCapitulo[indexc]
            .registroEstructuraCursoSesion[index]
            .registroEstructuraCursoSubSesion.length - 1;
        console.log(maxsubses);
        if (maxsubses == indexss) {
          this.tabIndex++;
          var encuestas =
            this.estructuraCapitulo.registroEstructuraCursoCapitulo[
              indexc
            ].registroEstructuraCursoEncuesta.filter(
              (x: any) => x.nombreEncuesta != 'Encuesta Inicial'
            ).length;
          if (
            maxses == index &&
            this.estructuraCapitulo.registroEstructuraCursoCapitulo[indexc]
              .registroCursoTareaCalificar.length == 0 &&
            this.estructuraCapitulo.registroEstructuraCursoCapitulo[indexc]
              .registroEstructuraCursoTarea.length == 0 &&
            encuestas == 0
          ) {
            this.tabIndex++;
          }
        }
      }
    }
    if (tipo == 2) {
      var maxtar =
        this.estructuraCapitulo.registroEstructuraCursoCapitulo[indexc]
          .registroEstructuraCursoTarea.length - 1;

      if (
        this.estructuraCapitulo.registroEstructuraCursoCapitulo[indexc]
          .registroCursoTareaCalificar.length == 0 &&
        this.estructuraCapitulo.registroEstructuraCursoCapitulo[indexc]
          .registroEstructuraCursoEncuesta.length == 0 &&
        maxtar == index &&
        maxindexc > indexc
      ) {
        this.tabIndex++;
        if (this.estructuraCapitulo.contineSubSesion == true) {
          this.tabIndex++;
        }
      }
    }
    if (tipo == 3) {
      var name =
        this.estructuraCapitulo.registroEstructuraCursoCapitulo[indexc]
          .registroEstructuraCursoEncuesta[index].nombreEncuesta;
      var maxenc =
        this.estructuraCapitulo.registroEstructuraCursoCapitulo[indexc]
          .registroEstructuraCursoEncuesta.length - 1;
      console.log(name);
      if (name == 'Encuesta Inicial') {
        if (this.estructuraCapitulo.contineSubSesion == true) {
          this.tabIndex++;
        }
      }
    }
    if (tipo == 4) {
      var maxtarC =
        this.estructuraCapitulo.registroEstructuraCursoCapitulo[indexc]
          .registroCursoTareaCalificar.length - 1;
      if (
        this.estructuraCapitulo.registroEstructuraCursoCapitulo[indexc]
          .registroEstructuraCursoEncuesta.length == 0 &&
        maxtarC == index &&
        maxindexc > indexc
      ) {
        this.tabIndex++;
        if (this.estructuraCapitulo.contineSubSesion == true) {
          this.tabIndex++;
        }
      }
    }
    this.tabIndex++;
    this.GetvalueByIndex();
  }
  anterior(tipo: number, indexc: number, index: number, indexss: number) {
    this.tabIndex--;
    console.log(tipo + '-' + index + '-' + indexss);
    if (tipo == 1) {
      if (indexss == -1) {
        if (index == 0) {
          if (indexc == 0) {
            if (
              this.estructuraCapitulo.registroEstructuraCursoCapitulo[indexc]
                .registroEstructuraCursoEncuesta.length == 0
            ) {
              this.tabIndex++;
            }
          } else {
            this.tabIndex--;
          }
        }
      } else {
        if (indexss == 0) {
          this.tabIndex--;
          if (index == 0) {
            if (indexc == 0) {
              if (
                this.estructuraCapitulo.registroEstructuraCursoCapitulo[indexc]
                  .registroEstructuraCursoEncuesta.length == 0
              ) {
                this.tabIndex += 2;
              } else {
              }
            } else {
              this.tabIndex--;
            }
          }
        }
      }
    }
    this.GetvalueByIndex();
  }
  GetvalueByIndex() {
    var ndx = 0;
    this.estructuraCapitulo.registroEstructuraCursoCapitulo.forEach(
      (c: any) => {
        c.opened = false;
        c.registroEstructuraCursoEncuesta.forEach((e: any) => {
          if (e.nombreEncuesta == 'Encuesta Inicial') {
            ndx++;
            if (ndx == this.tabIndex) {
              e.charge = true;
              c.opened = true;
              console.log(c.opened);
            }
          }
        });
        c.registroEstructuraCursoSesion.forEach((s: any) => {
          ndx++;
          if (this.estructuraCapitulo.contineSubSesion == true) {
            s.opened = false;
            s.registroEstructuraCursoSubSesion.forEach((ss: any) => {
              ndx++;
              if (ndx == this.tabIndex) {
                ss.charge = true;
                s.opened = true;
                c.opened = true;
              }
            });
          } else {
            if (ndx == this.tabIndex) {
              s.charge = true;
              c.opened = true;
            }
          }
        });
        c.registroEstructuraCursoTarea.forEach((t: any) => {
          ndx++;
          if (ndx == this.tabIndex) {
            t.charge = true;
            c.opened = true;
          }
        });
        c.registroCursoTareaCalificar.forEach((tc: any) => {
          ndx++;
          if (ndx == this.tabIndex) {
            tc.charge = true;
            c.opened = true;
          }
        });
        c.registroEstructuraCursoEncuesta.forEach((e: any) => {
          ndx++;
          if (ndx == this.tabIndex) {
            e.charge = true;
            c.opened = true;
          }
        });
        ndx++;
      }
    );
    console.log(this.estructuraCapitulo.registroEstructuraCursoCapitulo);
  }
  migapanbase() {
    this.migaPan = [
      {
        titulo: 'Mis Cursos',
        urlWeb: '/AulaVirtual/MisCursos',
      },
      {
        titulo: this.json.NombrePrograma,
        urlWeb: '/AulaVirtual/MisCursos/' + this.json.IdMatriculaCabecera,
      },
      {
        titulo: this.json.NombreCapitulo,
        urlWeb:
          '/AulaVirtual/MisCursos/' +
          this.json.IdMatriculaCabecera +
          '/' +
          this.idPEspecificoHijo,
      },
    ];
  }
  ObtenerEstructuraEspecificaCurso() {
    this._ProgramaContenidoService
      .ObtenerEstructuraEspecificaCurso(this.json)
      .subscribe({
        next: (x) => {
          console.log(x);
          this.estructuraCapitulo = x;
          this.ValidateEstadoVideo();
          this.OrdenarEstructura();
        },
      });
  }
  ValidateEstadoVideo() {
    if (this.estructuraCapitulo != undefined) {
      if (this.estructuraCapitulo.contineSubSesion == true) {
        this.estructuraCapitulo.registroEstructuraCursoCapitulo.forEach(
          (c: any) => {
            c.registroEstructuraCursoSesion.forEach((s: any) => {
              s.registroEstructuraCursoSubSesion.forEach((ss: any) => {
                ss.VideoFinish = false;
                if (Math.ceil(ss.porcentajeVideoVisualizado) >= 100) {
                  ss.VideoFinish = true;
                }
              });
            });
          }
        );
      } else {
        this.estructuraCapitulo.registroEstructuraCursoCapitulo.forEach(
          (c: any) => {
            c.registroEstructuraCursoSesion.forEach((s: any) => {
              s.VideoFinish = false;
              if (Math.ceil(s.porcentajeVideoVisualizado) >= 100) {
                s.VideoFinish = true;
              }
            });
          }
        );
      }
      this.validateNextVIdeo();
      this.GetNextChapter();
    }
  }
  GetNextChapter() {
    var cap = 0,
      ses = 0,
      subs = 0,
      enc = 0,
      tar = 0,
      tarC = 0;

    this.estructuraCapitulo.registroEstructuraCursoCapitulo.forEach(
      (c: any) => {
        var lastCap=this.estructuraCapitulo.registroEstructuraCursoCapitulo
        c.registroEstructuraCursoSesion.forEach((s: any) => {
          var lastSes=c.registroEstructuraCursoSesion.length-1;
          if (this.estructuraCapitulo.contineSubSesion == true) {
            s.registroEstructuraCursoSubSesion.forEach((ss: any) => {
              var lastSub=s.registroEstructuraCursoSubSesion.length-1
              if(subs==lastSub){
                if(ses=lastSes){
                  var next=true
                  if(c.registroEstructuraCursoTarea.length>0){
                    next=false;
                    ss.nextChapter={
                      name:c.registroEstructuraCursoTarea[0].tarea,
                      time:null
                    }
                  }else{
                    next=true
                  }
                  if(next==true){
                    if(c.registroCursoTareaCalificar.length>0){
                      next=false;
                      ss.nextChapter={
                        name:c.registroEstructuraCursoTarea[0].tarea,
                        time:null
                      }
                    }else{
                      next=true
                    }
                  }
                  if(next==true){
                    var encuestas = c.registroEstructuraCursoEncuesta.filter((x: any) => x.nombreEncuesta != 'Encuesta Inicial');
                    if(encuestas.length>0){
                      next=false;
                      ss.nextChapter={
                        name:encuestas[0].nombreEncuesta,
                        time:null
                      }
                    }else{
                      next=true
                    }
                  }
                  if(next==true){
                    if(cap==lastCap){
                      ss.nextChapter={
                        name:null,
                        time:null
                      }
                    }else{
                      ss.nextChapter={
                        name:this.estructuraCapitulo
                                .registroEstructuraCursoCapitulo[cap+1]
                                .registroEstructuraCursoSesion[0]
                                .registroEstructuraCursoSubSesion[0]
                                .nombreSubSesion,
                        time:Math.ceil(this.estructuraCapitulo
                                      .registroEstructuraCursoCapitulo[cap+1]
                                      .registroEstructuraCursoSesion[0]
                                      .registroEstructuraCursoSubSesion[0]
                                      .tiempoVideo/60)
                      }
                    }
                  }
                }else{
                  ss.nextChapter={
                    name:c.registroEstructuraCursoSesion[s+1].registroEstructuraCursoSubSesion[0].nombreSubSesion,
                    time:Math.ceil(c.registroEstructuraCursoSesion[s+1].registroEstructuraCursoSubSesion[0].tiempoVideo/60)
                  }
                }
              }else{
                ss.nextChapter={
                  name:s.registroEstructuraCursoSubSesion[subs+1].nombreSubSesion,
                  time:Math.ceil(s.registroEstructuraCursoSubSesion[subs+1].tiempoVideo/60)
                }
              }
              subs++
            })
          }else{
            if(lastSes==ses){
              var next=true
              if(c.registroEstructuraCursoTarea.length>0){
                next=false;
                s.nextChapter={
                  name:c.registroEstructuraCursoTarea[0].tarea,
                  time:null
                }
              }else{
                next=true
              }
              if(next==true){
                if(c.registroCursoTareaCalificar.length>0){
                  next=false;
                  s.nextChapter={
                    name:c.registroEstructuraCursoTarea[0].tarea,
                    time:null
                  }
                }else{
                  next=true
                }
              }
              if(next==true){
                var encuestas = c.registroEstructuraCursoEncuesta.filter((x: any) => x.nombreEncuesta != 'Encuesta Inicial');
                if(encuestas.length>0){
                  next=false;
                  s.nextChapter={
                    name:encuestas[0].nombreEncuesta,
                    time:null
                  }
                }else{
                  next=true
                }
              }
              if(next==true){
                if(cap==lastCap){
                  s.nextChapter={
                    name:null,
                    time:null
                  }
                }else{
                  s.nextChapter={
                    name:this.estructuraCapitulo
                            .registroEstructuraCursoCapitulo[cap+1]
                            .registroEstructuraCursoSesion[0]
                            .nombreSubSesion,
                    time:Math.ceil(this.estructuraCapitulo
                                  .registroEstructuraCursoCapitulo[cap+1]
                                  .registroEstructuraCursoSesion[0]
                                  .tiempoVideo/60)
                  }
                }
              }
            }else{
              s.nextChapter={
                name:c.registroEstructuraCursoSesion[ses+1].nombreSubSesion,
                time:Math.ceil(c.registroEstructuraCursoSesion[ses+1].tiempoVideo/60)
              }
            }
          }
          subs=0;
          ses++
        });
        ses=0;
        cap++;
      }
    );
  }
  validateNextVIdeo() {
    var cap = 0,
      ses = 0,
      subs = 0,
      enc = 0,
      tar = 0,
      tarC = 0;

    this.estructuraCapitulo.registroEstructuraCursoCapitulo.forEach(
      (c: any) => {
        c.registroEstructuraCursoSesion.forEach((s: any) => {
          if (this.estructuraCapitulo.contineSubSesion == true) {
            s.subV = 0;
            s.registroEstructuraCursoSubSesion.forEach((ss: any) => {
              ss.habilitado = false;
              if (Math.ceil(ss.porcentajeVideoVisualizado) >= 100) {
                s.subV++;
              }

              if (subs == 0) {
                if (ses == 0) {
                  if (cap == 0) {
                    c.registroEstructuraCursoEncuesta.forEach((e: any) => {
                      if (e.nombreEncuesta == 'Encuesta Inicial') {
                        if (e.encuestaEnviada == true) {
                          ss.habilitado = true;
                        }
                      }
                    });

                    if (c.registroEstructuraCursoEncuesta.length == 0) {
                      ss.habilitado = true;
                    }
                  } else {
                    var lastses =
                      this.estructuraCapitulo.registroEstructuraCursoCapitulo[
                        cap - 1
                      ].registroEstructuraCursoSesion.length - 1;
                    var lastsub =
                      this.estructuraCapitulo.registroEstructuraCursoCapitulo[
                        cap - 1
                      ].registroEstructuraCursoSesion[lastses]
                        .registroEstructuraCursoSubSesion.length - 1;
                    if (
                      Math.ceil(
                        this.estructuraCapitulo.registroEstructuraCursoCapitulo[
                          cap - 1
                        ].registroEstructuraCursoSesion[lastses]
                          .registroEstructuraCursoSubSesion[lastsub]
                          .porcentajeVideoVisualizado
                      ) >= 100
                    ) {
                      if (c.registroEstructuraCursoEncuesta.length > 0) {
                        c.registroEstructuraCursoEncuesta.forEach((e: any) => {
                          if (e.nombreEncuesta != 'Encuesta Inicial') {
                            if (e.encuestaEnviada != true) {
                              ss.habilitado = false;
                            }
                          }
                        });
                      } else {
                        ss.habilitado = true;
                      }
                      if (ss.habilitado == true) {
                        if (c.registroEstructuraCursoTarea.length > 0) {
                          c.registroEstructuraCursoTarea.forEach((t: any) => {
                            if (t.tareasEnviadas == 0) {
                              ss.habilitado = false;
                            }
                          });
                        } else {
                          ss.habilitado = true;
                        }
                      }
                      if (s.habilitado == true) {
                        if (c.registroCursoTareaCalificar.length > 0) {
                          c.registroCursoTareaCalificar.forEach((tc: any) => {
                            if (!tc.calificado) {
                              ss.habilitado = false;
                            }
                          });
                        } else {
                          ss.habilitado = true;
                        }
                      }
                    }
                  }
                } else {
                  var lastsub =
                    c.registroEstructuraCursoSesion[ses - 1]
                      .registroEstructuraCursoSubSesion.length - 1;
                  if (
                    Math.ceil(
                      c.registroEstructuraCursoSesion[ses - 1]
                        .registroEstructuraCursoSubSesion[lastsub]
                        .porcentajeVideoVisualizado
                    ) >= 100
                  ) {
                    ss.habilitado = true;
                  }
                }
              } else {
                if (
                  Math.ceil(
                    s.registroEstructuraCursoSubSesion[subs - 1]
                      .porcentajeVideoVisualizado
                  ) >= 100
                ) {
                  ss.habilitado = true;
                }
              }
              subs++;
            });
            subs = 0;
          } else {
            s.habilitado = false;
            if (ses == 0) {
              if (cap == 0) {
                c.registroEstructuraCursoEncuesta.forEach((e: any) => {
                  if (e.nombreEncuesta == 'Encuesta Inicial') {
                    if (e.encuestaEnviada == true) {
                      s.habilitado = true;
                    }
                  }
                });

                if (c.registroEstructuraCursoEncuesta.length == 0) {
                  s.habilitado = true;
                }
              } else {
                var latcap =
                  this.estructuraCapitulo.registroEstructuraCursoCapitulo[
                    cap - 1
                  ].registroEstructuraCursoSesion.length - 1;
                if (
                  Math.ceil(
                    this.estructuraCapitulo.registroEstructuraCursoCapitulo[
                      cap - 1
                    ].registroEstructuraCursoSesion[latcap]
                      .porcentajeVideoVisualizado
                  ) >= 100
                ) {
                  if (
                    c.registroCursoTareaCalificar.length > 0 ||
                    c.registroEstructuraCursoEncuesta.length > 0 ||
                    c.registroEstructuraCursoTarea.length > 0
                  ) {
                    var habilitar = false;
                    if (c.registroEstructuraCursoEncuesta.length > 0) {
                      c.registroEstructuraCursoEncuesta.forEach((e: any) => {
                        if (e.nombreEncuesta != 'Encuesta Inicial') {
                          if (e.encuestaEnviada != true) {
                            s.habilitado = false;
                          }
                        }
                      });
                    } else {
                      s.habilitado = true;
                    }
                    if (s.habilitado == true) {
                      if (c.registroEstructuraCursoTarea.length > 0) {
                        c.registroEstructuraCursoTarea.forEach((t: any) => {
                          if (t.tareasEnviadas == 0) {
                            s.habilitado = false;
                          }
                        });
                      } else {
                        s.habilitado = true;
                      }
                    }
                    if (s.habilitado == true) {
                      if (c.registroCursoTareaCalificar.length > 0) {
                        c.registroCursoTareaCalificar.forEach((tc: any) => {
                          if (!tc.calificado) {
                            s.habilitado = false;
                          }
                        });
                      } else {
                        s.habilitado = true;
                      }
                    }
                  } else {
                    s.habilitado = true;
                  }
                }
              }
            } else {
              if (
                Math.ceil(
                  c.registroEstructuraCursoSesion[ses - 1]
                    .porcentajeVideoVisualizado
                ) >= 100
              ) {
                s.habilitado = true;
              }
            }
          }
          ses++;
        });
        ses = 0;
        var lastses = c.registroEstructuraCursoSesion.length - 1;
        c.registroEstructuraCursoEncuesta.forEach((e: any) => {
          e.habilitado = false;
          if (e.nombreEncuesta != 'Encuesta Inicial') {
            if (enc > 0) {
              if (
                Math.ceil(
                  c.registroEstructuraCursoEncuesta[enc - 1]
                    .porcentajeVideoVisualizado
                ) >= 100
              ) {
                e.habilitado = true;
              }
            } else {
              if (this.estructuraCapitulo.contineSubSesion == true) {
                var lastSubses =
                  c.registroEstructuraCursoSesion[lastses]
                    .registroEstructuraCursoSubSesion.length - 1;
                if (
                  Math.ceil(
                    c.registroEstructuraCursoSesion[lastses]
                      .registroEstructuraCursoSubSesion[lastSubses]
                      .porcentajeVideoVisualizado
                  ) >= 100
                ) {
                  e.habilitado = true;
                }
              } else {
                if (
                  Math.ceil(
                    c.registroEstructuraCursoSesion[lastses]
                      .porcentajeVideoVisualizado
                  ) >= 100
                ) {
                  e.habilitado = true;
                }
              }
            }

            enc++;
          }
        });
        enc = 0;
        c.registroEstructuraCursoTarea.forEach((t: any) => {
          t.habilitado = false;
          if (tar > 0) {
            if (
              Math.ceil(
                c.registroEstructuraCursoTarea[tar - 1]
                  .porcentajeVideoVisualizado
              ) >= 100
            ) {
              t.habilitado = true;
            }
          } else {
            if (this.estructuraCapitulo.contineSubSesion == true) {
              var lastSubses =
                c.registroEstructuraCursoSesion[lastses]
                  .registroEstructuraCursoSubSesion.length - 1;
              if (
                Math.ceil(
                  c.registroEstructuraCursoSesion[lastses]
                    .registroEstructuraCursoSubSesion[lastSubses]
                    .porcentajeVideoVisualizado
                ) >= 100
              ) {
                t.habilitado = true;
              }
            } else {
              if (
                Math.ceil(
                  c.registroEstructuraCursoSesion[lastses]
                    .porcentajeVideoVisualizado
                ) >= 100
              ) {
                t.habilitado = true;
              }
            }
          }
          tar++;
        });
        tar = 0;
        c.registroCursoTareaCalificar.forEach((t: any) => {
          t.habilitado = false;
          if (tarC > 0) {
            if (
              Math.ceil(
                c.registroCursoTareaCalificar[tarC - 1]
                  .porcentajeVideoVisualizado
              ) >= 100
            ) {
              t.habilitado = true;
            }
          } else {
            if (this.estructuraCapitulo.contineSubSesion == true) {
              var lastSubses =
                c.registroEstructuraCursoSesion[lastses]
                  .registroEstructuraCursoSubSesion.length - 1;
              if (
                Math.ceil(
                  c.registroEstructuraCursoSesion[lastses]
                    .registroEstructuraCursoSubSesion[lastSubses]
                    .porcentajeVideoVisualizado
                ) >= 100
              ) {
                t.habilitado = true;
              }
            } else {
              if (
                Math.ceil(
                  c.registroEstructuraCursoSesion[lastses]
                    .porcentajeVideoVisualizado
                ) >= 100
              ) {
                t.habilitado = true;
              }
            }
          }
          tarC++;
        });
        tarC = 0;
        cap++;
      }
    );
    console.log(this.estructuraCapitulo);
  }
  ObtenerListadoProgramaContenido() {
    this._ProgramaContenidoService
      .ObtenerListadoProgramaContenido(this.idMatricula)
      .subscribe({
        next: (x) => {
          console.log(x);

          x.listaCursoMatriculado.forEach((program: any) => {
            if (this.idPEspecificoHijo == program.idPEspecificoHijo) {
              this.json = {
                AccesoPrueba: false,
                IdMatriculaCabecera: x.idMatriculaCabecera,
                IdPEspecificoPadre: x.idPEspecifico,
                IdPGeneralPadre: x.idPGeneral,
                IdPEspecificoHijo: program.idPEspecificoHijo,
                IdPGeneralHijo: program.idPGeneralHijo,
                NombreCapitulo: program.programaGeneralHijo,
                NombrePrograma: x.programaGeneral,
                idModalidad: x.idModalidad,
              };

              this.migapanbase();
              this.estructuraCapitulo =
                this._SessionStorageService.getEstructura();
              console.log(this.estructuraCapitulo);
              if (this.estructuraCapitulo == null) {
                this.ObtenerEstructuraEspecificaCurso();
              } else {
                this.ValidateEstadoVideo();
                this.OrdenarEstructura();
                this._SessionStorageService.DeleteEstructura();
              }
            }
          });
        },
      });
  }
  changeTab(
    tipo: number,
    sesion: number,
    index: number,
    indexSesion: number,
    indexSubsesion: number
  ) {
    this.tipo = tipo;
    this.idSesion = sesion;
    if (tipo == 1) {
      if (indexSubsesion == -1) {
        this.estructuraCapitulo.registroEstructuraCursoCapitulo[
          index
        ].registroEstructuraCursoSesion[indexSesion].charge = true;
      } else {
        this.estructuraCapitulo.registroEstructuraCursoCapitulo[
          index
        ].registroEstructuraCursoSesion[
          indexSesion
        ].registroEstructuraCursoSubSesion[indexSubsesion].charge = true;
      }
    }
    if (tipo == 2) {
      this.estructuraCapitulo.registroEstructuraCursoCapitulo[
        index
      ].registroEstructuraCursoTarea[indexSesion].charge = true;
    }
    if (tipo == 3) {
      this.estructuraCapitulo.registroEstructuraCursoCapitulo[
        index
      ].registroEstructuraCursoEncuesta[indexSesion].charge = true;
    }
    if (tipo == 4) {
      this.estructuraCapitulo.registroEstructuraCursoCapitulo[
        index
      ].registroCursoTareaCalificar[indexSesion].charge = true;
    }
  }
  changeSesion(index: number, sesionIndex: number) {
    if (
      this.estructuraCapitulo.registroEstructuraCursoCapitulo[index]
        .registroEstructuraCursoSesion[sesionIndex].opened == false
    ) {
      this.estructuraCapitulo.registroEstructuraCursoCapitulo[
        index
      ].registroEstructuraCursoSesion.forEach((ses: any) => {
        ses.opened = false;
      });
    }
    this.estructuraCapitulo.registroEstructuraCursoCapitulo[
      index
    ].registroEstructuraCursoSesion[sesionIndex].opened =
      !this.estructuraCapitulo.registroEstructuraCursoCapitulo[index]
        .registroEstructuraCursoSesion[sesionIndex].opened;
  }
  changeCapitulo(index: number) {
    //this.tabIndex=index;
    if (
      this.estructuraCapitulo.registroEstructuraCursoCapitulo[index].opened ==
      false
    ) {
      this.estructuraCapitulo.registroEstructuraCursoCapitulo.forEach(
        (cap: any) => {
          cap.opened = false;
        }
      );
    }

    this.migapanbase();
    this.migaPan.push({
      titulo:
        'Capitulo ' +
        this.estructuraCapitulo.registroEstructuraCursoCapitulo[index]
          .numeroCapitulo +
        ': ' +
        this.estructuraCapitulo.registroEstructuraCursoCapitulo[index]
          .nombreCapitulo,
      urlWeb:
        '/AulaVirtual/MisCursos/' +
        this.json.IdMatriculaCabecera +
        '/' +
        this.idPEspecificoHijo +
        '/' +
        this.tipo +
        '/' +
        this.idcapitulo +
        '/' +
        this.idSesion,
    });
    this.estructuraCapitulo.registroEstructuraCursoCapitulo[index].opened =
      !this.estructuraCapitulo.registroEstructuraCursoCapitulo[index].opened;
  }
  OrdenarEstructura() {
    var sesion = '';
    var c = 0;
    var s = 0;
    var ss = 0;
    var t = 0;
    var tc = 0;
    var e = 0;
    this.estructuraCapitulo.registroEstructuraCursoCapitulo.forEach(
      (x: any) => {
        x.opened = false;
        if (x.numeroCapitulo == this.idcapitulo) {
          x.opened = true;
          this.tabIndex++;
          this.migaPan.push({
            titulo: 'Capitulo ' + x.numeroCapitulo + ': ' + x.nombreCapitulo,
            urlWeb:
              '/AulaVirtual/MisCursos/' +
              this.json.IdMatriculaCabecera +
              '/' +
              this.idPEspecificoHijo +
              '/' +
              this.tipo +
              '/' +
              this.idcapitulo +
              '/' +
              this.idSesion,
          });
          if (x.registroEstructuraCursoEncuesta != null) {
            if (this.tipo == 3) {
              x.registroEstructuraCursoEncuesta.forEach((enc: any) => {
                e++;
                enc.charge = false;
                if (enc.idEncuesta == this.idSesion) {
                  if (enc.nombreEncuesta == 'Encuesta Inicial') {
                    this.tabIndex += 1;
                    enc.charge = true;
                    this.migaPan.push({
                      titulo: enc.nombreEncuesta,
                      urlWeb:
                        '/AulaVirtual/MisCursos/' +
                        this.json.IdMatriculaCabecera +
                        '/' +
                        this.idPEspecificoHijo +
                        '/' +
                        this.tipo +
                        '/' +
                        this.idcapitulo +
                        '/' +
                        this.idSesion,
                    });
                  }
                }
              });
            } else {
              x.registroEstructuraCursoEncuesta.forEach((enc: any) => {
                if (enc.nombreEncuesta == 'Encuesta Inicial') {
                  console.log(x.registroEstructuraCursoEncuesta);
                  this.tabIndex++;
                }
              });
            }
          }
          if (x.registroEstructuraCursoSesion != null) {
            x.registroEstructuraCursoSesion.forEach((sess: any) => {
              s++;
              if (this.estructuraCapitulo.contineSubSesion == false) {
                sess.charge = false;
                if (sess.numeroSesion == this.idSesion && this.tipo == 1) {
                  sess.charge = true;
                  this.tabIndex += s;
                  // this.migaPan.push({
                  //   titulo:
                  //     'Sesión ' + sess.numeroSesion + '. ' + sess.nombreSesion,
                  //   urlWeb:
                  //     '/AulaVirtual/MisCursos/' +
                  //     this.json.IdMatriculaCabecera +
                  //     '/' +
                  //     this.idPEspecificoHijo +
                  //     '/' +
                  //     this.tipo +
                  //     '/' +
                  //     this.idcapitulo +
                  //     '/' +
                  //     this.idSesion,
                  // });
                }
              } else {
                sess.opened = false;
                if (sess.registroEstructuraCursoSubSesion != null) {
                  sess.registroEstructuraCursoSubSesion.forEach(
                    (subSes: any) => {
                      ss++;
                      subSes.charge = false;
                      if (
                        subSes.numeroSubSesion == this.idSesion &&
                        this.tipo == 1
                      ) {
                        subSes.charge = true;
                        sess.opened = true;
                        this.tabIndex += ss + s;
                        // this.migaPan.push({
                        //   titulo:
                        //     'Sesión ' +
                        //     subSes.numeroSubSesion +
                        //     '. ' +
                        //     subSes.nombreSubSesion,
                        //   urlWeb:
                        //     '/AulaVirtual/MisCursos/' +
                        //     this.json.IdMatriculaCabecera +
                        //     '/' +
                        //     this.idPEspecificoHijo +
                        //     '/' +
                        //     this.tipo +
                        //     '/' +
                        //     this.idcapitulo +
                        //     '/' +
                        //     this.idSesion,
                        // });
                      }
                    }
                  );
                }
              }
            });
          }
          console.log(ss + '-' + s);
          if (x.registroEstructuraCursoTarea != null) {
            t++;
            if (this.tipo == 2) {
              x.registroEstructuraCursoTarea.forEach((tarea: any) => {
                tarea.charge = false;
                if (tarea.idTarea == this.idSesion) {
                  tarea.charge = true;
                  this.tabIndex += ss + s + t;
                  // this.migaPan.push({
                  //   titulo: tarea.tarea,
                  //   urlWeb:
                  //     '/AulaVirtual/MisCursos/' +
                  //     this.json.IdMatriculaCabecera +
                  //     '/' +
                  //     this.idPEspecificoHijo +
                  //     '/' +
                  //     this.tipo +
                  //     '/' +
                  //     this.idcapitulo +
                  //     '/' +
                  //     this.idSesion,
                  // });
                }
              });
            }
          }
          if (x.registroCursoTareaCalificar != null) {
            if (this.tipo == 4) {
              x.registroCursoTareaCalificar.forEach((tareaC: any) => {
                tc++;
                tareaC.charge = false;
                if (tareaC.id == this.idSesion) {
                  tareaC.charge = true;
                  this.tabIndex += ss + s + t + tc;
                  // this.migaPan.push({
                  //   titulo: 'Calificar '+tareaC.tarea,
                  //   urlWeb:
                  //     '/AulaVirtual/MisCursos/' +
                  //     this.json.IdMatriculaCabecera +
                  //     '/' +
                  //     this.idPEspecificoHijo +
                  //     '/' +
                  //     this.tipo +
                  //     '/' +
                  //     this.idcapitulo +
                  //     '/' +
                  //     this.idSesion,
                  // });
                }
              });
            }
          }
        } else {
          if (x.numeroCapitulo < this.idcapitulo) {
            this.tabIndex++;
            if (x.registroEstructuraCursoEncuesta != null) {
              x.registroEstructuraCursoEncuesta.forEach((enc: any) => {
                this.tabIndex++;
              });
            }
            if (x.registroEstructuraCursoSesion != null) {
              x.registroEstructuraCursoSesion.forEach((sess: any) => {
                sess.opened = false;
                if (this.estructuraCapitulo.contineSubSesion == true) {
                  if (sess.registroEstructuraCursoSubSesion != null) {
                    sess.registroEstructuraCursoSubSesion.forEach(
                      (subSes: any) => {
                        this.tabIndex++;
                      }
                    );
                  }
                }
                this.tabIndex++;
              });
            }
            if (x.registroEstructuraCursoTarea != null) {
              x.registroEstructuraCursoTarea.forEach((tarea: any) => {
                this.tabIndex++;
              });
            }
            if (x.registroCursoTareaCalificar != null) {
              x.registroCursoTareaCalificar.forEach((tarea: any) => {
                this.tabIndex++;
              });
            }
          }
          if (x.numeroCapitulo > this.idcapitulo) {
            if (x.registroEstructuraCursoSesion != null) {
              x.registroEstructuraCursoSesion.forEach((sess: any) => {
                sess.opened = false;
              });
            }
          }
        }
        c++;
      }
    );

    this.estructuraCapitulo.registroEstructuraCursoCapitulo.forEach(
      (x: any) => {
        if (
          x.numeroCapitulo == this.idcapitulo &&
          x.registroEstructuraCursoEncuesta != null &&
          this.tipo == 3
        ) {
          x.registroEstructuraCursoEncuesta.forEach((enc: any) => {
            e++;
            if (enc.idEncuesta == this.idSesion) {
              if (enc.nombreEncuesta != 'Encuesta Inicial') {
                enc.charge = true;
                this.tabIndex += ss + s + t + e;
                // this.migaPan.push({
                //   titulo: enc.nombreEncuesta,
                //   urlWeb:
                //     '/AulaVirtual/MisCursos/' +
                //     this.json.IdMatriculaCabecera +
                //     '/' +
                //     this.idPEspecificoHijo +
                //     '/' +
                //     this.tipo +
                //     '/' +
                //     this.idcapitulo +
                //     '/' +
                //     this.idSesion,
                // });
              }
            }
          });
        }
      }
    );
    this.tabIndex--;
    console.log(this.tabIndex);
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    // console.log('tabChangeEvent => ', tabChangeEvent);
    // console.log('index => ', tabChangeEvent.index);
  }
}
