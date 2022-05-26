import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CloudflareStreamComponent, CloudflareStreamService } from '@cloudflare/stream-angular';
import { ParametrosEstructuraEspecificaDTO, RegistroVideoUltimaVisualizacionDTO } from 'src/app/Core/Models/EstructuraEspecificaDTO';
import { GrupoPreguntaFiltroDTO, ValidaRespuestaPreguntaDTO } from 'src/app/Core/Models/PreguntaInteractivaDTO';
import { PreguntaInteractivaService } from '../../../Services/PreguntaInteractiva/pregunta-interactiva.service';
import { VideoSesionService } from '../../../Services/VideoSesion/video-sesion.service';
declare var $:any;
@Component({
  selector: 'app-video-brightcove',
  templateUrl: './video-brightcove.component.html',
  styleUrls: ['./video-brightcove.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VideoBrightcoveComponent implements OnInit, OnChanges,AfterViewInit {
  @ViewChild('video')
  video!: ElementRef;
  @ViewChild('videoCloud')
  videoCloud!: CloudflareStreamComponent;

  constructor(
    public _VideoSesionService:VideoSesionService,
    public _PreguntaInteractivaService:PreguntaInteractivaService
  ) {}
  ngAfterViewInit(): void {
  }

  @Input()
  public videoData: any;
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
  }
  public grupo=''
  public chargePreguntas=true;
  public preguntas:any;
  public preguntaActual=0;
  ngOnInit(): void {
    //  this.someElement.nativeElement.play();
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
      this.tiempovideoinicio=this.videoData.tiempoVisualizado
      this.tiempovideoinicioInicial=Math.ceil(this.videoData.tiempoVisualizado)
      this.tiempovideo=this.videoData.tiempoTotalVideo
      this.tiempoactualvideo=this.videoData.tiempoVisualizado
      console.log(this.video)
     // this.video.nativeElement.setCurrentTime=this.tiempoactualvideo;
      this.diapositivas = this.videoData.objetoConfigurado.configuracion;
      var tiempo=0
      var i=1
      this.diapositivas.forEach((x) => {

        if (x.tiempo<=this.tiempovideoinicio) {
          if(x.tipoVista!=4){
            this.diapositivaactual++;
          }
          if(x.tiempo>=tiempo){
            tiempo=x.tiempo
            this.urlDiapo = x.rutaDiapositiva;
            this.tipo = x.tipoVista
            this.grupo=x.urlEvaluacion
          }
        }
        if(x.tipoVista!=4){
          this.numeroDiapositivas++;
          i++;
        }
      });
      if(this.tipo==4){
        this.ListaRegistroPreguntaInteractivaPorGrupo();
      }
    }
  }
  chageRespuesta(index:number,tipo:number){
    var value=this.preguntas[this.preguntaActual].respuestaGrupoPreguntaInteractivaPrograma[index].check;
    if(tipo!=4){
      this.preguntas[this.preguntaActual].respuestaGrupoPreguntaInteractivaPrograma.forEach((res:any) => {
        res.check=false;
      });
    }else{
      this.preguntas[this.preguntaActual].respuestaGrupoPreguntaInteractivaPrograma[index].check=!value
    }

    this.preguntas[this.preguntaActual].respuestaGrupoPreguntaInteractivaPrograma[index].check=true
  }
  ValidarPreguntaInteractiva(){
    console.log(this.preguntas[this.preguntaActual].tipoRespuesta)
    this.validatePregunta.IdPregunta=this.preguntas[this.preguntaActual].idPregunta
    this.validatePregunta.IdPGeneral=this.json.IdPGeneralHijo;
    this.validatePregunta.IdPEspecifico=this.json.IdPEspecificoHijo;
    if(this.preguntas[this.preguntaActual].tipoRespuesta>=6 && this.preguntas[this.preguntaActual].tipoRespuesta<=8){
      this.validatePregunta.Texto=this.valorRespuesta
    }else{
      console.log('----------')
      this.preguntas[this.preguntaActual].respuestaGrupoPreguntaInteractivaPrograma.forEach((res:any) => {
        console.log(res)
        if(res.check==true){
          this.validatePregunta.IdRespuesta.push(res.idRespuesta)
        }
      });
    }
    this._PreguntaInteractivaService.ValidarPreguntaInteractiva(this.validatePregunta).subscribe({
      next:x=>{
        console.log(x)
      }
    })
  }
  ListaRegistroPreguntaInteractivaPorGrupo(){
    if(this.chargePreguntas){
      this.chargePreguntas=false
      this.paramsPreguntas.IdPgeneral=this.json.IdPGeneralHijo;
      this.paramsPreguntas.IdPEspecifico=this.json.IdPEspecificoHijo;
      this.paramsPreguntas.GrupoPregunta=this.grupo
      this._PreguntaInteractivaService.ListaRegistroPreguntaInteractivaPorGrupo(this.paramsPreguntas).subscribe({
        next:x=>{
          this.chargePreguntas=true
          this.preguntas=x;
          let i=1;
          this.preguntas.forEach((element:any) => {
            if(this.preguntas.length==(i)){
              if(element.numeroMaximoIntento<=element.intento){
                this.preguntaActual++;
              }
            }
            element.respuestaGrupoPreguntaInteractivaPrograma.forEach((res:any) => {
              res.check=false;
            });
            i++
          });
          console.log(x)
        }
      })
    }

  }
  ngOnDestroy() {}
  // +++ Build the player and place in HTML DOM +++
  changeBarra(e:any){
    this.tiempovideoinicio=e;

  }
  changeTime(e:any){
    this.tiempovideoinicio= e.target.currentTime;
    this.tiempoactualvideo=e.target.currentTime;
    console.log(e)
    var tiempo=0
    var i=0
    this.diapositivaactual=0
    this.diapositivas.forEach((x) => {

      if(x.tipoVista!=4){
        i++;
      }
      if (x.tiempo<=this.tiempovideoinicio) {
        this.diapositivaactual=i
        if(x.tiempo>=tiempo){
          tiempo=x.tiempo
          this.urlDiapo = x.rutaDiapositiva;
          this.tipo = x.tipoVista
          this.grupo=x.urlEvaluacion
          if(this.tipo==4){
            this.pauseVideo();
            this.ListaRegistroPreguntaInteractivaPorGrupo();
          }
        }
      }
    });
    this.RegistrarUltimaVisualizacionVideo()
  }
  setCurrentTime(data: any) {
    var tiempo= data.target.currentTime;
    this.tiempoactualvideo=tiempo;
    // if (parseInt(time) == 5) {
    //   this.video.nativeElement.pause();
    // }
    var i=0;
    this.diapositivas.forEach((x) => {
      if(x.tipoVista!=4){
        i++;
      }
      if(parseInt(tiempo)%10==0){
        console.log(parseInt(tiempo))
        this.RegistrarUltimaVisualizacionVideo()
      }
      if (parseInt(tiempo) == x.tiempo) {
        this.diapositivaactual=i
        this.urlDiapo = x.rutaDiapositiva;
        this.tipo = x.tipoVista
        this.grupo=x.urlEvaluacion
        this.RegistrarUltimaVisualizacionVideo()
        if(this.tipo==4){
          this.pauseVideo();
          this.ListaRegistroPreguntaInteractivaPorGrupo();
        }
      }
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
    var index=this.diapositivaactual
    console.log(this.diapositivas)
    if(this.diapositivaactual<=this.numeroDiapositivas){
      if(this.diapositivas[index].tipoVista==4){
        console.log(this.diapositivas[index])
        this.tipo=this.diapositivas[index].tipoVista;
        this.pauseVideo()
        this.ListaRegistroPreguntaInteractivaPorGrupo();
      }else{
        this.autoplay=true
        this.diapositivaactual++
        this.tiempovideoinicio=this.diapositivas[index].tiempo;
        this.urlDiapo=this.diapositivas[index].rutaDiapositiva;
        this.tipo=this.diapositivas[index].tipoVista;
      }
    }
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
  RegistrarUltimaVisualizacionVideo(){

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
      this._VideoSesionService.RegistrarUltimaVisualizacionVideo(this.send).subscribe({
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
}
