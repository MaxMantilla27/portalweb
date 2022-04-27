import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { BasicCarousel, BasicUrl } from 'src/app/Core/Models/BasicDTO';
import { PartnerImagesDTO } from 'src/app/Core/Models/PartnerImagesDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { PartnerService } from 'src/app/Core/Shared/Services/Partner/partner.service';
import { CasosExitoDTO } from 'src/app/Core/Models/CasosExitoDTO';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[NgbCarouselConfig],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit,AfterViewInit {

  isBrowser: boolean;
  public imagenes:Array<PartnerImagesDTO>=[];
  public imagenes2:Array<BasicCarousel>=[];
  public step:Array<Array<PartnerImagesDTO>>=[];
  public Carreras: Array<BasicUrl> = [];
  public Formacion: Array<BasicUrl> = [];
  public TituloCarreras = '';
  public tabindex=0;
  public selectFormacion=0;
  public cassosExito:Array<CasosExitoDTO>=[
    {Curso:"Curso MS Project aplicado a la Gestión de Proyectos",Genero:'F',Nombre:'KERLY PACHECO',Texto:'La experiencia ha sido muy buena, porque he podido ampliar los conocimientos que tenia.'},
    {Curso:"Diplomado Lean Six Sigma Black Belt",Genero:'F',Nombre:'HEDDY HONORIO',Texto:'La motivación de la certificación internacional que ofrece el programa fue un estímulo muy alto para matricularme'},
    {Curso:"Diplomado Lean Six Sigma Black Belt",Genero:'M',Nombre:'JORGE ROJAS',Texto:'La gran diferencia con la competencia fue que: uno, la flexibilidad de horarios y número dos, BSG Institute te prepara, te brinda las pautas y te hacen un seguimiento personalizado para acceder a la certificación internacional.'}
  ];
  imagesc = [
    {title: 'First Slide', short: 'First Slide Short', src: "https://picsum.photos/id/700/900/500"},
    {title: 'Second Slide', short: 'Second Slide Short', src: "https://picsum.photos/id/1011/900/500"},
    {title: 'Third Slide', short: 'Third Slide Short', src: "https://picsum.photos/id/984/900/500"}
  ];
  constructor(

    private _PartnerService:PartnerService,
    private _HelperService :HelperService,
    config: NgbCarouselConfig,
     @Inject(PLATFORM_ID) platformId: Object
  ) {

    this.isBrowser = isPlatformBrowser(platformId);
    config.interval = 20000;
    config.keyboard = true;
    config.pauseOnHover = true;
  }
  ngAfterViewInit(): void {
    this.tabindex=0
  }
  public innerWidth: any;
  public seccionStep=5;
  ngOnInit(): void {
    if(this.isBrowser){
      this.innerWidth = window.innerWidth;
      if(this.innerWidth<992)this.seccionStep=2;
      if(this.innerWidth<768)this.seccionStep=1;
    }
    //this.TituloCarreras$ = this._HelperService.recibirString;
    this._HelperService.recibirStringCarrera.subscribe(x => {this.TituloCarreras=x;if(this.Formacion.length>0){this.Formacion[this.tabindex].change!++;}});
    this._HelperService.recibirArrayCarrera.subscribe({
      next:(x)=>{
        this.Carreras=x.map((c:any)=>{
          var ps:BasicUrl={Nombre:c.Nombre,value:c.value,Url:c.Url};
          return ps;
        });
      }
    });
    this._HelperService.recibirArrayFormacion.subscribe({
      next:(x)=>{
        this.Formacion=x;
        this.Formacion.forEach(x=>{
          x.change=0;
        })
        this.tabindex=0;
        this.selectFormacion=this.Formacion[this.tabindex].value;
      }
    });

    this.GetImagenPartner();
  }
  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.tabindex=tabChangeEvent.index;
    this.selectFormacion=this.Formacion[this.tabindex].value;
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
