import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';


@Component({
  selector: 'app-modulo',
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModuloComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _ProgramaContenidoService:ProgramaContenidoService,
    private _SessionStorageService:SessionStorageService,
    private _HelperService:HelperService
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public migaPan = [
    {
      titulo: 'Mis Cursos',
      urlWeb: '/AulaVirtual/MisCursos',
    },
  ];
  public hide=true
  public tabIndex = 0;
  public idMatricula=0;
  public idPEspecificoHijo=0;
  public alertaPreguntasFrecuentes=false
  public alertaQuejasSugerencias=false
  public AyudaActive=false
  public videosOnline:Array<any>=[]
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

    this._ActivatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.idMatricula = parseInt(x['IdMatricula']);
        this.idPEspecificoHijo=x['idPEspecificoHijo'];
        this.ObtenerListadoProgramaContenido();
        this.listaRegistroVideoSesionProgramaSincronico();
      },
    });
  }
  listaRegistroVideoSesionProgramaSincronico(){
    this._ProgramaContenidoService.listaRegistroVideoSesionProgramaSincronico(this.idPEspecificoHijo).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.videosOnline=x
        console.log(x)
      }
    })
  }
  ObtenerEstructuraEspecificaCurso(){
    this._ProgramaContenidoService.ObtenerEstructuraEspecificaCurso(this.json).pipe(takeUntil(this.signal$)).subscribe({
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
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x)
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
                idModalidad:program.idModalidadHijo
              };
              console.log(this.json)
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
    console.log(this.json.idModalidad);
    var mod=0
    if(this.json.idModalidad!=1){
      mod=-2
    }
    if(this.videosOnline!=undefined && this.videosOnline.length>0 && this.videosOnline!=null){
      mod+=1
    }
    if(tabChangeEvent.index == (5+mod)){
      this.AyudaActive=true
    }
    if(tabChangeEvent.index < (5+mod)){
      this.AyudaActive=false

    }

  }
  returnback(){
    this._SessionStorageService.SessionSetValue('cursoIndex','1');
  }
  cambio(mas:number){
    console.log(mas)
    this.tabIndex+=mas
  }
  InterraccionTab(nombre:string){

    this._HelperService.enviarMsjAcciones({Tag:'Tab',Nombre:nombre})
  }
}
