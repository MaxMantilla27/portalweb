import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { AlumnosTest } from 'src/app/Core/Shared/AlumnosTest';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';

@Component({
  selector: 'app-sesiones',
  templateUrl: './sesiones.component.html',
  styleUrls: ['./sesiones.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SesionesComponent implements OnInit,OnDestroy,AfterViewInit {
  private signal$ = new Subject();
  isBrowser: boolean;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _ProgramaContenidoService: ProgramaContenidoService,
    private _SessionStorageService: SessionStorageService,
    @Inject(PLATFORM_ID) platformId: Object,
    private _AlumnosTest:AlumnosTest,
    private _SnackBarServiceService:SnackBarServiceService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  public minH=0
  ngAfterViewInit(): void {

  }

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
  public hide=true
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
  public estructuraCapitulo: any ;
  public idcapitulo = 0;
  public idSesion = 0;
  public tipo = 0;
  public nextCapter = { name: '', time: '' };
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
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

  siguiente(tipo: number, indexc: number, index: number, indexss: number,solohabilitar:boolean) {
    var indexI=this.tabIndex
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
    if(solohabilitar==true){
      this.tabIndex=indexI;
    }
  }
  anterior(tipo: number, indexc: number, index: number, indexss: number) {
    this.tabIndex--;
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
    console.log(this.tabIndex)
    console.log(this.estructuraCapitulo.registroEstructuraCursoCapitulo)
    this.estructuraCapitulo.registroEstructuraCursoCapitulo.forEach(
      (c: any) => {
        c.opened = false;
        c.registroEstructuraCursoEncuesta.forEach((e: any) => {
          if (e.nombreEncuesta == 'Encuesta Inicial') {
            ndx++;
            if (ndx == this.tabIndex) {
              e.charge = true;
              c.opened = true;
              e.habilitado=true;
            }
          }
        });
        console.log('e-'+ndx)
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
                ss.habilitado=true;
              }
            });
          } else {
            if (ndx == this.tabIndex) {
              s.charge = true;
              c.opened = true;
              s.habilitado=true;
            }
          }
        });
        console.log('s-'+ndx)
        c.registroEstructuraCursoTarea.forEach((t: any) => {
          ndx++;
          if (ndx == this.tabIndex) {
            t.charge = true;
            c.opened = true;
            t.habilitado=true;
          }
        });

        console.log('t-'+ndx)
        c.registroCursoTareaCalificar.forEach((tc: any) => {
          ndx++;
          if (ndx == this.tabIndex) {
            tc.charge = true;
            c.opened = true;
            tc.habilitado=true;
          }
        });
        console.log('tt-'+ndx)
        c.registroEstructuraCursoEncuesta.forEach((e: any) => {
          if (e.nombreEncuesta != 'Encuesta Inicial') {
            ndx++;
            if (ndx == this.tabIndex) {
              e.charge = true;
              c.opened = true;
              e.habilitado=true;
            }
          }
        });
        console.log('e2-'+ndx)
        ndx++;
        console.log(ndx)
      }
    );
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
      .ObtenerEstructuraEspecificaCurso(this.json).pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {

          console.log(x)
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
                if (Math.ceil(ss.porcentajeVideoVisualizado) >= 98) {
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
              if (Math.ceil(s.porcentajeVideoVisualizado) >= 98) {
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
        var lastCap=this.estructuraCapitulo.registroEstructuraCursoCapitulo.length-1
        c.registroEstructuraCursoSesion.forEach((s: any) => {
          var lastSes=c.registroEstructuraCursoSesion.length-1;
          if (this.estructuraCapitulo.contineSubSesion == true) {
            s.registroEstructuraCursoSubSesion.forEach((ss: any) => {
              var lastSub=s.registroEstructuraCursoSubSesion.length-1
              if(subs==lastSub){
                if(ses==lastSes){
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
                    name:c.registroEstructuraCursoSesion[ses+1].registroEstructuraCursoSubSesion[0].nombreSubSesion,
                    time:Math.ceil(c.registroEstructuraCursoSesion[ses+1].registroEstructuraCursoSubSesion[0].tiempoVideo/60)
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

    var alumnoTest=this._AlumnosTest.Allpermisions(this.estructuraCapitulo.idAlumno);
    this.estructuraCapitulo.registroEstructuraCursoCapitulo.forEach(
      (c: any) => {
        c.registroEstructuraCursoSesion.forEach((s: any) => {
          if (this.estructuraCapitulo.contineSubSesion == true) {
            s.subV = 0;
            s.registroEstructuraCursoSubSesion.forEach((ss: any) => {
              ss.habilitado = false;

              if(this.estructuraCapitulo.convalidado==true || alumnoTest){
                ss.habilitado=true;
              }
              if (Math.ceil(ss.porcentajeVideoVisualizado) >= 98) {
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
                      ) >= 98
                    ) {
                      if (this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoEncuesta.length > 0) {
                        ss.habilitado = true;
                        this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoEncuesta.forEach((e: any) => {
                          if (e.nombreEncuesta != 'Encuesta Inicial') {
                            if (e.encuestaEnviada != true) {
                              ss.habilitado = false;
                              if(this.estructuraCapitulo.convalidado==true || alumnoTest){
                                ss.habilitado=true;
                              }
                            }
                          }
                        });
                      } else {
                        ss.habilitado = true;
                      }
                      if (ss.habilitado == true) {
                        if (this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoTarea.length > 0) {
                          ss.habilitado = true;
                          this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoTarea.forEach((t: any) => {
                            if (t.tareasEnviadas == 0) {
                              ss.habilitado = false;
                              if(this.estructuraCapitulo.convalidado==true || alumnoTest){
                                ss.habilitado=true;
                              }
                            }
                          });
                        } else {
                          ss.habilitado = true;
                        }
                      }
                      if (s.habilitado == true) {
                        if (this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroCursoTareaCalificar.length > 0) {
                          ss.habilitado = true;
                          this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroCursoTareaCalificar.forEach((tc: any) => {
                            if (!tc.calificado) {
                              ss.habilitado = false;
                              if(this.estructuraCapitulo.convalidado==true || alumnoTest){
                                ss.habilitado=true;
                              }
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
                    ) >= 98
                  ) {
                    ss.habilitado = true;
                  }
                }
              } else {
                if (
                  Math.ceil(
                    s.registroEstructuraCursoSubSesion[subs - 1]
                      .porcentajeVideoVisualizado
                  ) >= 98
                ) {
                  ss.habilitado = true;
                }
              }
              subs++;
            });
            subs = 0;
          } else {
            s.habilitado = false;
            if(this.estructuraCapitulo.convalidado==true || alumnoTest){
              s.habilitado=true;
            }
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
                  ) >= 98
                ) {
                  if (
                    this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroCursoTareaCalificar.length > 0 ||
                    this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoEncuesta.length > 0 ||
                    this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoTarea.length > 0
                  ) {
                    if (this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoEncuesta.length > 0) {
                      s.habilitado = true;
                      this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoEncuesta.forEach((e: any) => {
                        if (e.nombreEncuesta != 'Encuesta Inicial') {
                          if (e.encuestaEnviada != true) {
                            s.habilitado = false;
                            if(this.estructuraCapitulo.convalidado==true || alumnoTest){
                              s.habilitado=true;
                            }
                          }
                        }
                      });
                    } else {
                      s.habilitado = true;
                    }
                    if (s.habilitado == true) {
                      if (this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoTarea.length > 0) {
                        s.habilitado = true;
                        this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroEstructuraCursoTarea.forEach((t: any) => {
                          if (t.tareasEnviadas == 0) {
                            s.habilitado = false;
                            if(this.estructuraCapitulo.convalidado==true || alumnoTest){
                              s.habilitado=true;
                            }
                          }
                        });
                      } else {
                        s.habilitado = true;
                      }
                    }
                    if (s.habilitado == true) {
                      if (this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroCursoTareaCalificar.length > 0) {
                        s.habilitado = true;
                        this.estructuraCapitulo.registroEstructuraCursoCapitulo[cap-1].registroCursoTareaCalificar.forEach((tc: any) => {
                          if (!tc.calificado) {
                            s.habilitado = false;
                            if(this.estructuraCapitulo.convalidado==true || alumnoTest){
                              s.habilitado=true;
                            }
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
          if(this.estructuraCapitulo.convalidado==true || alumnoTest){
            e.habilitado=true;
          }
          if (e.nombreEncuesta != 'Encuesta Inicial') {
            if (enc > 0) {
              if (
                Math.ceil(
                  c.registroEstructuraCursoEncuesta[enc - 1]
                    .porcentajeVideoVisualizado
                ) >= 98
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
                  ) >= 98
                ) {
                  e.habilitado = true;
                }
              } else {
                if (
                  Math.ceil(
                    c.registroEstructuraCursoSesion[lastses]
                      .porcentajeVideoVisualizado
                  ) >= 98
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
          if(this.estructuraCapitulo.convalidado==true || alumnoTest){
            t.habilitado=true;
          }
          if (tar > 0) {
            if (
              Math.ceil(
                c.registroEstructuraCursoTarea[tar - 1]
                  .porcentajeVideoVisualizado
              ) >= 98
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
                ) >= 98
              ) {
                t.habilitado = true;
              }
            } else {
              if (
                Math.ceil(
                  c.registroEstructuraCursoSesion[lastses]
                    .porcentajeVideoVisualizado
                ) >= 98
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
          if(this.estructuraCapitulo.convalidado==true || alumnoTest){
            t.habilitado=true;
          }
          if (tarC > 0) {
            if (
              Math.ceil(
                c.registroCursoTareaCalificar[tarC - 1]
                  .porcentajeVideoVisualizado
              ) >= 98
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
                ) >= 98
              ) {
                t.habilitado = true;
              }
            } else {
              if (
                Math.ceil(
                  c.registroEstructuraCursoSesion[lastses]
                    .porcentajeVideoVisualizado
                ) >= 98
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
  }
  ObtenerListadoProgramaContenido() {
    this._ProgramaContenidoService
      .ObtenerListadoProgramaContenido(this.idMatricula).pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
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
  mensajeDisable(){
    this._SnackBarServiceService.openSnackBar('Debes completar las actividades anteriores para continuar con esta actividad','x',10,'snackbarCrucigramaerror');
  }
  changeTab(
    tipo: number,
    sesion: number,
    index: number,
    indexSesion: number,
    indexSubsesion: number
  ) {
    console.log('-------------')
    this.tipo = tipo;
    this.idSesion = sesion;
    if (tipo == 1) {
      if (indexSubsesion == -1) {
        this.estructuraCapitulo.registroEstructuraCursoCapitulo[index].registroEstructuraCursoSesion[indexSesion].charge = true;
      } else {
        this.estructuraCapitulo.registroEstructuraCursoCapitulo[index].
        registroEstructuraCursoSesion[indexSesion].registroEstructuraCursoSubSesion[indexSubsesion].charge = true;
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
          console.log(this.tabIndex)
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
                  this.tabIndex++;
                }
              });
            }
          }

          console.log(s+'--'+ss)
          console.log(this.tabIndex)
          if (x.registroEstructuraCursoSesion != null) {
            x.registroEstructuraCursoSesion.forEach((sess: any) => {
              s++;
              if (this.estructuraCapitulo.contineSubSesion == false) {
                sess.charge = false;
                if (sess.numeroSesion == this.idSesion && this.tipo == 1) {
                  console.log(this.tabIndex)
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

          console.log(s+'--'+ss)
          if (x.registroEstructuraCursoTarea != null) {
            x.registroEstructuraCursoTarea.forEach((tarea: any) => {
              t++;
              if (this.tipo == 2) {
                tarea.charge = false;
                if (tarea.idTarea == this.idSesion) {
                  tarea.charge = true;
                  this.tabIndex += ss + s + t;

                  console.log(this.tabIndex)
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
              }

            });
          }
          console.log(this.tabIndex)
          if (x.registroCursoTareaCalificar != null) {
            x.registroCursoTareaCalificar.forEach((tareaC: any) => {
              tc++;
              if (this.tipo == 4) {
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
              }

            });
          }
          console.log(this.tabIndex)
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
            console.log(this.tabIndex)
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
    console.log(e)
    console.log(this.tabIndex)
    this.estructuraCapitulo.registroEstructuraCursoCapitulo.forEach(
      (x: any) => {
        if (
          x.numeroCapitulo == this.idcapitulo &&
          x.registroEstructuraCursoEncuesta != null &&
          this.tipo == 3
        ) {
          x.registroEstructuraCursoEncuesta.forEach((enc: any) => {
            if (enc.nombreEncuesta != 'Encuesta Inicial') {
              e++;
              if (enc.idEncuesta == this.idSesion) {
                  console.log('--------------')
                  console.log(enc)
                  console.log('--------------')
                  enc.charge = true;
                  console.log(this.tabIndex)
                  console.log(ss+'-' + s+'-' + t+'-' + e+'-'+tc)
                  this.tabIndex += ss + s + t+e+tc ;
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
    console.log(this.tabIndex)
    if(this.isBrowser){
      setTimeout(() => {
        var element=document.getElementsByClassName('mat-tab-labels')[0]

        console.log(element.clientHeight)
        this.minH=document.getElementsByClassName('mat-tab-labels')[0].clientHeight
        console.log(this.minH)
      }, 1000);
    }
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    // console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);
  }
}
