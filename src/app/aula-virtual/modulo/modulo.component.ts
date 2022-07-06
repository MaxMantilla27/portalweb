import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';


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
  public hide=false
  public tabIndex = 0;
  public idMatricula=0;
  public idPEspecificoHijo=0;
  public alertaPreguntasFrecuentes=false
  public alertaQuejasSugerencias=false
  public AyudaActive=false
  public json:ParametrosEstructuraEspecificaDTO={

    AccesoPrueba: false,
    IdMatriculaCabecera: 0,
    IdPEspecificoPadre: 0,
    IdPGeneralPadre: 0,
    IdPEspecificoHijo: 0,
    IdPGeneralHijo: 0,
    NombreCapitulo:'',
    NombrePrograma:'',
    idModalidad:1
  }
  public estructuraCapitulo:any;
  ngOnInit(): void {

    this._ActivatedRoute.params.subscribe({
      next: (x) => {
        this.idMatricula = parseInt(x['IdMatricula']);
        this.idPEspecificoHijo=x['idPEspecificoHijo'];
        this.ObtenerListadoProgramaContenido();
      },
    });
  }
  ObtenerEstructuraEspecificaCurso(){
    this._ProgramaContenidoService.ObtenerEstructuraEspecificaCurso(this.json).subscribe({
      next:x=>{
        this.estructuraCapitulo=x
        this._SessionStorageService.SetEstructura(this.estructuraCapitulo);
        console.log(this.estructuraCapitulo)

      }
    })
  }
  ObtenerListadoProgramaContenido() {

    this._ProgramaContenidoService
      .ObtenerListadoProgramaContenido(this.idMatricula)
      .subscribe({
        next: (x) => {
          x.listaCursoMatriculado.forEach((program:any) => {
            if(this.idPEspecificoHijo==program.idPEspecificoHijo){
              this.json = {
                AccesoPrueba: false,
                IdMatriculaCabecera: x.idMatriculaCabecera,
                IdPEspecificoPadre: x.idPEspecifico,
                IdPGeneralPadre: x.idPGeneral,
                IdPEspecificoHijo: program.idPEspecificoHijo,
                IdPGeneralHijo: program.idPGeneralHijo,
                NombreCapitulo:program.programaGeneralHijo,
                NombrePrograma:x.programaGeneral,
                idModalidad:x.idModalidad
              };
              this.migaPan.push({
                titulo:this.json.NombrePrograma,
                urlWeb:'/AulaVirtual/MisCursos/'+this.json.IdMatriculaCabecera
              },
              {
                titulo:this.json.NombreCapitulo,
                urlWeb:'/AulaVirtual/MisCursos/'+this.json.IdMatriculaCabecera+'/'+this.idPEspecificoHijo
              })
              this.ObtenerEstructuraEspecificaCurso();
            }
          });
        },
      });
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);
    if(tabChangeEvent.index == 5){
      this.AyudaActive=true
    }
  }

}
