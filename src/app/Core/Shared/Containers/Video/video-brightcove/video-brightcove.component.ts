import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CloudflareStreamComponent, CloudflareStreamService } from '@cloudflare/stream-angular';
import { Subject, takeUntil } from 'rxjs';
import { ParametrosEstructuraEspecificaDTO, RegistroVideoUltimaVisualizacionDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { GrupoPreguntaFiltroDTO, RegistroPreguntaDTO, ValidaRespuestaPreguntaDTO } from 'src/app/Core/Models/PreguntaInteractivaDTO';
import { HelperService } from '../../../Services/helper.service';
import { PreguntaInteractivaService } from '../../../Services/PreguntaInteractiva/pregunta-interactiva.service';
import { SnackBarServiceService } from '../../../Services/SnackBarService/snack-bar-service.service';
import { VideoSesionService } from '../../../Services/VideoSesion/video-sesion.service';
declare var $:any;
import videojs from 'video.js';
@Component({
  selector: 'app-video-brightcove',
  templateUrl: './video-brightcove.component.html',
  styleUrls: ['./video-brightcove.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VideoBrightcoveComponent implements OnInit, OnChanges,AfterViewInit,OnDestroy {
  private signal$ = new Subject();
  @ViewChild('video')
  video!: ElementRef;
  @ViewChild('videoCloud')
  videoCloud!: CloudflareStreamComponent;

  constructor(
    public _VideoSesionService:VideoSesionService,
    public _PreguntaInteractivaService:PreguntaInteractivaService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _HelperService:HelperService
  ) {}
  ngOnDestroy(): void {
    clearTimeout(this.timeo)
    clearTimeout(this.timeo2)
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngAfterViewInit(): void {
  }
  OnError(e:any){
    console.log(e)
  }
  @Input()
  public videoData: any;
  @Input() nextChapter:any;
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Output() OnFin: EventEmitter<void> = new EventEmitter<void>();
  public tipo = 2;
  public urlDiapo = '';
  public diapositivas: Array<any> = [];
  public init = -1;
  public lather = 0;
  public whidth = 0;
  public down=false;
  public tiempovideoinicio=0
  public tiempovideoinicioInicial=0
  public tiempovideo=0;
  public tiempoactualvideo:number=0;
  public diapositivaactual=0;
  public numeroDiapositivas=0;
  public autoplay=false
  public guardar=false;
  public valorRespuesta=''
  public valorRespuestaNumero=0
  public capituloEv=-1;
  public indiceDiapositiva=-1;
  public finish=false
  public animation=0
  public estadoFinalizarPreguntas=false
  public valueCount=3
  // +++ Set the data for the player +++
  playerData = {
    accountId: '6267108632001',
    playerId: 'rEr9tuuTvS',
    videoId: '6306336229112',
  };
  @Input() idSesion=0;
  @Input() idCapitulo=0;
  @Input() json: ParametrosEstructuraEspecificaDTO = {
    AccesoPrueba: false,
    IdMatriculaCabecera: 0,
    IdPEspecificoPadre: 0,
    IdPGeneralPadre: 0,
    IdPEspecificoHijo: 0,
    IdPGeneralHijo: 0,
    NombreCapitulo: '',
    NombrePrograma: '',
    idModalidad:1
  };
  public send:RegistroVideoUltimaVisualizacionDTO={
    accesoPrueba:false,
    id:0,
    idCapitulo:0,
    idPEspecificoHijo:0,
    idPEspecificoPadre:0,
    idPGeneral:0,
    idPrincipal:0,
    idSesion:0,
    tiempoVisualizacion:0,
  }
  public paramsPreguntas:GrupoPreguntaFiltroDTO={
    GrupoPregunta:'',
    IdPgeneral:0,
    IdPEspecifico:0
  }
  public validatePregunta:ValidaRespuestaPreguntaDTO={
    IdPEspecifico:0,
    IdPGeneral:0,
    IdPregunta:0,
    IdRespuesta:[],
    Texto:null,
    AccesoPrueba:false
  }
  public finalizarPerguntas:RegistroPreguntaDTO={
    IdAccesoPrueba:false,
    IdPEspecifico:0,
    IdPEspecificoPadre:0,
    IdPGeneral:0,
    IdPregunta:'',
    IdPrincipal:0,
    IdRespuesta:'',
    IdSexo:0,
    Texto:'',

  }
  public grupo=''
  public chargePreguntas=true;
  public preguntas:any;
  public preguntaActual=0;
  public valPregunta=false
  public feedCorrecto=''
  public miPerfil:any
  public finalizado=false;
  public videoFinal=''
  public videocontinuar=false
  public cargaFinalizado=false;
  public timeo:any
  public timeo2:any
  public GetTIme:any;
  public TiempoRestante=3000;
  public ValidandoPreguntas=false
  player!: videojs.Player;
  options:{
    fluid: boolean,
    aspectRatio: string,
    autoplay: boolean,
    sources: {
        src: string,
        type: string,
    }[],
}={
  autoplay: true, sources: [{ src: '/path/to/video.mp4', type: 'video/mp4' }],
  fluid: false,
  aspectRatio: '16:9'
};
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.miPerfil=x
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.videoData != undefined) {
      if(this.videoData.objetoConfigurado.idVideoBrightcove!='0' &&
      this.videoData.objetoConfigurado.idVideoBrightcove!=null &&
      this.videoData.objetoConfigurado.idVideoBrightcove!=undefined){
        console.log(this.videoData.objetoConfigurado.idVideoBrightcove)
        this.addPlayer();
      }else{
        this.videoData.url='https://iframe.videodelivery.net/'+this.videoData.idVideo
      }
      if( this.videoData.objetoConfigurado.idVideoBrightcove!='' && this.videoData.objetoConfigurado.idVideoBrightcove!=null){
        this.playerData.videoId=this.videoData.objetoConfigurado.idVideoBrightcove
      }
      var porcentage=(this.videoData.tiempoVisualizado*100)/this.videoData.tiempoTotalVideo
      console.log(porcentage)
      if(Math.ceil(porcentage)>98){
        this.tiempovideoinicio=0
      }else{
        this.tiempovideoinicio=this.videoData.tiempoVisualizado
      }
      this.tiempovideoinicioInicial=Math.ceil(this.videoData.tiempoVisualizado)
      this.tiempovideo=this.videoData.tiempoTotalVideo
      this.tiempoactualvideo=this.videoData.tiempoVisualizado
      console.log(this.video)
     // this.video.nativeElement.setCurrentTime=this.tiempoactualvideo;
      this.diapositivas = this.videoData.objetoConfigurado.configuracion;
      var tiempo=0
      var i=1
      var j=0
      console.log(this.diapositivas)
      this.diapositivas.forEach((x) => {

        if (x.tiempo<=this.tiempovideoinicio) {
          if(x.tipoVista!=4){
            this.diapositivaactual++;
          }
          if(x.tiempo>=tiempo){
            tiempo=x.tiempo
            this.indiceDiapositiva=j;
            this.urlDiapo = x.rutaDiapositiva;
            if(x.tipoVista==4){
              if(parseInt(x.estadoEval)!=1){
                this.capituloEv=parseInt(x.nroDiapositiva)
                this.tipo = x.tipoVista
              }
            }else{
              this.tipo = x.tipoVista
            }
            this.grupo=x.urlEvaluacion
          }
        }
        if(x.tipoVista!=4){
          this.numeroDiapositivas++;
          i++;
        }
        j++;
      });
      if(this.tipo==4){
        this.ListaRegistroPreguntaInteractivaPorGrupo();
      }
    }
  }
  pruebachange(event:any){
    console.log(this.valorRespuestaNumero)
    event.preventDefault();
  }
  pruebaup(event:any){
    console.log('------')
    event.preventDefault();
  }
  continuarVideo(){
    var time=0
    var tiempo=0
    console.log(this.capituloEv)
    this.finalizado=false
    this.valPregunta=false
    this.videocontinuar=false
    var i=0;
    this.diapositivas.forEach(x=>{
      if(x.nroDiapositiva==this.capituloEv && parseInt(x.tipoVista)==4 && this.indiceDiapositiva==i){
        x.estadoEval=1;
        time=x.tiempo;

        this.tiempovideoinicio=x.tiempo;
      }
      i++;
    })
    i=0;
    this.diapositivas.forEach(x=>{

      if (x.tiempo<=time) {
        if(x.tiempo>=tiempo){
          tiempo=x.tiempo
          this.indiceDiapositiva=i;
          this.urlDiapo = x.rutaDiapositiva;
          if(x.tipoVista==4){
            if(parseInt(x.estadoEval)!=1){
              this.capituloEv=parseInt(x.nroDiapositiva)
              this.tipo = x.tipoVista
            }
          }else{
            this.tipo = x.tipoVista
          }
          this.grupo=x.urlEvaluacion
        }
      }
      i++;
    })
    this.tipo
    this.playVideo()
    console.log(this.diapositivas)
  }
  chageRespuesta(index:number,tipo:number){
    if(!this.valPregunta){
      this.validatePregunta.IdPregunta=this.preguntas[this.preguntaActual].idPregunta
      this.validatePregunta.IdPGeneral=this.json.IdPGeneralHijo;
      this.validatePregunta.IdPEspecifico=this.json.IdPEspecificoHijo;
      this.validatePregunta.IdRespuesta=[];
      var value=this.preguntas[this.preguntaActual].respuestaGrupoPreguntaInteractivaPrograma[index].check;
      if(tipo!=4){
        this.preguntas[this.preguntaActual].respuestaGrupoPreguntaInteractivaPrograma.forEach((res:any) => {
          res.check=false;
        });
        this.preguntas[this.preguntaActual].respuestaGrupoPreguntaInteractivaPrograma[index].check=true
      }else{
        this.preguntas[this.preguntaActual].respuestaGrupoPreguntaInteractivaPrograma[index].check=!value;
      }

      let i=0
      this.preguntas[this.preguntaActual].respuestaGrupoPreguntaInteractivaPrograma.forEach((res:any) => {
        console.log(res.check);
        res.checkAnteriorError=false
        res.checkAnteriorCorrecto=false
        if(res.check==true){
          this.validatePregunta.IdRespuesta.push(res.idRespuesta)
          i++;
        }
      });
      console.log(i)
      console.log(this.preguntas)
      console.log(this.preguntas[this.preguntaActual].numeroRespuestas)
      if(i==this.preguntas[this.preguntaActual].numeroRespuestas){
        this.ValidarPreguntaInteractiva();
      }
    }
  }
  public esnumero=false
  ValidarNumero(){
    console.log(parseInt(this.valorRespuesta))
    console.log(isNaN(parseInt(this.valorRespuesta)))
    this.esnumero=!isNaN(parseInt(this.valorRespuesta))
  }
  ResponderTexto(){
    console.log(this.valPregunta)
    if(!this.valPregunta){
      this.validatePregunta.IdPregunta=this.preguntas[this.preguntaActual].idPregunta
      this.validatePregunta.IdPGeneral=this.json.IdPGeneralHijo;
      this.validatePregunta.IdPEspecifico=this.json.IdPEspecificoHijo;
      this.validatePregunta.Texto=this.valorRespuesta.toString();
      console.log(this.validatePregunta)
      this.ValidarPreguntaInteractiva();
    }
  }
  finalizarPreguntas(){
    this.feedCorrecto=''
    this.cargaFinalizado=true
    this.estadoFinalizarPreguntas=true
    this.finalizarPerguntas.IdAccesoPrueba=this.json.AccesoPrueba;
    this.finalizarPerguntas.IdPEspecifico=this.json.IdPEspecificoHijo;
    this.finalizarPerguntas.IdPEspecificoPadre=this.json.IdPEspecificoPadre;
    this.finalizarPerguntas.IdPGeneral=this.json.IdPGeneralHijo;
    this.finalizarPerguntas.IdPrincipal=this.json.IdPGeneralPadre
    this.finalizarPerguntas.IdSexo=this.miPerfil.datosAlumno.idGenero
    this.finalizarPerguntas.Texto='';
    var pregun=this.preguntas.map((p:any)=>p.idPregunta).join(',');
    console.log(pregun)
    var res="'"+this.preguntas.map((p:any)=>p.idRespuesta).join("','")+"'";
    console.log(res)
    this.finalizarPerguntas.IdPregunta=pregun
    this.finalizarPerguntas.IdRespuesta=res
    this._PreguntaInteractivaService.RegistrarPreguntaInteractiva(this.finalizarPerguntas).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.cargaFinalizado=false
        console.log(x)
        this.finalizado=true
        this.videoFinal='https://repositorioweb.blob.core.windows.net/repositorioweb/aulavirtual/feedback/'+x.urlVideo
        this.estadoFinalizarPreguntas=false
      },
      error:c=>{

        this.cargaFinalizado=false
      }
    })
  }
  siguientePregunta(){
    this.preguntaActual++ ;
    this.feedCorrecto=''
    this.valPregunta=false;
  }
  ValidarPreguntaInteractiva(){
    this.valPregunta=true;
    this.ValidandoPreguntas=true
    this._PreguntaInteractivaService.ValidarPreguntaInteractiva(this.validatePregunta).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        console.log(this.preguntas[this.preguntaActual])
        this.preguntas[this.preguntaActual].idRespuesta=x.idRespuesta
        if(x.respuestaCorrecta){
          this._SnackBarServiceService.openSnackBar(x.feedbackPositivo,'x',15,"snackbarCrucigramaSucces");
          this.preguntas[this.preguntaActual].valid=true

          this.preguntas[this.preguntaActual].respuestaGrupoPreguntaInteractivaPrograma.forEach((res:any) => {
            res.checkAnteriorCorrecto=false
            if(res.check==true){
              res.checkAnteriorCorrecto=true
            }
          });
        }else{
          this.preguntas[this.preguntaActual].respuestaGrupoPreguntaInteractivaPrograma.forEach((res:any) => {
            res.checkAnteriorError=false
            if(res.check==true){
              res.checkAnteriorError=true
            }
          });
          this._SnackBarServiceService.openSnackBar(x.feedbackNegativo,'x',15,"snackbarCrucigramaerror");
          if(this.preguntas[this.preguntaActual].numeroRespuestas>1){
            this._SnackBarServiceService.openSnackBar('Seleccione todas las respuestas correctas','x',15,"snackbarCrucigramaerror");
          }
          if(x.numeroIntento>=x.numeroMaximoIntento){
            this.feedCorrecto=x.feedbackPositivo;
            this.preguntas[this.preguntaActual].valid=true
          }else{
            this.preguntas[this.preguntaActual].respuestaGrupoPreguntaInteractivaPrograma.forEach((res:any) => {
              res.check=false;
            });
            this.valPregunta=false;
          }
        }
        console.log(this.preguntas)
        this.ValidandoPreguntas=false

      },
      error:e=>{
        this.valPregunta=false;
        this.ValidandoPreguntas=false
        console.log(e)
      },
      complete:()=>{
        this.valorRespuesta=''
        this.ValidandoPreguntas=false
      }
    })
  }
  ListaRegistroPreguntaInteractivaPorGrupo(){
    if(this.chargePreguntas){
      this.chargePreguntas=false
      this.paramsPreguntas.IdPgeneral=this.json.IdPGeneralHijo;
      this.paramsPreguntas.IdPEspecifico=this.json.IdPEspecificoHijo;
      this.paramsPreguntas.GrupoPregunta=this.grupo
      this._PreguntaInteractivaService.ListaRegistroPreguntaInteractivaPorGrupo(this.paramsPreguntas).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          if(x.length>0){
            console.log(this.valPregunta)
            this.preguntaActual=0;
            this.chargePreguntas=true
            this.preguntas=x;
            let i=1;
            this.preguntas.forEach((element:any) => {
              element.valid=false
              element.respuestaGrupoPreguntaInteractivaPrograma.forEach((res:any) => {
                res.check=false;
              });
            });

            console.log(this.preguntas.length)
            var brk=false;
            this.preguntas.forEach((element:any) => {
              if(!brk){
                if(this.preguntas.length!=(i)){
                  console.log(this.preguntaActual)
                  if(element.numeroMaximoIntento<=element.intento || element.correcto){
                    this.preguntaActual++;
                  }else{
                    this.valPregunta=false;
                    brk=true
                  }
                }else{
                  console.log('-'+this.preguntaActual)
                  if(element.numeroMaximoIntento<=element.intento || element.correcto){
                    var respuestas=this.preguntas[this.preguntas.length-1].idRespuesta.split(',')
                    this.preguntas[this.preguntas.length-1].respuestaGrupoPreguntaInteractivaPrograma.forEach((r:any) => {
                      respuestas.forEach((res:any) => {
                        if(parseInt(res)==r.idRespuesta){
                          r.check=true
                        }
                      });
                    });
                    this.preguntas[this.preguntas.length-1].valid=true;
                    this.valPregunta=true;
                  }else{
                    this.valPregunta=false;
                  }
                }
              }

              i++
            });
            console.log(this.preguntaActual)
            console.log(this.valPregunta)
            console.log(x)
          }else{
            this.continuarVideo()
          }

        }
      })
    }

  }
  // +++ Build the player and place in HTML DOM +++
  changeBarra(e:any){
    this.tiempovideoinicio=e;
  }
  changeTime(e:any){
    this.tiempovideoinicio= e.target.currentTime;
    this.tiempoactualvideo=e.target.currentTime;
   // console.log(e)
    var tiempo=0
    var i=0
    var j=0;
    this.diapositivaactual=0
    var entro4=false;
    this.diapositivas.forEach((x) => {

      if(x.tipoVista!=4){
        i++;
      }
      if (x.tiempo<=this.tiempovideoinicio) {
        this.diapositivaactual=i
        if(x.tiempo>=tiempo){
          tiempo=x.tiempo
          this.indiceDiapositiva=j;
          this.urlDiapo = x.rutaDiapositiva;
          if(x.tipoVista==4){
            if(parseInt(x.estadoEval)!=1){
              this.capituloEv=parseInt(x.nroDiapositiva)
              this.tipo = x.tipoVista
            }
          }else{
            this.tipo = x.tipoVista
          }
          this.grupo=x.urlEvaluacion
          if(this.tipo==4){
            this.tiempovideoinicio=x.tiempo;
            this.tiempoactualvideo=x.tiempo;
            this.pauseVideo();
            this.ListaRegistroPreguntaInteractivaPorGrupo();
          }
        }
      }
      j++;
    });
    //this.RegistrarUltimaVisualizacionVideoWebApi()
  }
  setCurrentTime(data: any) {
    var tiempo= data.target.currentTime;
    this.tiempoactualvideo=tiempo;
    // if (parseInt(time) == 5) {
    //   this.video.nativeElement.pause();
    // }
    var i=0;
    var j=0
    this.diapositivas.forEach((x) => {
      if(x.tipoVista!=4){
        i++;
      }
      if(parseInt(tiempo)%10==0){
        //console.log(parseInt(tiempo))
        this.RegistrarUltimaVisualizacionVideoWebApi()
      }
      if (parseInt(tiempo) == x.tiempo) {
        this.diapositivaactual=i
        this.indiceDiapositiva=j;
        this.urlDiapo = x.rutaDiapositiva;
        if(x.tipoVista==4){
          if(parseInt(x.estadoEval)!=1){
            this.capituloEv=parseInt(x.nroDiapositiva)
            this.tipo = x.tipoVista
          }
        }else{
          this.tipo = x.tipoVista
        }
        this.grupo=x.urlEvaluacion
        this.RegistrarUltimaVisualizacionVideoWebApi()
        if(this.tipo==4){
          this.pauseVideo();
          this.ListaRegistroPreguntaInteractivaPorGrupo();
        }
      }
      j++;
    });
  }
  minusDiapo(){
    var index=this.diapositivaactual-2
    if(this.diapositivaactual>1){
      while(index>=0){
        if(this.diapositivas[index].tipoVista==4){
          index--
        }else{
          this.autoplay=true
          this.diapositivaactual--
          this.tiempovideoinicio=this.diapositivas[index].tiempo;
          this.urlDiapo=this.diapositivas[index].rutaDiapositiva;
          this.tipo=this.diapositivas[index].tipoVista;
          index=-1
        }
      }
    }
  }
  plusDiapo(){
    var index=this.getNextIndexPordiapo()
    //var index =this.indiceDiapositiva;
    console.log(this.diapositivas)
    console.log(index)
    console.log(this.diapositivaactual)
    console.log(this.indiceDiapositiva)
    if(this.diapositivaactual<this.numeroDiapositivas){
      console.log(this.diapositivas[index].tipoVista)
      if(this.diapositivas[index].tipoVista==4 ){
        console.log(this.diapositivas[index])
        if(parseInt(this.diapositivas[index].estadoEval)!=1){
         // this.indiceDiapositiva=index
          this.capituloEv=parseInt(this.diapositivas[index].nroDiapositiva)
          console.log(this.diapositivas[index])
          this.tipo=this.diapositivas[index].tipoVista;
          this.grupo=this.diapositivas[index].urlEvaluacion
          this.tiempovideoinicio=this.diapositivas[index].tiempo;
          this.pauseVideo()
          this.ListaRegistroPreguntaInteractivaPorGrupo();
        }else{
          index++
          this.autoplay=true
          this.diapositivaactual++
          this.tiempovideoinicio=this.diapositivas[index].tiempo;
          this.urlDiapo=this.diapositivas[index].rutaDiapositiva;
          this.tipo=this.diapositivas[index].tipoVista;
        }
      }else{
        this.autoplay=true
        this.diapositivaactual++
        console.log(this.tiempovideoinicio)
        this.tiempovideoinicio=this.diapositivas[index].tiempo;
        console.log(this.tiempovideoinicio)
        this.urlDiapo=this.diapositivas[index].rutaDiapositiva;
        this.tipo=this.diapositivas[index].tipoVista;
      }
    }
  }
  getNextIndexPordiapo():any{
    let i=0
    let indiceactual=0
    console.log(this.diapositivaactual)
    while(i<this.diapositivas.length){
      if(this.diapositivas[i].nroDiapositiva==this.diapositivaactual){
        indiceactual=i;
      }
      i++
    }
    i=0
    if(indiceactual==this.diapositivas.length){
      return indiceactual;
    }
    while(i<this.diapositivas.length){
      if(indiceactual<i){
        if(this.diapositivas[i].tipoVista==4 && this.diapositivas[i].estadoEval.toString()=='0'){
          return i;
        }else{
          if(this.diapositivas[i].tipoVista!=4 ){
            return i;
          }
        }
      }
      i++
    }
    return i;
  }
  pauseVideo(){
    if(this.videoData.objetoConfigurado.idVideoBrightcove!='0' &&
    this.videoData.objetoConfigurado.idVideoBrightcove!=null &&
    this.videoData.objetoConfigurado.idVideoBrightcove!=undefined){
      this.video.nativeElement.pause();
    }else{
      console.log(document.getElementById('videoCloud'))
      console.log($("#videoCloud iframe"))
      $("#videoCloud iframe").attr("id", "videoCloudIframe");
      const player =$('videoCloudIframe');
      console.log(player.contents().find('video'))
      this.videoCloud.autoplay=false;
      console.log(this.videoCloud)
    }
  }
  playVideo(){

    console.log(this.videoData.objetoConfigurado.idVideoBrightcove)
    if(this.videoData.objetoConfigurado.idVideoBrightcove!='0' &&
    this.videoData.objetoConfigurado.idVideoBrightcove!=null &&
    this.videoData.objetoConfigurado.idVideoBrightcove!=undefined){
      console.log('--------')
      this.video.nativeElement.play();
    }else{
      console.log(this.videoCloud);

      this.autoplay=true
      console.log(this.videoCloud)
    }
  }
  addPlayer() {
    // // Dynamically build the player video element
    // this.prueba =
    //   '<video-js id="myPlayerID" data-video-id="' +
    //   this.playerData.videoId +
    //   '"  data-account="' +
    //   this.playerData.accountId +
    //   '" data-player="' +
    //   this.playerData.playerId +
    //   '" data-embed="default" controls></video-js>';
    // // Inject the player code into the DOM
    // // Add and execute the player script tag
    var s = document.createElement('script');
    s.src =
      'https://players.brightcove.net/' +
      this.playerData.accountId +
      '/' +
      this.playerData.playerId +
      '_default/index.min.js';
    document.body.appendChild(s);
  }
  resise(e: any) {
    if(this.down==true){
      if(e.x>0){

        this.lather = e.x;
        if (this.init == -1) {
          this.init = e.x;
        }
        this.whidth = this.init - e.x;

        // e.layerX
      }
    }
  }
  RegistrarUltimaVisualizacionVideoWebApi(){

    if(Math.floor(this.tiempoactualvideo)>this.tiempovideoinicioInicial && this.guardar==false){
      console.log(Math.floor(this.tiempoactualvideo)+'-'+this.tiempovideoinicioInicial)
      this.guardar=true
      this.send.accesoPrueba=this.json.AccesoPrueba
      this.send.idPEspecificoHijo=this.json.IdPEspecificoHijo
      this.send.idCapitulo=this.idCapitulo
      this.send.idPEspecificoPadre=this.json.IdPEspecificoPadre
      this.send.idPGeneral=this.json.IdPGeneralHijo
      this.send.idPrincipal=this.json.IdPGeneralPadre
      this.send.idSesion=this.idSesion
      this.send.id=this.videoData.id==null?0:this.videoData.id
      this.send.tiempoVisualizacion=Math.floor(this.tiempoactualvideo)
      console.log(this.send)
      this._VideoSesionService.RegistrarUltimaVisualizacionVideoWebApi(this.send).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          this.tiempovideoinicioInicial=this.send.tiempoVisualizacion
          this.guardar=false
          console.log(x)
        },
        error:x=>{
          console.log(x)
          this.guardar=false
        }
      })
    }

  }
  OnFinish(){
    this.RegistrarUltimaVisualizacionVideoWebApi()
    this.finish=true;
    this.tipo=2
    console.log(this.nextChapter)
    console.log('Finish-------------');
    this.OnFin.emit()
    this.GetTIme=new Date().getTime();
    this.valueCount=3000
    this.timeo2=setInterval(()=>{
      this.valueCount-=100
      console.log(this.valueCount)
    },100)
    this.timeo=setTimeout(() => {
      this.CambioTab()
    }, 3000);
  }
  EventoInteraccion(){
    this._HelperService.enviarMsjAcciones({Tag:'Video',Programa:this.json.NombrePrograma,Seccion:'Sesiones'})
  }
  EventoInteraccionVolumen(){
    console.log(event)
    this._HelperService.enviarMsjAcciones({Tag:'Video(volumen)',Programa:this.json.NombrePrograma,Seccion:'Sesiones'})
  }
  EventoInteraccionDrag(){
    this._HelperService.enviarMsjAcciones({Tag:'Drag',Programa:this.json.NombrePrograma,Seccion:'Sesiones'})
  }
  TimerPause(){
    clearTimeout(this.timeo)
    clearTimeout(this.timeo2)
    var _now = new Date().getTime();
    this.TiempoRestante-=(_now-this.GetTIme);
    console.log(this.TiempoRestante)
  }
  TimerResume(){
    if(this.TiempoRestante>0){
      this.GetTIme=new Date();
      this.timeo2=setInterval(()=>{
        this.valueCount-=100
        console.log(this.valueCount)
      },100)
      this.timeo=setTimeout(() => {
        this.CambioTab()
      }, this.TiempoRestante);
    }
  }
  CambioTab(){
    this.tiempovideoinicio=0
    this.finish=false;
    this.TiempoRestante=3000
    clearTimeout(this.timeo)
    clearTimeout(this.timeo2)
    this.next.emit()
  }
}
