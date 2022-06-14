import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { CursoPadrePruebaDTO } from 'src/app/Core/Models/ListadoProgramaContenidoPruebaDTO';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-modulo-prueba',
  templateUrl: './modulo-prueba.component.html',
  styleUrls: ['./modulo-prueba.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ModuloPruebaComponent implements OnInit {

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _ProgramaContenidoService:ProgramaContenidoService,
    private _SessionStorageService:SessionStorageService
  ) { }
  public migaPan = [
    {
      titulo: 'Mis Cursos prueba',
      urlWeb: '/AulaVirtual/MisCursosPrueba',
    },
  ];
  public tabIndex = 0;
  public idRegistroPrueba = 0;
  public idPEspecificoHijo=0;
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
  public estructuraCapitulo:any;
  ngOnInit(): void {

    this._ActivatedRoute.params.subscribe({
      next: (x) => {
        this.idRegistroPrueba = parseInt(x['IdRegistroPrueba']);
        this.idPEspecificoHijo=x['idPEspecificoHijo'];
        this.ObtenerListadoProgramaContenido();
      },
    });
  }
  ObtenerEstructuraEspecificaCurso(){
    this._ProgramaContenidoService.ConseguirEstructuraPorPrograma(this.programaEstructura.idPGeneral).subscribe({
      next:x=>{
        console.log(this.estructuraCapitulo)
        this.estructuraCapitulo=x
        this._SessionStorageService.SetEstructura(this.estructuraCapitulo);
        console.log(this.estructuraCapitulo)

      }
    })
  }
  ObtenerListadoProgramaContenido() {

    this._ProgramaContenidoService
      .ObtenerListadoProgramaContenidoPrueba(this.idRegistroPrueba)
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
  }

}
