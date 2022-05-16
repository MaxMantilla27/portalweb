import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-sesiones',
  templateUrl: './sesiones.component.html',
  styleUrls: ['./sesiones.component.scss'],
})
export class SesionesComponent implements OnInit {
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _ProgramaContenidoService: ProgramaContenidoService,
    private _SessionStorageService:SessionStorageService
  ) {}

  public migaPan = [
    {
      titulo: 'Mis Cursos',
      urlWeb: '/AulaVirtual/MisCursos',
    },
  ];
  public tabIndex = 0;
  public idMatricula = 0;
  public json: ParametrosEstructuraEspecificaDTO = {
    AccesoPrueba: false,
    IdMatriculaCabecera: 0,
    IdPEspecificoPadre: 0,
    IdPGeneralPadre: 0,
    IdPEspecificoHijo: 0,
    IdPGeneralHijo: 0,
    NombreCapitulo: '',
    NombrePrograma: '',
  };
  public estructuraCapitulo: Array<any> = [];
  public idcapitulo = 0;
  public idSesion = 0;
  public parametros = 0;
  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe({
      next: (x) => {
        this.idMatricula = parseInt(x['IdMatricula']);
        this.json = JSON.parse(atob(x['Parametros']));
        this.parametros = x['Parametros'].toString();
        this.idcapitulo = parseInt(x['IdCapitulo']);
        this.idSesion = parseInt(x['IdSesion']);
        console.log(this.json);
        this.migaPan.push(
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
              this.parametros,
          }
        );
        this.estructuraCapitulo=this._SessionStorageService.getEstructura();
        if(this.estructuraCapitulo==[]){
          this.ObtenerEstructuraEspecifica();
        }else{
          console.log(this.estructuraCapitulo)
          this.OrdenarEstructura();
        }
      },
    });
  }

  ObtenerEstructuraEspecifica() {
    this._ProgramaContenidoService
      .ObtenerEstructuraEspecifica(this.json)
      .subscribe({
        next: (x) => {
          console.log(x);
          this.estructuraCapitulo = x;
          this.OrdenarEstructura();
        },
      });
  }
  OrdenarEstructura(){

    var sesion = '';
    this.estructuraCapitulo.forEach((x) => {
      if (x.ordenFila == this.idcapitulo && x.id == 0) {
        if (x.listaSesiones != null) {
          x.listaSesiones.forEach((sess: any) => {
            if (sess.ordenFila == this.idSesion) {
              this.migaPan.push(
                {
                  titulo: 'Capitulo '+x.ordenFila+':'+ x.capitulo,
                  urlWeb:
                    '/AulaVirtual/MisCursos/' +
                    this.json.IdMatriculaCabecera+
                    '/' +
                    this.parametros+
                    '/' +
                    this.idcapitulo+
                    '/' +
                    this.idSesion
                },
                {
                  titulo: 'Sesión '+sess.ordenFila+'. '+sess.sesion,
                  urlWeb:
                    '/AulaVirtual/MisCursos/' +
                    this.json.IdMatriculaCabecera +
                    '/' +
                    this.parametros+
                    '/' +
                    this.idcapitulo+
                    '/' +
                    this.idSesion
                }
              );
            }
          });
        }
      }
      x.sesiones = [];
      if (x.listaSesiones != null) {
        x.listaSesiones.forEach((sess: any) => {
          if (sesion != sess.sesion) {
            sesion = sess.sesion;
            x.sesiones.push(sesion);
          }
        });
        sesion = '';
      }
    });
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);
  }
}
