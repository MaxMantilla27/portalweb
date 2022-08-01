import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { BasicCarousel } from 'src/app/Core/Models/BasicDTO';
import { PartnerImagesDTO } from 'src/app/Core/Models/PartnerImagesDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { PartnerService } from 'src/app/Core/Shared/Services/Partner/partner.service';
import { SeoService } from 'src/app/Core/Shared/Services/seo.service';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AcercaDeComponent implements OnInit,AfterViewInit,OnDestroy {
  private signal$ = new Subject();

  @ViewChild('valores') valores!: ElementRef;
  @ViewChild('calidad') calidad!: ElementRef;
  @ViewChild('numeros') numeros!: ElementRef;

  isBrowser: boolean;
  constructor(
    private _PartnerService:PartnerService,
    @Inject(PLATFORM_ID) platformId: Object,
    private _HelperService :HelperService,
    config: NgbCarouselConfig,
    private _SeoService:SeoService,
    private title:Title
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    config.interval = 20000;
    config.keyboard = true;
    config.pauseOnHover = true;
   }
   ngOnDestroy(): void {
     this.signal$.next(true)
     this.signal$.complete()
   }

  public migaPan = [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: 'Acerca de BSG Institute',
      urlWeb: '/AcercaBsGrupo'
    }
  ]
  public imagenes:Array<PartnerImagesDTO>=[];
  public imagenes2:Array<BasicCarousel>=[];
  public step:Array<Array<PartnerImagesDTO>>=[];
  public seccionStep=4;
  public innerWidth: any;
  ngOnInit(): void {


    let t:string='Acerca de BSG Institute'
    this.title.setTitle(t);

    this._SeoService.generateTags({
      title:'Acerca de BSG Institute',
      slug:'AcercaBsGrupo',
      description:'Acerca de BSG Institute ofrece mayor información sobre nuestra misión y visión, nuestros valores y política de calidad',
      keywords:'acerca de bsginstitute, acerca BSG Institute, acerca bsginstitute, acerca BSG Institute',
    });

    //valores numeros calidad
    if(this.isBrowser){
      this.innerWidth = window.innerWidth;
      if(this.innerWidth<992)this.seccionStep=2;
      if(this.innerWidth<768)this.seccionStep=1;
    }
    this.GetImagenPartner();
  }
  ngAfterViewInit(){

    this._HelperService.recibirScrollFooter.pipe(takeUntil(this.signal$)).subscribe(x => {
      if(x=='valores') this.valores.nativeElement.scrollIntoView();
      if(x=='numeros') this.numeros.nativeElement.scrollIntoView();
      if(x=='calidad') this.calidad.nativeElement.scrollIntoView();
    });
  }
  GetImagenPartner(){
    this._PartnerService.GetListPartnerImage().pipe(takeUntil(this.signal$)).subscribe({
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
