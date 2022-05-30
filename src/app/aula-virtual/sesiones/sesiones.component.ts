import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
          this.OrdenarEstructura();
        },
      });
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
    if(tipo==1){

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
    if(tipo==2){
      this.estructuraCapitulo.registroEstructuraCursoCapitulo[
        index
      ].registroEstructuraCursoTarea[indexSesion].charge=true
    }
    if(tipo==3){
      this.estructuraCapitulo.registroEstructuraCursoCapitulo[
        index
      ].registroEstructuraCursoEncuesta[indexSesion].charge=true
    }
    if(tipo==4){
      this.estructuraCapitulo.registroEstructuraCursoCapitulo[
        index
      ].registroCursoTareaCalificar[indexSesion].charge=true
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
    var e=0
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
                    this.tabIndex+=1;
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
                  console.log(x.registroEstructuraCursoEncuesta)
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
                  this.migaPan.push({
                    titulo:
                      'Sesión ' + sess.numeroSesion + '. ' + sess.nombreSesion,
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
                        this.migaPan.push({
                          titulo:
                            'Sesión ' +
                            subSes.numeroSubSesion +
                            '. ' +
                            subSes.nombreSubSesion,
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
                  this.migaPan.push({
                    titulo: tarea.tarea,
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
                  this.migaPan.push({
                    titulo: 'Calificar '+tareaC.tarea,
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
          if(x.numeroCapitulo > this.idcapitulo){
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
        if (x.numeroCapitulo == this.idcapitulo && x.registroEstructuraCursoEncuesta != null && this.tipo == 3) {
          x.registroEstructuraCursoEncuesta.forEach((enc: any) => {
            e++;
            if (enc.idEncuesta == this.idSesion) {
              if (enc.nombreEncuesta != 'Encuesta Inicial') {
                enc.charge = true;
                this.tabIndex += ss + s + t+e;
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
        }
      }
    );
    this.tabIndex--
    console.log(this.tabIndex);
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    // console.log('tabChangeEvent => ', tabChangeEvent);
    // console.log('index => ', tabChangeEvent.index);
  }
}
