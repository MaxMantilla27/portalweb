import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-video-brightcove',
  templateUrl: './video-brightcove.component.html',
  styleUrls: ['./video-brightcove.component.scss'],
})
export class VideoBrightcoveComponent implements OnInit, OnChanges {
  @ViewChild('video')
  video!: ElementRef;
  constructor() {}

  @Input()
  public videoData: any;
  public tipo = 2;
  public urlDiapo = '';
  public diapositivas: Array<any> = [];
  public init = -1;
  public lather = 0;
  public whidth = 0;
  ngOnInit(): void {
    //  this.someElement.nativeElement.play();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.videoData != undefined) {
      this.addPlayer();
      this.diapositivas = this.videoData.objetoConfigurado.configuracion;
      if (this.videoData.objetoConfigurado.configuracion.length > 0) {
        this.tipo = parseInt(
          this.videoData.objetoConfigurado.configuracion[0].tipoVista
        );
        console.log(this.tipo);
      }
    }
  }
  ngOnDestroy() {}
  // +++ Set the data for the player +++
  playerData = {
    accountId: '6267108632001',
    playerId: 'rEr9tuuTvS',
    videoId: '6306336229112',
  };

  // +++ Build the player and place in HTML DOM +++

  setCurrentTime(data: any) {
    console.log(data.target.currentTime);
    var time = data.target.currentTime;
    console.log(parseInt(time));
    // if (parseInt(time) == 5) {
    //   this.video.nativeElement.pause();
    // }
    this.diapositivas.forEach((x) => {
      if (parseInt(time) == x.tiempo) {
        this.urlDiapo = x.rutaDiapositiva;
      }
    });
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
    if(e.x>0){

      this.lather = e.x;
      if (this.init == -1) {
        this.init = e.x;
      }
      this.whidth = this.init - e.x;
      console.log(e);
      console.log(e.x);
      console.log(this.whidth);
      // e.layerX
    }
  }
}
