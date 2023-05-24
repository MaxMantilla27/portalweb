import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ParametrosEstructuraEspecificaAccesoPruebaDTO, ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { CursoPadrePruebaDTO } from 'src/app/Core/Models/ListadoProgramaContenidoPruebaDTO';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-modulo-prueba',
  templateUrl: './modulo-prueba.component.html',
  styleUrls: ['./modulo-prueba.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ModuloPruebaComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _ProgramaContenidoService:ProgramaContenidoService,
    private _SessionStorageService:SessionStorageService
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public hide=false
  public migaPan = [
    {
      titulo: 'Mis Cursos',
      urlWeb: '/AulaVirtual/MisCursos',
    },
  ];
  public tabIndex = 0;
  public idRegistroPrueba = 0;
  public idPEspecificoHijo=0;
  public json:ParametrosEstructuraEspecificaAccesoPruebaDTO={

    AccesoPrueba: true,
    IdAccesoPrueba: 0,
    IdPEspecificoPadre: 0,
    IdPGeneralPadre: 0,
    IdPEspecificoHijo: 0,
    IdPGeneralHijo: 0,
    NombreCapitulo:'',
    NombrePrograma:'',
    idModalidad:1,
    visualizarVideos:false,
    accesoCompleto:false,
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

    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.idRegistroPrueba = parseInt(x['IdRegistroPrueba']);
        this.idPEspecificoHijo=x['idPEspecificoHijo'];
        this.ObtenerListadoProgramaContenido();
      },
    });
  }
  ObtenerEstructuraEspecificaCurso(){
    this._ProgramaContenidoService.ObtenerEstructuraEspecificaCursoAccesoPrueba(this.json).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.estructuraCapitulo=x
        this._SessionStorageService.SetEstructura(this.estructuraCapitulo);
        console.log(this.estructuraCapitulo)
      }
    })
  }
  ObtenerListadoProgramaContenido() {

    this._ProgramaContenidoService
      .ObtenerListadoProgramaContenidoPrueba(this.idRegistroPrueba,this.idPEspecificoHijo).pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x)
          this.programaEstructura = x;
          this.programaEstructura.listaCursoMatriculado.forEach((program:any) => {
            if(this.idPEspecificoHijo==program.idPEspecificoHijo){
              this.json = {
                AccesoPrueba: true,
                IdAccesoPrueba: this.programaEstructura.idRegistroPrueba,
                IdPEspecificoPadre: this.programaEstructura.idPEspecifico,
                IdPGeneralPadre: this.programaEstructura.idPGeneral,
                IdPEspecificoHijo: program.idPEspecificoHijo,
                IdPGeneralHijo: program.idPGeneralHijo,
                NombreCapitulo:program.programaGeneralHijo,
                NombrePrograma:this.programaEstructura.programaGeneral,
                idModalidad:this.programaEstructura.idModalidad,
                visualizarVideos:program.visualizarVideos,
                accesoCompleto:program.accesoCompleto,
              };
              this.migaPan.push({
                titulo:this.json.NombrePrograma,
                urlWeb:'/AulaVirtual/MisCursosPrueba/'+this.json.IdAccesoPrueba
              },
              {
                titulo:this.json.NombreCapitulo,
                urlWeb:'/AulaVirtual/MisCursosPrueba/'+this.json.IdAccesoPrueba+'/'+this.idPEspecificoHijo
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
