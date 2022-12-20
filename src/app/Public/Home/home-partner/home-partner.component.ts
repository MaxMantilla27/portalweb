import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { BasicCarousel } from 'src/app/Core/Models/BasicDTO';
import { PartnerImagesDTO } from 'src/app/Core/Models/PartnerImagesDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SeoService } from 'src/app/Core/Shared/Services/seo.service';

@Component({
  selector: 'app-home-partner',
  templateUrl: './home-partner.component.html',
  styleUrls: ['./home-partner.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePartnerComponent implements OnInit {

  constructor(
    private _HelperService :HelperService,
    private _SeoService:SeoService,
    config: NgbCarouselConfig,
  ) {
    config.interval = 7000;
    config.keyboard = true;
    config.pauseOnHover = true;
  }
  public step:Array<Array<PartnerImagesDTO>>=[];
  public imagenes:Array<PartnerImagesDTO>=[];
  public imagenes2:Array<BasicCarousel>=[];
  public seccionStep=4;

  ngOnInit(): void {
    this.imagenes=this._SeoService.getimagesPartner();
    this.imagenes2=this.imagenes.map((img)=>{
      var ps:BasicCarousel={path:img.imgPrincipal,width:0,height:0};
      return ps;
    });;
    this.OrderImages();
  }
  EventoInteraccionCarrousel(event:any,nombre:string){
    if(event.source!='timer'){
      this._HelperService.enviarMsjAcciones({Tag:'Carousel',Nombre:nombre,Accion:event.source})
    }
  }
  OrderImages(){
    var ind=1;
    var stepImages:Array<any>=[];
    this.imagenes.forEach(
      x=>{
        stepImages.push(x);
        if(ind==this.seccionStep){
          this.step.push(stepImages);
          stepImages=[];
          ind=0
        }
        ind++
      }
    );
    if(stepImages.length>0){
      this.step.push(stepImages);
    }
  }

}
