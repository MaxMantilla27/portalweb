import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { BasicCarousel } from 'src/app/Core/Models/BasicDTO';
import { PartnerImagesDTO } from 'src/app/Core/Models/PartnerImagesDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { PartnerService } from 'src/app/Core/Shared/Services/Partner/partner.service';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AcercaDeComponent implements OnInit,AfterViewInit {

  @ViewChild('valores') valores!: ElementRef;
  @ViewChild('calidad') calidad!: ElementRef;
  @ViewChild('numeros') numeros!: ElementRef;

  isBrowser: boolean;
  constructor(
    private _PartnerService:PartnerService,
    @Inject(PLATFORM_ID) platformId: Object,
    private _HelperService :HelperService,
    config: NgbCarouselConfig,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    config.interval = 20000;
    config.keyboard = true;
    config.pauseOnHover = true;
   }

  public migaPan = [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: 'Acerca BSG Institute',
      urlWeb: '/AcercaBsGrupo'
    }
  ]
  public imagenes:Array<PartnerImagesDTO>=[];
  public imagenes2:Array<BasicCarousel>=[];
  public step:Array<Array<PartnerImagesDTO>>=[];
  public seccionStep=4;
  public innerWidth: any;
  ngOnInit(): void {
    //valores numeros calidad
    if(this.isBrowser){
      this.innerWidth = window.innerWidth;
      if(this.innerWidth<992)this.seccionStep=2;
      if(this.innerWidth<768)this.seccionStep=1;
    }
    this.GetImagenPartner();
  }
  ngAfterViewInit(){

    this._HelperService.recibirScrollFooter.subscribe(x => {
      if(x=='valores') this.valores.nativeElement.scrollIntoView();
      if(x=='numeros') this.numeros.nativeElement.scrollIntoView();
      if(x=='calidad') this.calidad.nativeElement.scrollIntoView();
    });
  }
  GetImagenPartner(){
    this._PartnerService.GetListPartnerImage().subscribe({
      next:(x)=>{
        this.imagenes=x.listaPartnerImagenDTO.map((i:any)=>{
          var ps:PartnerImagesDTO={imgPrincipal:'https://img.bsginstitute.com/repositorioweb/img/partners/'+i.imgPrincipal,imagenAlt:i.imagenAlt};
          return ps;
        });
        this.imagenes2=x.listaPartnerImagenDTO.map((i:any)=>{
          var ps:BasicCarousel={path:'https://img.bsginstitute.com/repositorioweb/img/partners/'+i.imgPrincipal,width:0,height:0};
          return ps;
        });
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
      },
      error:(x)=>{console.log(x)}
    });
  }
}
