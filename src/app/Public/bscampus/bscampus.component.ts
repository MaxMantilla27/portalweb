import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { ArticuloDTO } from 'src/app/Core/Models/ArticuloDTO';
import { BasicUrl } from 'src/app/Core/Models/BasicDTO';
import { ArticuloService } from 'src/app/Core/Shared/Services/Articulo/articulo.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SeoService } from 'src/app/Core/Shared/Services/seo.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-bscampus',
  templateUrl: './bscampus.component.html',
  styleUrls: ['./bscampus.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BSCampusComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _HelperService :HelperService,
    private _ArticuloService:ArticuloService,
    private _SessionStorageService:SessionStorageService,
    private _SeoService:SeoService,
    private title:Title
  ) { }

  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public migaPan: any =  [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: 'BS Campus',
      urlWeb: '/bs-campus'
    }
  ];

  public Formacion: Array<BasicUrl> = [];
  public IdArea:number=0;
  public charge=false;
  public blog:Array<ArticuloDTO>=[];
  public whitePapers:Array<ArticuloDTO>=[];
  public index=0;
  ngOnInit(): void {

    let t:string='BS Campus'
    this.title.setTitle(t);

    this._SeoService.generateTags({
      title: 'BS Campus | Recursos de Capacitación Online | BSG Institute',
      slug: 'bs-campus',
      description: 'Accede a blogs, artículos, webinars y videos en BS Campus. Encuentra recursos exclusivos sobre Big Data, Analytics, Proyectos y más áreas de formación.',
      keywords: 'BS Campus, recursos de capacitación, blogs de formación, webinars educativos, videos de aprendizaje, BSG Institute',
      ogDescription: 'Explora BS Campus y accede a contenido exclusivo: blogs, webinars, videos y artículos sobre diversas áreas de capacitación profesional.',
      twiterDescription: 'Descubre BS Campus: blogs, webinars y recursos educativos en Big Data, Analytics, Proyectos y más áreas de formación profesional.'
    });


    this._HelperService.recibirArrayFormacion.pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        this.Formacion=x;
        this.Formacion.forEach(x=>{
          x.change=false;
        })
      }
    });
    this.ListArticuloHome(1);
    this.ListArticuloHome(3);
    var sesion=this._SessionStorageService.SessionGetValue('campus');
    if(sesion !=undefined){
      this.index=parseInt(sesion);
      this._SessionStorageService.SessionDeleteValue('campus')
    }
  }
  ListArticuloHome(IdTipoArticulo:number){
    this._ArticuloService.ListArticuloHome(IdTipoArticulo).pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        if(IdTipoArticulo==1){
          this.blog=x.listaArticuloHomeDTO
        }

        if(IdTipoArticulo==3){
          this.whitePapers=x.listaArticuloHomeDTO
        }
      },
      error:(e)=>{
      }
    });

  }
  EventoInteraccionSelect(valor:string){
    this._HelperService.enviarMsjAcciones({Tag:'Select',Nombre:'Área',Tipo:'Select',Valor:valor})
  }
  EventoInteraccionSelectClick(){
    this._HelperService.enviarMsjAcciones({Tag:'Select',Nombre:'Áreas',Tipo:'Click'})
  }
}
