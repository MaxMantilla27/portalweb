import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, PLATFORM_ID, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CardProgramasDTO } from 'src/app/Core/Models/BasicDTO';
import { ObtenerTopProgramasSendDTO } from 'src/app/Core/Models/HomeDTO';
import { ProgramasGeneralDTO } from 'src/app/Core/Models/ProgramasGeneralesDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { HomeService } from 'src/app/Core/Shared/Services/Home/home.service';

@Component({
  selector: 'app-home-programas',
  templateUrl: './home-programas.component.html',
  styleUrls: ['./home-programas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeProgramasComponent implements OnInit,OnChanges,OnDestroy {
  private signal$ = new Subject();

  isBrowser: boolean;
  constructor(
    private _HomeService:HomeService,
    private _HelperService:HelperService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  @Input() IdArea:number=0;
  @Input() change:boolean|undefined=false;
  public programas:Array<CardProgramasDTO>=[];
  public stepProgramas:Array<Array<CardProgramasDTO>>=[];
  public innerWidth: any;
  public seccionStep=4;
  ngOnInit(): void {
    this._HelperService.recibirChangePais.pipe(takeUntil(this.signal$)).subscribe(x=>{
      console.log(x)
      if(this.change==true){
        this.GetProgramasHome()
      }
    })
    if(this.isBrowser){
      this.innerWidth = window.innerWidth;
      if(this.innerWidth<992)this.seccionStep=2;
      if(this.innerWidth<768)this.seccionStep=1;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.change==true){
      console.log(this.change)
      console.log(this.IdArea)
      this.GetProgramasHome();
    }
  }
  GetProgramasHome(){
    var json:ObtenerTopProgramasSendDTO={IdArea:this.IdArea,Top:10};
    this._HomeService.GetProgramasHome(json).pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        console.log(x)
        this.programas=[];
        this.stepProgramas=[];
        this.programas=x.listaProgramasGeneralesTop.map(
          (c:any)=>{
            var content='Inversión <br />';
            c.tipoPago.forEach((element: any) => {
              if(element.paquete==null || element.paquete==1){
                if(element.tipoPago.toUpperCase()=='CONTADO'){
                  content+='Precio al contado '+element.simbolo+'.'+element.cuotas+'<br />'
                }else{
                  content+='Precio en cuotas '+element.simbolo+'.'+element.matricula+' + '+element.nroCuotas+' cuotas mensuales de '+element.simbolo+'.'+element.cuotas+'<br />'
                }
              }
            });
            var urlArea=c.areaCapacitacion.replace(/\s+/g, '-')
            var urlSubArea=c.nombre.replace(' - ', '-')
            var urlSubArea=urlSubArea.replace(/\s+/g, '-')
            //console.log('/'+urlArea+'/'+urlSubArea+'-'+c.idBusqueda);
            var ps:CardProgramasDTO={
                Content:c.descripcion,
                Inversion:content,
                Url:'/'+urlArea+'/'+urlSubArea+'-'+c.idBusqueda,
                Img:'https://img.bsginstitute.com/repositorioweb/img/programas/'+c.imagen,
                ImgAlt:c.imagenAlt,
                Title:c.nombre};
            return ps;
          }
        );
        var ind=1;
        var step:Array<any>=[];
        this.programas.push({
          Content:'',
          Inversion:'',
          Url:'/programas-certificaciones-cursos/'+this.IdArea,
          ImgAlt:'',
          Title:'',
          Img:''
        })
        this.programas.forEach(
          p=>{
            step.push(p);
            if(ind==this.seccionStep){
              this.stepProgramas.push(step);
              step=[];
              ind=0
            }
            ind++
          }
        );
        if(step.length>0){
          this.stepProgramas.push(step);
        }
      },
      error:(x)=>{console.log(x)}
    });
  }

}
