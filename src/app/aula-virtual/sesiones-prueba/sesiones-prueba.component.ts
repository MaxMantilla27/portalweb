import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { CursoPadrePruebaDTO } from 'src/app/Core/Models/ListadoProgramaContenidoPruebaDTO';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-sesiones-prueba',
  templateUrl: './sesiones-prueba.component.html',
  styleUrls: ['./sesiones-prueba.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class SesionesPruebaComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _ProgramaContenidoService: ProgramaContenidoService,
    private _SessionStorageService: SessionStorageService,
  ) {}

  tabLoadTimes: Date[] = [];
  public migaPan = [
    {
      titulo: 'Mis Cursos',
      urlWeb: '/AulaVirtual/MisCursosPrueba',
    },
  ];
  public tabIndex = 0;
  public idMatricula = 0;
  public idRegistroPrueba = 0;
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
  public programaEstructura: CursoPadrePruebaDTO = {
    idAlumno: 0,
    idRegistroPrueba: 0,
    idModalidad: 0,
    idPEspecifico: 0,
    idPGeneral: 0,
    listaCursoMatriculado: [],
    modalidad: '',
    programaGeneral: '',
  };
  public estructuraCapitulo: any ;
  public idcapitulo = 0;
  public idSesion = 0;
  public tipo = 0;
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnInit(): void {
    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.idRegistroPrueba = parseInt(x['IdRegistroPrueba']);
        this.idPEspecificoHijo = x['idPEspecificoHijo'];
        this.idcapitulo = parseInt(x['IdCapitulo']);
        this.idSesion = parseInt(x['IdSesion']);
        this.tipo = parseInt(x['Tipo']);
        console.log(this.idcapitulo)
        console.log(this.idSesion)

        this.ObtenerListadoProgramaContenido();
      },
    });
  }
  migapanbase() {
    this.migaPan = [
      {
        titulo: 'Mis Cursos',
        urlWeb: '/AulaVirtual/MisCursosPrueba',
      },
      {
        titulo: this.json.NombrePrograma,
        urlWeb: '/AulaVirtual/MisCursosPrueba/' + this.json.IdMatriculaCabecera,
      },
      {
        titulo: this.json.NombreCapitulo,
        urlWeb:
          '/AulaVirtual/MisCursosPrueba/' +
          this.json.IdMatriculaCabecera +
          '/' +
          this.idPEspecificoHijo,
      },
    ];
  }
  ObtenerEstructuraEspecificaCurso(){
    this._ProgramaContenidoService.ConseguirEstructuraPorPrograma(this.programaEstructura.idPGeneral).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.estructuraCapitulo=x
        console.log(this.estructuraCapitulo)
        let i=0;
        while(i<this.estructuraCapitulo.length){
          if(this.estructuraCapitulo[i].id>0){
            this.estructuraCapitulo.splice(i,1)
          }else{
            i++
          }
        }
        this._SessionStorageService.SetEstructura(this.estructuraCapitulo);
        console.log(this.estructuraCapitulo)

      }
    })
  }

  ObtenerListadoProgramaContenido(){
    this._ProgramaContenidoService
      .ObtenerListadoProgramaContenidoPrueba(this.idRegistroPrueba).pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.programaEstructura = x;
          this.programaEstructura.listaCursoMatriculado.forEach((program:any) => {
            if(this.idPEspecificoHijo==program.idPEspecificoHijo){
              this.json = {
                AccesoPrueba: false,
              IdMatriculaCabecera: this.programaEstructura.idRegistroPrueba,
              IdPEspecificoPadre: this.programaEstructura.idPEspecifico,
              IdPGeneralPadre: this.programaEstructura.idPGeneral,
              IdPEspecificoHijo: program.idPEspecificoHijo,
              IdPGeneralHijo: program.idPGeneralHijo,
              NombreCapitulo:program.programaGeneralHijo,
              NombrePrograma:this.programaEstructura.programaGeneral,
              idModalidad:this.programaEstructura.idModalidad
              };
              this.migapanbase();
              this.estructuraCapitulo = this._SessionStorageService.getEstructura();
              console.log(this.estructuraCapitulo);
              this.ObtenerEstructuraEspecificaCurso();
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
        this.estructuraCapitulo[
          index
        ].listaSesiones[indexSesion].charge = true;
      } else {
        this.estructuraCapitulo[
          index
        ].listaSesiones[
          indexSesion
        ].registroEstructuraCursoSubSesion[indexSubsesion].charge = true;
      }
    }
  }
  changeSesion(index: number, sesionIndex: number) {
    if (
      this.estructuraCapitulo[index]
        .listaSesiones[sesionIndex].opened == false
    ) {
      this.estructuraCapitulo[
        index
      ].listaSesiones.forEach((ses: any) => {
        ses.opened = false;
      });
    }
    this.estructuraCapitulo[
      index
    ].listaSesiones[sesionIndex].opened =
      !this.estructuraCapitulo[index]
        .listaSesiones[sesionIndex].opened;
  }
  changeCapitulo(index: number) {
    if (
      this.estructuraCapitulo[index].opened ==
      false
    ) {
      this.estructuraCapitulo.forEach(
        (cap: any) => {
          cap.opened = false;
        }
      );
    }

    this.migapanbase();
    this.migaPan.push({
      titulo:
        'Capitulo ' +
        this.estructuraCapitulo[index]
          .idCapitulo +
        ': ' +
        this.estructuraCapitulo[index]
          .capitulo,
      urlWeb:
        '/AulaVirtual/MisCursosPrueba/' +
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
    this.estructuraCapitulo[index].opened =
      !this.estructuraCapitulo[index].opened;
  }
  OrdenarEstructura() {
    var sesion = '';
    var c = 0;
    var s = 0;
    var ss = 0;
    var t = 0;
    var tc = 0;
    var e=0
    this.estructuraCapitulo.forEach(
      (x: any) => {
        x.opened = false;
        if (x.ordenFila == this.idcapitulo) {
          x.opened = true;
          this.tabIndex++;
          this.migaPan.push({
            titulo: 'Capitulo ' + x.ordenFila + ': ' + x.capitulo,
            urlWeb:
              '/AulaVirtual/MisCursosPrueba/' +
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

          if (x.listaSesiones != null) {
            x.listaSesiones.forEach((sess: any) => {
              s++;
              if (this.estructuraCapitulo.subSesion == null) {
                sess.charge = false;
                if (sess.ordenFila == this.idSesion && this.tipo == 1) {
                  sess.charge = true;
                  this.tabIndex += s;
                  this.migaPan.push({
                    titulo:
                      'Sesión ' + sess.ordenFila + '. ' + sess.sesion,
                    urlWeb:
                      '/AulaVirtual/MisCursosPrueba/' +
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
                if (sess.subSesion != null) {
                  sess.registroEstructuraCursoSubSesion.forEach(
                    (subSes: any) => {
                      ss++;
                      subSes.charge = false;
                      if (
                        subSes.ordenFila == this.idSesion &&
                        this.tipo == 1
                      ) {
                        subSes.charge = true;
                        sess.opened = true;
                        this.tabIndex += ss + s;
                        this.migaPan.push({
                          titulo:
                            'Sesión ' +
                            subSes.ordenFila +
                            '. ' +
                            subSes.subSesion,
                          urlWeb:
                            '/AulaVirtual/MisCursosPrueba/' +
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
        } else {
          if(x.ordenFila > this.idcapitulo){
            if (x.listaSesiones != null) {
              x.listaSesiones.forEach((sess: any) => {
                sess.opened = false;
              });
            }
          }
        }
        c++;
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
