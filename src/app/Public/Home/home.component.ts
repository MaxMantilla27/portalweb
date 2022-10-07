import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { BasicCarousel, BasicUrl } from 'src/app/Core/Models/BasicDTO';
import { PartnerImagesDTO } from 'src/app/Core/Models/PartnerImagesDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { PartnerService } from 'src/app/Core/Shared/Services/Partner/partner.service';
import { CasosExitoDTO } from 'src/app/Core/Models/CasosExitoDTO';
import { isPlatformBrowser } from '@angular/common';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { Router } from '@angular/router';
import { SeoService } from 'src/app/Core/Shared/Services/seo.service';
import {Title} from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
declare const fbq:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers:[NgbCarouselConfig],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit,AfterViewInit,OnDestroy {

  private signal$ = new Subject();
  isBrowser: boolean;
  public step:Array<Array<PartnerImagesDTO>>=[];
  public Carreras: Array<BasicUrl> = [];
  public TituloCarreras = '';
  public Educacion: Array<BasicUrl> = [];
  public TituloEducacion = '';
  public Formacion: Array<BasicUrl> = [];
  public tabindex=0;
  public selectFormacion=0;
  public busqueda=''
  public inputActive=false
  public cassosExito:Array<CasosExitoDTO>=[
    {Curso:"Curso MS Project aplicado a la Gestión de Proyectos",img:'kerly-pacheco.png',Nombre:'KERLY PACHECO',Texto:'La experiencia ha sido muy buena, porque he podido ampliar los conocimientos que tenia.'},
    {Curso:"Lean Six Sigma Black Belt",img:'heddy-honorio.png',Nombre:'HEDDY HONORIO',Texto:'La motivación de la certificación internacional que ofrece el programa fue un estímulo muy alto para matricularme'},
    {Curso:"Lean Six Sigma Black Belt",img:'jorge-rojas.png',Nombre:'JORGE ROJAS',Texto:'La gran diferencia con la competencia fue que: uno, la flexibilidad de horarios y número dos, BSG Institute te prepara, te brinda las pautas y te hacen un seguimiento personalizado para acceder a la certificación internacional.'}
  ];
  imagesc = [
  ];
  constructor(

    private _PartnerService:PartnerService,
    private _HelperService :HelperService,
    private _router:Router,
    private _SessionStorageService:SessionStorageService,
    config: NgbCarouselConfig,
     @Inject(PLATFORM_ID) platformId: Object,
     private _SeoService:SeoService,
    private title:Title
  ) {

    this.isBrowser = isPlatformBrowser(platformId);
    config.interval = 200000;
    config.keyboard = true;
    config.pauseOnHover = true;
  }
  public imagenes:Array<PartnerImagesDTO>=[];
  public imagenes2:Array<BasicCarousel>=[];
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngAfterViewInit(): void {
    this.tabindex=0
  }
  public innerWidth: any;
  public seccionStep=4;
  public cargaTabs=false
  ngOnInit(): void {
    this._SessionStorageService.SessionSetValueCokies('prueba','123',1)
    let t:string='BSG Institute'
    this.title.setTitle(t);

    this._SeoService.generateTags({
      image:'https://img.bsginstitute.com/repositorioweb/img/capacitacion-bsgrupo.png'
    });
    this.imagenes=this._SeoService.getimagesPartner();
    this.imagenes2=this.imagenes.map((img)=>{
      var ps:BasicCarousel={path:img.imgPrincipal,width:0,height:0};
      return ps;
    });;

    if(this.isBrowser){
      this.innerWidth = window.innerWidth;
      if(this.innerWidth<992)this.seccionStep=2;
      if(this.innerWidth<768)this.seccionStep=1;
    }
    //this.TituloCarreras$ = this._HelperService.recibirString;
    this._HelperService.recibirStringCarrera.pipe(takeUntil(this.signal$)).subscribe(x => {this.TituloCarreras=x});
    this._HelperService.recibirArrayCarrera.pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        this.Carreras=x.map((c:any)=>{
          var ps:BasicUrl={Nombre:c.Nombre,value:c.value,Url:c.Url};
          return ps;
        });
      }
    });
    this._HelperService.recibirStringEducacion.pipe(takeUntil(this.signal$)).subscribe(x => {this.TituloEducacion=x});
    this._HelperService.recibirArrayEducacion.pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        this.Educacion=x.map((c:any)=>{
          var ps:BasicUrl={Nombre:c.Nombre,value:c.value,Url:c.Url};
          return ps;
        });
      }
    });
    this._HelperService.recibirArrayFormacion.pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        if(this.Formacion.length==0){
          this.Formacion=x;
          let i=0
          this.Formacion.forEach(x=>{
            if(i==0){
              x.change=true;
            }else{
              x.change=false;
            }
            i++
          })
          this.tabindex=0;
          this.selectFormacion=this.Formacion[this.tabindex].value;
        }
      }
    });

    this.OrderImages();
  }
  BuscarProgramas(esButton:boolean){
    var obj:any
    if(esButton){
      obj={Tag:"Button",Nombre:"Busqueda",valor:this.busqueda}
    }else{
      obj={Tag:'Input',Accion:'keyup.enter',Tipo:'text',Nombre:'Busqueda',valor:this.busqueda}
    }
    this._HelperService.enviarMsjAcciones(obj)

    this._SessionStorageService.SessionSetValue('BusquedaPrograma',this.busqueda);
    this._router.navigate(['/programas-certificaciones-cursos']);
  }
  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    if(this.cargaTabs){
      this._HelperService.enviarMsjAcciones({Tag:'Tab',Nombre:tabChangeEvent.tab.textLabel,Seccion:'Formación continua'})
    }
    this.cargaTabs=true
    this.tabindex=tabChangeEvent.index;
    this.selectFormacion=this.Formacion[this.tabindex].value;
    if(this.Formacion[this.tabindex].change!=true){
      this.Formacion[this.tabindex].change=true
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
  // GetImagenPartner(){
  //   this._PartnerService.GetListPartnerImage().pipe(takeUntil(this.signal$)).subscribe({
  //     next:(x)=>{
  //       this.imagenes=x.listaPartnerImagenDTO.map((i:any)=>{
  //         var ps:PartnerImagesDTO={imgPrincipal:'https://img.bsginstitute.com/repositorioweb/img/partners/'+i.imgPrincipal,imagenAlt:i.imagenAlt};
  //         return ps;
  //       });
  //       this.imagenes2=x.listaPartnerImagenDTO.map((i:any)=>{
  //         var ps:BasicCarousel={path:'https://img.bsginstitute.com/repositorioweb/img/partners/'+i.imgPrincipal,width:0,height:0};
  //         return ps;
  //       });
  //       this.OrderImages()
  //     },
  //     error:(x)=>{console.log(x)}
  //   });
  // }
  EventoInteraccion(){
    this._HelperService.enviarMsjAcciones({Tag:'Input',Accion:'click',Tipo:'text',Nombre:'¿Qué te gustaría aprender?',valor:this.busqueda})
  }
  EventoInteraccionCarrousel(event:any,nombre:string){
    if(event.source!='timer'){
      this._HelperService.enviarMsjAcciones({Tag:'Carousel',Nombre:nombre,Accion:event.source})
    }
  }
  EventoInteraccionCarreras(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Link',Nombre:'Más Información',Programa:nombre,Seccion:'Carreras Profesionales'})
  }
  EventoInteraccionEducacion(nombre:string){
    this._HelperService.enviarMsjAcciones({Tag:'Link',Nombre:'Más Información',Programa:nombre,Seccion:'Educación Técnica'})
  }
}

