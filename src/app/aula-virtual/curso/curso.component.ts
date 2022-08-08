import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import {
  CursoPadreDTO,
  ProgresoAlumnoProgramaAulaVirtualDTO,
} from 'src/app/Core/Models/ListadoProgramaContenidoDTO';
import { CertificadoService } from 'src/app/Core/Shared/Services/Certificado/certificado.service';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CursoComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  constructor(
    private _HelperService: HelperService,
    private _ProgramaContenidoService: ProgramaContenidoService,
    private _ActivatedRoute: ActivatedRoute,
    private _DatosPerfilService:DatosPerfilService,
    private _SessionStorageService:SessionStorageService,
    private _CertificadoService:CertificadoService
  ) {}
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public tabIndex = 0;
  public IndicacionActive = false;
  public CertificadoActive = false;
  public hide=false
  public migaPan = [
    {
      titulo: 'Mis Cursos',
      urlWeb: '/AulaVirtual/MisCursos',
    }
  ];
  public imgsIndocaciones=[
    'preguntas-naranja-38.svg',
    'crucigrama-naranja-39.svg',
    'tareas-naranja-40.svg',
    'tareas-pares-naranja-41.svg',
  ]
  public idMatricula = 0;
  public datos: any;
  public programEstructura: CursoPadreDTO = {
    idAlumno: 0,
    idMatriculaCabecera: 0,
    idModalidad: 0,
    idPEspecifico: 0,
    idPGeneral: 0,
    listaCursoMatriculado: [],
    modalidad: '',
    programaGeneral: '',
  };
  public curso:any
  public videoPreguntas ='https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/preguntas/preguntas-hombres.mp4';
  public videoCrucigramas ='https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/crucigrama/crucigrama-hombre.mp4';
  public videoTareas =''//'https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/preguntas/preguntas-hombres.mp4';
  public videoTrabajoP =''//'https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/preguntas/preguntas-hombres.mp4';
  public datosCertificado:any;
  public alertaDigital=false;
  public alertaFisico=false;
  public generateCertificado=true
  public contenidotarea=
  'Primero revisa las instrucciones acerca de la tarea. En estas, se te indicará los objetivos de desempeño, la'+
  'descripción de la tarea, los entregables, información complementaria y los criterios de evaluación de la tarea.'+
  'Una vez completes tu tarea, recuerda que el nombre del archivo no debe contener caracteres especiales (como tildes y '+
  'símbolos).'+
  'También debes asegurarte que el archivo esté en formato .doc o .pdf y que no pese más de 150 mb.'+
  'Luego haz clic en el botón de “Seleccionar archivo” y elige el archivo de tu tarea.'+
  'Una vez se carga, verifica que sea el archivo correcto y haz clic en “Enviar”'+
  '¡Listo! Recibirás tu calificación en un plazo no mayor a 15 días.'+
  'Próximamente añadiremos un video sobre estas indicaciones.'
  public contenidotareapares='Las tareas de pares son las tareas de tus compañeros, y así como tú calificarás su tarea, ellos'+
  'calificarán la tuya, siguiendo la escala de calificación de acuerdo al cumplimiento de los'+
  'objetivos de desempeño.'+
  'Primero descarga el archivo y recuerda que debes hacerlo antes de la fecha límite.'+
  'Revisa el archivo y la escala de calificación que usarás para puntuar la tarea.'+
  'Finalmente, selecciona la calificación para cada criterio de evaluación y haz clic en Calificar.'+
  'Próximamente añadiremos una explicación en vídeo de estas indicaciones.'
  ngOnInit(): void {
    this._ActivatedRoute.params.pipe(
      takeUntil(this.signal$)
    ).subscribe({
      next: (x) => {
        this.idMatricula = parseInt(x['IdMatricula']);
        this.RegistroProgramaMatriculadoPorIdMatricula();
        this.ObtenerListadoProgramaContenido();
        this.ObtenerDatosCertificado();
      },
    });
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {

        this.datos = x;
        if (x.datosAlumno.idGenero != 2) {
          this.videoPreguntas ='https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/preguntas/preguntas-mujeres.mp4';
          this.videoCrucigramas ='https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/crucigrama/crucigrama-mujer.mp4';
          this.videoTareas =''//https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/preguntas/preguntas-hombres.mp4';
          this.videoTrabajoP =''//'https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/preguntas/preguntas-hombres.mp4';
        }
      },
    });

  }
  ObtenerDatosCertificado(){
    this._CertificadoService.ObtenerDatosCertificadoEnvio(this.idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(this.datosCertificado!=undefined){
          this.datosCertificado=x
          this.generateCertificado=false;
        }
        this.datosCertificado=x
      }
    })
  }
  certificadoDigital(){
    console.log('-------')
    if(this.datosCertificado!=undefined){
      if((this.datosCertificado.idEstado_matricula!=5 && this.datosCertificado.idEstado_matricula!=12) || this.datosCertificado.nombreArchivo==null){
        this.alertaDigital=false
        this.alertaDigital=true
      }
    }
  }
  certificadoFisico(){
    if(this.datosCertificado!=undefined){
      if(this.datosCertificado.nombreArchivo==null){
        this.alertaFisico=true
      }
    }

  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);
    if (
      (tabChangeEvent.index >= 5 || tabChangeEvent.index == 0) &&
      this.IndicacionActive == true
    ) {
      this.IndicacionActive = false;
      this.tabIndex-=4
      console.log(this.tabIndex)
    }
    var masindicacion=0
    if(this.IndicacionActive){
      masindicacion=4
    }
    var noesAonline=0
    if(this.programEstructura.idModalidad!=1){
      masindicacion=-1
      noesAonline=-1
    }
    if(this.curso!=undefined && this.curso.proyectoAplicacion){
      if((tabChangeEvent.index >= (6+noesAonline) || tabChangeEvent.index < (3+noesAonline))  && this.CertificadoActive){
        this.CertificadoActive=false
        if(tabChangeEvent.index >= (6+noesAonline)){
          this.tabIndex-=2
        }
      }
      if(tabChangeEvent.index == (3+masindicacion) && !this.CertificadoActive){
        this.CertificadoActive=true
      }
    }else{
      if((tabChangeEvent.index >= (5+noesAonline) || tabChangeEvent.index < (2+noesAonline))   && this.CertificadoActive){
        this.CertificadoActive=false
        if(tabChangeEvent.index >= (5+noesAonline)){
          this.tabIndex-=2
        }
      }
      if(tabChangeEvent.index == (2+masindicacion) && !this.CertificadoActive){
        this.CertificadoActive=true
      }
    }
  }
  actual(e: any) {
    console.log(e);
  }
  changeIndexIndicaciones(index: number) {
    this.IndicacionActive = true;
    this.tabIndex = index;
  }
  RegistroProgramaMatriculadoPorIdMatricula(){
    this._DatosPerfilService.RegistroProgramaMatriculadoPorIdMatricula(this.idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.curso=x
        var valorLoscalS=this._SessionStorageService.SessionGetValue('cursoIndex')==''?0:parseInt(this._SessionStorageService.SessionGetValue('cursoIndex'))
        if(this.curso!=undefined ){
          if(this.curso!=undefined ){
            if(valorLoscalS>1){
              if(this.curso.proyectoAplicacion){
                this.tabIndex=valorLoscalS;
              }else{
                this.tabIndex=valorLoscalS-1
              }
            }
            if(this.curso.proyectoAplicacion){
              if(valorLoscalS>4){
                if(this.curso.webibarActivo){
                  this.tabIndex=valorLoscalS;
                }else{
                  this.tabIndex=valorLoscalS-1
                }
              }
            }else{
              if(valorLoscalS>3){
                if(this.curso.webibarActivo){
                  this.tabIndex=valorLoscalS;
                }else{
                  this.tabIndex=valorLoscalS-1
                }
              }

            }
            this.tabIndex=valorLoscalS;
            console.log(this.tabIndex)
          }
        }

        this._SessionStorageService.SessionDeleteValue('cursoIndex');

      }
    })
  }
  ObtenerListadoProgramaContenido() {
    this._ProgramaContenidoService
      .ObtenerListadoProgramaContenido(this.idMatricula)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.programEstructura = x;
          console.log(this.programEstructura)
          this.programEstructura.listaCursoMatriculado.sort(function (a:any, b:any) {
            return a.orden - b.orden;
          })
          this.migaPan.push(
            {
              titulo: this.programEstructura.programaGeneral,
              urlWeb: '/AulaVirtual/MisCursos/'+this.idMatricula,
            },)

          this.programEstructura.listaCursoMatriculado.forEach((program) => {
            var params: ParametrosEstructuraEspecificaDTO = {
              AccesoPrueba: false,
              IdMatriculaCabecera: this.programEstructura.idMatriculaCabecera,
              IdPEspecificoPadre: this.programEstructura.idPEspecifico,
              IdPGeneralPadre: this.programEstructura.idPGeneral,
              IdPEspecificoHijo: program.idPEspecificoHijo,
              IdPGeneralHijo: program.idPGeneralHijo,
              NombreCapitulo:program.programaGeneralHijo,
              NombrePrograma:this.programEstructura.programaGeneral,
              idModalidad:this.programEstructura.idModalidad
            };
            console.log(params)
            program.params = btoa(encodeURIComponent(JSON.stringify(params)));
          });
        },
      });
  }
}
