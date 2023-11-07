import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ParametrosEstructuraEspecificaDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import {
  CursoPadreDTO,
  ProgresoAlumnoProgramaAulaVirtualDTO,
} from 'src/app/Core/Models/ListadoProgramaContenidoDTO';
import { AlumnosTest } from 'src/app/Core/Shared/AlumnosTest';
import { ChargeComponent } from 'src/app/Core/Shared/Containers/Dialog/charge/charge.component';
import { AsistenciaService } from 'src/app/Core/Shared/Services/Asistencia/asistencia.service';
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

  @ViewChild('indicaciones') indicaciones!: ElementRef;
  @ViewChild('sesiones') sesiones!: ElementRef;
  @ViewChild('modulos') modulos!: ElementRef;
  @ViewChild('Online') Online!: ElementRef;
  @ViewChild('proyectos') proyectos!: ElementRef;
  @ViewChild('certificados') certificados!: ElementRef;
  @ViewChild('tramites') tramites!: ElementRef;
  @ViewChild('webinars') webinars!: ElementRef;
  @ViewChild('beneficios') beneficios!: ElementRef;

  constructor(
    private _HelperService: HelperService,
    private _ProgramaContenidoService: ProgramaContenidoService,
    private _ActivatedRoute: ActivatedRoute,
    private _DatosPerfilService:DatosPerfilService,
    private _SessionStorageService:SessionStorageService,
    private _CertificadoService:CertificadoService,
    public dialog: MatDialog,
    private _AsistenciaService: AsistenciaService,
    private _AlumnosTest:AlumnosTest,
  ) {}
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public tabIndex = 0;
  public IndicacionActive = false;
  public CertificadoActive = false;
  public CertificadoActiveCarreras = false;
  public hide=false

  public indexIndicacions=0
  public indexAyuda=0
  public indexCertificado=0
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
  public AyudaActive=false
  public alertaPreguntasFrecuentes=false
  public alertaQuejasSugerencias=false
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
  TitleMenu="menu"
  public estructuraCapitulo:any;
  public curso:any
  public EsCurso:any
  public videoPreguntas ='https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/preguntas/preguntas-hombres.mp4';
  public videoCrucigramas ='https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/crucigrama/crucigrama-hombre.mp4';
  public videoTareas =''//'https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/preguntas/preguntas-hombres.mp4';
  public videoTrabajoP =''//'https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/guias/preguntas/preguntas-hombres.mp4';
  public datosCertificado:any;
  public alertaDigital=false;
  public alertaFisico=false;
  public generateCertificado=true
  public ircas:any
  public videosOnline:Array<any>=[]
  public asistencias:any
  public IdModalidadPrincipal=0
  public IdTipoProgramaCarrera=0
  public EsCarrera=false
  public ExamenActivo=false
  public ProyectoActivo=false
  public MostrarMensajeRecuerda=false;
  public contenidotarea=
  '<iframe src="https://player.vimeo.com/video/737713694?h=ce19c25ba1" width="100%" height="564" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>'
  public contenidotareapares=
  '<iframe src="https://player.vimeo.com/video/737722683?h=e768e2bbcc" width="100%"  height="564" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>'
  ngOnInit(): void {
    this._ActivatedRoute.params.pipe(
      takeUntil(this.signal$)
    ).subscribe({
      next: (x) => {
        this.idMatricula = parseInt(x['IdMatricula']);
        this.ActualizarTareaParametroEvaluacionProyectosNota()
        this.RegistroProgramaMatriculadoPorIdMatricula();
        this.VerificarCursosCongelados();
        //this.ObtenerListadoProgramaContenido();
        this.ObtenerDatosCertificado();
        this.ObtenerDatosCertificadoIrcaEnvio();
      },
    });
    this._HelperService.recibirActivarTipoExamen().pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.ExamenActivo=false
        this.ProyectoActivo=false
        this.tabIndex++
        if(x==1){
          this.ExamenActivo=true
        }
        if(x==2){
          this.ProyectoActivo=true
        }
        console.log(x)
      },
    });
    this._HelperService.recibirActivarTrabajoTipoExamenCarrera().pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        console.log(x)
        this.tabIndex=3
        console.log(this.tabIndex)
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

  ObtenerAsistenciasAlumnoOnline(){
    console.log(this.programEstructura.listaCursoMatriculado)
    if(this.IdTipoProgramaCarrera==2){
      this._AsistenciaService.ObtenerAsistenciasAlumnoOnlineCarrerasProfesionales(this.idMatricula, this.programEstructura.idPEspecifico).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          this.asistencias=x
        }
      })
    }
    else{
      this._AsistenciaService.ObtenerAsistenciasAlumnoOnline(this.idMatricula, this.programEstructura.idPEspecifico).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          this.asistencias=x
        }
      })
    }
  }
  ObtenerDatosCertificadoIrcaEnvio(){
    this._CertificadoService.ObtenerDatosCertificadoIrcaEnvio(this.idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.ircas=x
      }
    })
  }
  Redirect(){

    var valorLoscalS=this._SessionStorageService.SessionGetValue('cursoIndex')==''?0:parseInt(this._SessionStorageService.SessionGetValue('cursoIndex'))
    console.log(valorLoscalS);
    console.log(this.modulos);
    if(valorLoscalS<2){
      if(this.curso.claseWebexActivo==true){
        this.Online.nativeElement.click()
      }else{
        if(this.EsCurso==true){
          this.sesiones.nativeElement.click()
        }else{
          this.modulos.nativeElement.click()
        }
      }
    }else{
      if(valorLoscalS==2){
        if(this.proyectos!=undefined){
          this.proyectos.nativeElement.click()
        }
      }
      if(valorLoscalS==3){
        if(this.certificados!=undefined){
          this.certificados.nativeElement.click()
        }
      }
      if(valorLoscalS==4){
        if(this.tramites!=undefined){
          this.tramites.nativeElement.click()
        }
      }
      if(valorLoscalS==5){
        if(this.webinars!=undefined){
          this.webinars.nativeElement.click()
        }
      }
      if(valorLoscalS==6){
        if(this.beneficios!=undefined){
          this.beneficios.nativeElement.click()
        }
      }
    }
    this._SessionStorageService.SessionDeleteValue('cursoIndex');
    this.dialogRef.close();
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
  listaRegistroVideoSesionProgramaSincronico(){
    this._ProgramaContenidoService.listaRegistroVideoSesionProgramaSincronico(this.curso.idPEspecifico).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.videosOnline=x
        console.log(x)
      }
    })
  }

  certificadoDigital(){
    console.log('-------')
    if(this.datosCertificado!=undefined){
      if(!(this.datosCertificado.nombreArchivo!=null &&(
        this.datosCertificado.idEstado_matricula==5 ||
        this.datosCertificado.idEstado_matricula==12))){
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

    var esirca=0
    if(this.ircas!=undefined && this.ircas.length>0){
      esirca=1
    }
    var OpenCertificado=0

    if(this.CertificadoActive==true){
      OpenCertificado=2
    }
    if (this.indexIndicacions>0 && (tabChangeEvent.index >= this.indexIndicacions+5 || tabChangeEvent.index <= this.indexIndicacions) &&
      this.IndicacionActive == true
    ) {
      this.IndicacionActive = false;
      //this.tabIndex=this.indexIndicacions
      console.log(this.tabIndex)
    }
    if(this.AyudaActive==true){
      if(this.indexAyuda==0){
        this.indexAyuda=this.tabIndex-(esirca+OpenCertificado)

      }
      console.log(this.indexAyuda )
      if (this.indexAyuda>0 && (tabChangeEvent.index >= this.indexAyuda+3 || tabChangeEvent.index < this.indexAyuda))
      {
        this.AyudaActive = false;
        this.indexAyuda=0
        console.log(this.tabIndex)
      }
    }
    // var masindicacion=0
    // if(this.IndicacionActive){
    //   masindicacion=4
    // }
    // var noesAonline=0
    // if(this.programEstructura.idModalidad!=1){
    //   masindicacion=-1
    //   noesAonline=-1
    // }
    // var TProyecto=0
    // if(this.curso.proyectoAplicacion){
    //   TProyecto=1
    // }
    console.log(esirca)
    //var escurso=0
    // if(this.EsCurso==true){
    //   escurso=3
    // }
    if(this.CertificadoActive==true){
      if(this.indexCertificado==0){
        this.indexCertificado=this.tabIndex
      }
      console.log(this.indexCertificado )
      if (this.indexCertificado>0 && (tabChangeEvent.index >= (this.indexCertificado+3+esirca) || tabChangeEvent.index < this.indexCertificado))
      {
        this.CertificadoActive = false;
        this.indexCertificado=0
        if(tabChangeEvent.index < this.indexCertificado){
          this.tabIndex-=(2+esirca)
        }
        console.log(this.tabIndex)
      }
    }
  }

  ProgresoProgramaCursosAulaVirtualAonlinePorEstadoVideo() {
    this._ProgramaContenidoService
      .ProgresoProgramaCursosAulaVirtualAonlinePorEstadoVideo(this.idMatricula)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          console.log(x)
        },
        complete:()=>{
        }
      });
  }
  InterraccionTab(nombre:string){

    this._HelperService.enviarMsjAcciones({Tag:'Tab',Nombre:nombre})
  }
  actual(e: any) {
    console.log(e);
  }
  changeIndexIndicaciones(index: number) {
    if(this.indexIndicacions==0){
      this.indexIndicacions=this.tabIndex
    }
    this.IndicacionActive = true;
    this.tabIndex = this.indexIndicacions+index;
  }
  changeIndexAyuda() {
    // if(this.indexAyuda==0){
    //   this.indexAyuda=this.tabIndex
    // }
    this.AyudaActive = true;
    console.log(this.indexAyuda)
  }
  changeIndexCertificado() {
    this.CertificadoActive = true;
    console.log(this.indexCertificado)
  }
  public dialogRef:any;
  RegistroProgramaMatriculadoPorIdMatricula(){
    //document.documentElement.scrollTop=0;

    this._DatosPerfilService.RegistroProgramaMatriculadoPorIdMatricula(this.idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this._HelperService.enviarMsjChat({
          idMatriculaCabecera:x.idMatriculaCabecera,
          idprogramageneralalumno:x.idPGeneral,
          idcoordinadora:x.idAsesor,
          idcentrocosto:x.idCentroCosto
        });
        x.claseWebexActivo=true;
        this.curso=x
        this.IdTipoProgramaCarrera=x.idTipoProgramaCarrera
        this.EsCarrera=this._AlumnosTest.PermisosCarrea(this.curso.idAlumno);
        console.log('EsCarrera', this.EsCarrera)
        this.ObtenerListadoProgramaContenido();
        this.CongelarCursoMatriculaCarrera()
        // if(this.curso!=undefined ){
        //   if(valorLoscalS>1){
        //     if(this.curso.proyectoAplicacion){
        //       this.tabIndex=valorLoscalS;
        //     }else{
        //       this.tabIndex=valorLoscalS-1
        //     }
        //   }
        //   if(this.curso.proyectoAplicacion){
        //     if(valorLoscalS>4){
        //       if(this.curso.webibarActivo){
        //         this.tabIndex=valorLoscalS;
        //       }else{
        //         this.tabIndex=valorLoscalS-1
        //       }
        //     }
        //   }else{
        //     if(valorLoscalS>3){
        //       if(this.curso.webibarActivo){
        //         this.tabIndex=valorLoscalS;
        //       }else{
        //         this.tabIndex=valorLoscalS-1
        //       }
        //     }

        //   }
        //   this.tabIndex=valorLoscalS;
        //   console.log(this.tabIndex)
        // }


      }
    })
  }
  ObtenerListadoProgramaContenido() {
     this.dialogRef =this.dialog.open(ChargeComponent,{
      panelClass:'dialog-charge',
      disableClose:true
    });
    if(this.IdTipoProgramaCarrera==2){
      this._ProgramaContenidoService
      .ObtenerListadoProgramaContenidoCarrerasProfesionales(this.idMatricula)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.programEstructura = x;
          this.IdModalidadPrincipal=x.idModalidad
          console.log(this.programEstructura)
          if(this.programEstructura.listaCursoMatriculado!=null && this.programEstructura.listaCursoMatriculado.length>1){
            this.EsCurso=false
            this.TitleMenu="MENU DEL CURSO"
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
            this.ObtenerAsistenciasAlumnoOnline();
          }else{
            this.ProgresoProgramaCursosAulaVirtualAonlinePorEstadoVideo()
            this.EsCurso=true
            this.json = {
              AccesoPrueba: false,
              IdMatriculaCabecera: x.idMatriculaCabecera,
              IdPEspecificoPadre: x.idPEspecifico,
              IdPGeneralPadre: x.idPGeneral,
              IdPEspecificoHijo: this.programEstructura.listaCursoMatriculado==null?0:this.programEstructura.listaCursoMatriculado[0].idPEspecificoHijo,
              IdPGeneralHijo: this.programEstructura.listaCursoMatriculado==null?0:this.programEstructura.listaCursoMatriculado[0].idPGeneralHijo,
              NombreCapitulo:this.programEstructura.listaCursoMatriculado==null?'':this.programEstructura.listaCursoMatriculado[0].programaGeneralHijo,
              NombrePrograma:x.programaGeneral,
              idModalidad:this.programEstructura.listaCursoMatriculado==null?0:this.programEstructura.listaCursoMatriculado[0].idModalidadHijo
            };
            console.log(this.json)
            this.migaPan.push(
            // {
            //   titulo:this.json.NombrePrograma,
            //   urlWeb:'/AulaVirtual/MisCursos/'+this.json.IdMatriculaCabecera
            // },
            {
              titulo:this.json.NombreCapitulo,
              urlWeb:'/AulaVirtual/MisCursos/'+this.json.IdMatriculaCabecera
            })
            this._HelperService.enviarMsjChat({
              idMatriculaCabecera:x.idMatriculaCabecera,
              idprogramageneralalumno:x.idPGeneral,
              idcoordinadora:x.idAsesor,
              idcentrocosto:x.idCentroCosto,
              idcursoprogramageneralalumno:this.programEstructura.listaCursoMatriculado==null?0:this.programEstructura.listaCursoMatriculado[0].idPGeneralHijo
            });
            this.ObtenerEstructuraEspecificaCurso();
            this.listaRegistroVideoSesionProgramaSincronico()
          }
          setTimeout(() => {
            this.Redirect();
          }, 1000);

        },
      });
    }
    else{
      this._ProgramaContenidoService
      .ObtenerListadoProgramaContenido(this.idMatricula)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.programEstructura = x;
          this.IdModalidadPrincipal=x.idModalidad
          console.log(this.programEstructura)
          if(this.programEstructura.listaCursoMatriculado!=null && this.programEstructura.listaCursoMatriculado.length>1){
            this.EsCurso=false
            this.TitleMenu="MENU DEL CURSO"
            this.programEstructura.listaCursoMatriculado.sort(function (a:any, b:any) {
              return a.orden - b.orden;
            })
            this.migaPan.push(
              {
                titulo: this.programEstructura.programaGeneral,
                urlWeb: '/AulaVirtual/MisCursos/'+this.idMatricula,
              },)

            this.programEstructura.listaCursoMatriculado.forEach((program) => {
              if(program.idModalidadHijo==1){
                this.MostrarMensajeRecuerda=true;
              }
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
            this.ObtenerAsistenciasAlumnoOnline();
          }else{
            this.ProgresoProgramaCursosAulaVirtualAonlinePorEstadoVideo()
            this.EsCurso=true
            this.json = {
              AccesoPrueba: false,
              IdMatriculaCabecera: x.idMatriculaCabecera,
              IdPEspecificoPadre: x.idPEspecifico,
              IdPGeneralPadre: x.idPGeneral,
              IdPEspecificoHijo: this.programEstructura.listaCursoMatriculado==null?0:this.programEstructura.listaCursoMatriculado[0].idPEspecificoHijo,
              IdPGeneralHijo: this.programEstructura.listaCursoMatriculado==null?0:this.programEstructura.listaCursoMatriculado[0].idPGeneralHijo,
              NombreCapitulo:this.programEstructura.listaCursoMatriculado==null?'':this.programEstructura.listaCursoMatriculado[0].programaGeneralHijo,
              NombrePrograma:x.programaGeneral,
              idModalidad:this.programEstructura.listaCursoMatriculado==null?0:this.programEstructura.listaCursoMatriculado[0].idModalidadHijo
            };
            console.log(this.json)
            this.migaPan.push(
            // {
            //   titulo:this.json.NombrePrograma,
            //   urlWeb:'/AulaVirtual/MisCursos/'+this.json.IdMatriculaCabecera
            // },
            {
              titulo:this.json.NombreCapitulo,
              urlWeb:'/AulaVirtual/MisCursos/'+this.json.IdMatriculaCabecera
            })
            this._HelperService.enviarMsjChat({
              idMatriculaCabecera:x.idMatriculaCabecera,
              idprogramageneralalumno:x.idPGeneral,
              idcoordinadora:x.idAsesor,
              idcentrocosto:x.idCentroCosto,
              idcursoprogramageneralalumno:this.programEstructura.listaCursoMatriculado==null?0:this.programEstructura.listaCursoMatriculado[0].idPGeneralHijo
            });
            this.ObtenerEstructuraEspecificaCurso();
            this.listaRegistroVideoSesionProgramaSincronico()
          }
          setTimeout(() => {
            this.Redirect();
          }, 1000);

        },
      });
    }
  }
  ObtenerEstructuraEspecificaCurso(){
    if(this.json.idModalidad==1){
      this._ProgramaContenidoService.ObtenerEstructuraEspecificaCurso(this.json).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          this.estructuraCapitulo=x
          this._SessionStorageService.SetEstructura(this.estructuraCapitulo);
          console.log(this.estructuraCapitulo)

        }
      })
    }
    else{
      this._ProgramaContenidoService.ObtenerEstructuraEspecificaCursoSincronico(this.json).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          this.estructuraCapitulo=x
          this._SessionStorageService.SetEstructura(this.estructuraCapitulo);
          console.log(this.estructuraCapitulo)

        }
      })
    }
  }
  ActualizarTareaParametroEvaluacionProyectosNota(){
    this._ProgramaContenidoService.ActualizarTareaParametroEvaluacionProyectosNota(this.idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
      }
    })
  }
  cambio(mas:number){
    console.log(mas)
    this.tabIndex+=mas
  }
  EventoInteraccionButton(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:"Button",Nombre:nombre,Seccion:'Indicaciones'})
  }
  VerificarCursosCongelados(){
    this._ProgramaContenidoService.VerificarCursosCongelados(this.idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log('verificado')
      }
    })
  }
  redireccionarBiblioteca(){
    window.open("https://www.oreilly.com/member/login/",'_blank');

  }
  CongelarCursoMatriculaCarrera(){
    this._ProgramaContenidoService.CongelarCursoCarrerasProfesionales(this.idMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log('verificado')
      }
    })
  }
}
