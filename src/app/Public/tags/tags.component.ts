import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ArticuloDTO } from 'src/app/Core/Models/ArticuloDTO';
import { CardProgramasDTO } from 'src/app/Core/Models/BasicDTO';
import { SeoService } from 'src/app/Core/Shared/Services/seo.service';
import { TemasRelacionadosService } from 'src/app/Core/Shared/Services/TemasRelacionados/temas-relacionados.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit,OnDestroy {
  isBrowser: boolean;
  private signal$ = new Subject();
  constructor(
    private router: Router,
    public _TemasRelacionadosService:TemasRelacionadosService,
    private activatedRoute:ActivatedRoute,
    private _SeoService:SeoService,
    private title:Title,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  public tipo=1
  public nombre='';
  public tagTitle=''
  public tagSubTitle=''
  public tagDescripcion=''
  public programas:Array<CardProgramasDTO>=[];
  public Articulos:Array<ArticuloDTO>=[];
  public scroll=0
  public migaPan = [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: '',
      urlWeb: ''
    }
  ]
  ngOnInit(): void {
    var url=this.router.url.split('/')
    if(url[1]=='Area'){
      this.tipo=1
      this.migaPan[1].titulo='Área'
    };
    if(url[1]=='SubArea'){
      this.tipo=2
      this.migaPan[1].titulo='SubArea'
    }
    if(url[1]=='tag'){
      this.tipo=3
      this.migaPan[1].titulo='Tag'
    }
    this.activatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
          this.nombre=x['nombre'];
          this.tagTitle=this.nombre.split('-').join(' ')
          this.TemasRelacionados();
      }
    })
  }
  TemasRelacionados(){
    this._TemasRelacionadosService.TemasRelacionados(this.tipo,this.nombre).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x.parametroSeoProgramaDTO!=undefined){
          var metas=x.parametroSeoProgramaDTO;
          if(metas.length>0){

            let mt=metas.find((par:any)=>par.nombre=='Titulo Pestaña')!=undefined?
                      metas.find((par:any)=>par.nombre=='Titulo Pestaña').descripcion:undefined
            let t=metas.find((par:any)=>par.nombre=='title')!=undefined?
                      metas.find((par:any)=>par.nombre=='title').descripcion:undefined
            let d=metas.find((par:any)=>par.nombre=='description')!=undefined?
                      metas.find((par:any)=>par.nombre=='description').descripcion:undefined
            let k=metas.find((par:any)=>par.nombre=='keywords')!=undefined?
                      metas.find((par:any)=>par.nombre=='keywords').descripcion:undefined
            this.title.setTitle(t);

            this._SeoService.generateTags({
              title:mt,
              slug:this.router.url.toString(),
              description:d,
              keywords:k,
            });

          }
        }
        this.programas=x.listaProgramaTemasRelacionados.map(
          (c:any)=>{
            var ps:CardProgramasDTO={
              Inversion:'',
              Content:c.montoPagoDescripcion,
              Url:c.direccion,
              Img:'https://img.bsginstitute.com/repositorioweb/img/programas/'+c.imagenPrograma,
              ImgAlt:c.descripcion,
              Title:c.titulo};
            return ps;
          }
        );
        console.log(x.listaArticuloTemasRelacionados)
        this.Articulos=x.listaArticuloTemasRelacionados.map(
          (c:any)=>{
            var ps:ArticuloDTO={
              descripcion:c.descripcion,
              imgPortada:c.imgPortada,
              imgPortadaAlt:c.imgPortadaAlt,
              idWeb:c.idWeb,
              urlWeb:c.direccion,
              descripcionGeneral:'',
              idArea:parseInt(c.idTipoArticulo),
              nombre:c.titulo
            };
            console.log(ps)
            return ps;
          }
        );
        if(x.tema!=''){
          this.tagDescripcion=x.tema.descripcion;
        }
      }
    })
  }
}
