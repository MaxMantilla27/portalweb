import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SesionesComponent } from '../sesiones/sesiones.component';

@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModuloComponent implements OnInit {

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _ProgramaContenidoService:ProgramaContenidoService,
    private _SessionStorageService:SessionStorageService
  ) { }
  public migaPan = [
    {
      titulo: 'Mis Cursos',
      urlWeb: '/AulaVirtual/MisCursos',
    },
  ];
  public tabIndex = 0;
  public idMatricula=0;
  public json:ParametrosEstructuraEspecificaDTO={

    AccesoPrueba: false,
    IdMatriculaCabecera: 0,
    IdPEspecificoPadre: 0,
    IdPGeneralPadre: 0,
    IdPEspecificoHijo: 0,
    IdPGeneralHijo: 0,
    NombreCapitulo:'',
    NombrePrograma:''
  }
  public estructuraCapitulo:Array<any>=[];
  ngOnInit(): void {

    this._ActivatedRoute.params.subscribe({
      next: (x) => {
        this.idMatricula = parseInt(x['IdMatricula']);
        this.json=JSON.parse(atob(x['Parametros']));
        console.log(this.json);
        this.migaPan.push({
          titulo:this.json.NombrePrograma,
          urlWeb:'/AulaVirtual/MisCursos/'+this.json.IdMatriculaCabecera
        },
        {
          titulo:this.json.NombreCapitulo,
          urlWeb:'/AulaVirtual/MisCursos/'+this.json.IdMatriculaCabecera+'/'+atob(x['Parametros']).toString()
        })
        this.ObtenerEstructuraEspecifica();
      },
    });
  }
  ObtenerEstructuraEspecifica(){
    this._ProgramaContenidoService.ObtenerEstructuraEspecifica(this.json).subscribe({
      next:x=>{
        console.log(x)
        this.estructuraCapitulo=x
        this._SessionStorageService.SetEstructura(this.estructuraCapitulo);
        var sesion='';
        this.estructuraCapitulo.forEach(x=>{
          x.numerosesion=0;
          x.sesiones=[]
          if(x.listaSesiones!=null){
            x.listaSesiones.forEach((sess:any) => {
              if(sesion!=sess.sesion){
                x.numerosesion++;
                sesion=sess.sesion
                x.sesiones.push(sesion);
              }
            });
            sesion='';
          }
        })
      }
    })
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);
  }

}
