import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Basic, CardProgramasDTO } from 'src/app/Core/Models/BasicDTO';
import { FiltroProgramasEnvioDTO, FiltrosProgramasDTO, ModalidadDTO, SubAreaCapacitacionDTO,TipoProgramaDTO} from 'src/app/Core/Models/FiltrosProgramasDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { ProgramasService } from 'src/app/Core/Shared/Services/Programas/programas.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-programas',
  templateUrl: './programas.component.html',
  styleUrls: ['./programas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProgramasComponent implements OnInit {

  @ViewChild('SubAreaMatSelect')
  SelectSubArreas!: MatSelect;
  @ViewChild('TipoProgramaMatSelect')
  SelectTipoPrograma!: MatSelect;
  @ViewChild('ModalidadMatSelect')
  SelectModalidad!: MatSelect;
  @ViewChild('fixedelement') element!: ElementRef;
  isBrowser: boolean;
  constructor(
    private activatedRoute:ActivatedRoute,
    private _ProgramasService:ProgramasService,
    private _SessionStorageService:SessionStorageService,
    private _HelperService:HelperService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  public IdArea:number=0;
  public Title='Programas, certificaciónes y cursos';
  public filtros:FiltrosProgramasDTO={areaCapacitacion:[],modalidad:[],tipoPrograma:[]};
  public rangoPrecios=9700
  public monedaRango='US$ 0'
  public CodigoIso:string='INTC';
  public textoResult='';
  public SubAreas:Array<SubAreaCapacitacionDTO>=[];
  public SubAreasTrigger='';
  public SubAreasTriggerOther='';
  public SubAreaSelect:Array<number>=[];
  public TipoPrograma:Array<TipoProgramaDTO>=[];
  public TipoProgramaTrigger='';
  public TipoProgramaTriggerOther='';
  public TipoProgramaSelect:Array<number>=[];
  public programas:Array<CardProgramasDTO>=[];
  public Modalidad:Array<ModalidadDTO>=[];
  public ModalidadTrigger='';
  public ModalidadTriggerOther='';
  public ModalidadSelect:Array<number>=[];
  public send:FiltroProgramasEnvioDTO={Minimo:0,Maximo:0,idArea:[],IdCategoria:[],idSubArea:[],Modalidad:[]};
  public charge=false;
  public rangoselect=0;
  public TagSubAreas:Array<Basic>=[]
  public TagModalidad:Array<Basic>=[]
  public TagTipoPrograma:Array<Basic>=[]
  public resposive=false;
  public innerWidth: any;
  public scrollValue=0;

  ngOnInit(): void {
    if(this.isBrowser){
      this.innerWidth = window.innerWidth;
      if(this.innerWidth<768)this.resposive=true;
    }
    this.CodigoIso = this._SessionStorageService.SessionGetValue('ISO_PAIS')!=''?this._SessionStorageService.SessionGetValue('ISO_PAIS'):'INTC';
    if(this.CodigoIso.toUpperCase()=='PE'){this.rangoPrecios=16800;this.monedaRango='S/. 0 ';}
    if(this.CodigoIso.toUpperCase()=='CO'){this.rangoPrecios=10000000;this.monedaRango='COL$ 0';}
    if(this.CodigoIso.toUpperCase()=='BO'){this.rangoPrecios=37300;this.monedaRango='Bs 0 ';}
    this.rangoselect=this.rangoPrecios;
    this.activatedRoute.params.subscribe({
      next:(x)=>{
        if(x['IdArea']!=undefined){
          this.IdArea=x['IdArea']
        }else{
          this.IdArea=0;
        }
        this.GetProgramas();
        this.GetFiltroProgramas()
      }
    })
  }
  ngAfterViewInit() {
  }
  GetFiltroProgramas(){
    this._ProgramasService.GetFiltroProgramas(this.IdArea).subscribe({
      next:(x)=>{
        this.filtros=x.filtros;
        var area=this.filtros.areaCapacitacion.find(x=>x.id==this.IdArea);
        this.Title=area==undefined?this.Title:area.nombre;
        this.SubAreas=area==undefined?[]:area.subAreaCapacitacion;

        this.Modalidad=this.filtros.modalidad;
        this.TipoPrograma=this.filtros.tipoPrograma;
        this.IdArea=this.IdArea;
      }
    })
  }
  AreasCapasitacion(e:any){
    this.IdArea=e;
    var area=this.filtros.areaCapacitacion.find(x=>x.id==this.IdArea);
    this.Title=area==undefined?this.Title:area.nombre;
    if(this.IdArea==0){
      this.Title='Programas, certificaciónes y cursos';
    }
    this.SubAreas=area==undefined?[]:area.subAreaCapacitacion;
    this.SubAreaSelect=[];
    this.GetProgramas();
  }
  RemoveSubArea(i:number){
    if(this.charge==false){
      this.SelectSubArreas.options.find(x=>x.value==this.SubAreaSelect[i])?.deselect();
      this.SetSubAreaSelect();
      this.SetTags();
      this.GetProgramas();
    }
  }
  onSliderChage(e:any){
    this.GetProgramas();
  }
  SubAreasChange(event: any) {
    if(!event) {
      this.SetSubAreaSelect();
      this.SetTags();
      this.GetProgramas();
    }
  }
  SetSubAreaSelect(){
    var subarea=this.SubAreas.find(x=>x.id==this.SubAreaSelect[0]);

    this.SubAreasTrigger = subarea==undefined?this.Title:subarea.nombre;
    if(this.SubAreaSelect.length>1){
      this.SubAreasTriggerOther = '(+'+(this.SubAreaSelect.length-1).toString()+' mas)';
    }else{
      this.SubAreasTriggerOther=''
    }
  }
  TipoProgramaChange(event: any) {
    if(!event) {
      this.SetTipoProgramSelect();
      this.SetTags();
      this.GetProgramas();
    }
  }
  SetTipoProgramSelect(){
    var tprog=this.TipoPrograma.find(x=>x.id==this.TipoProgramaSelect[0]);
    this.TipoProgramaTrigger = tprog==undefined?this.Title:tprog.nombre;
    if(this.TipoProgramaSelect.length>1){
      this.TipoProgramaTriggerOther = '(+'+(this.TipoProgramaSelect.length-1).toString()+' mas)';
    }else{
      this.TipoProgramaTriggerOther=''
    }
  }
  RemoveTipoPrograma(i:number){
    if(this.charge==false){
      this.SelectTipoPrograma.options.find(x=>x.value==this.TipoProgramaSelect[i])?.deselect();
      this.SetTipoProgramSelect();
      this.SetTags();
      this.GetProgramas();
    }
  }
  ModalidadChange(event: any) {
    if(!event) {
      this.SetModalidadSelect();
      this.SetTags();
      this.GetProgramas();
    }
  }
  SetModalidadSelect(){
    var mod=this.Modalidad.find(x=>x.id==this.ModalidadSelect[0]);
    this.ModalidadTrigger = mod==undefined?this.Title:mod.nombre;
    if(this.ModalidadSelect.length>1){
      this.ModalidadTriggerOther = '(+'+(this.ModalidadSelect.length-1).toString()+' mas)';
    }else{
      this.ModalidadTriggerOther=''
    }
  }
  RemoveModalidad(i:number){
    if(this.charge==false){
      this.SelectModalidad.options.find(x=>x.value==this.ModalidadSelect[i])?.deselect();
      this.SetModalidadSelect();
      this.SetTags();
      this.GetProgramas();
    }
  }
  GetProgramas(){
    this.send.Maximo=this.rangoselect;
    console.log(this.IdArea);
    this.send.idArea=[this.IdArea];
    if(Number(this.IdArea)==0 || isNaN(this.IdArea)){
      this.send.idArea=[];
      console.log(this.send.idArea);
    }
    this.send.idSubArea=this.SubAreaSelect;
    this.send.IdCategoria=this.TipoProgramaSelect;
    this.send.Modalidad=this.ModalidadSelect;
    this.charge=true;
    this._ProgramasService.GetProgramas(this.send).subscribe({
      next:(x)=>{
        this.programas=x.listaProgramasGeneralesTop.map(
          (c:any)=>{

            var urlArea=c.areaCapacitacion.replace(/\s+/g, '-')
            var urlSubArea=c.nombre.replace(' - ', '-')
            var urlSubArea=urlSubArea.replace(/\s+/g, '-')
            var ps:CardProgramasDTO={Content:c.montoPagoDescripcion,Url:'/'+urlArea+'/'+urlSubArea+'-'+c.idBusqueda,Img:'https://img.bsginstitute.com/repositorioweb/img/programas/'+c.imagen,ImgAlt:c.imagenAlt,Title:c.nombre};
            return ps;
          }
        );
        this.textoResult="Se encontraron "+this.programas.length+" resultados";
        this.charge=false
      },
      error:(x)=>{
        this.charge=false
      }
    })
  }
  SetTags(){
    this.TagSubAreas=[]
    this.TagTipoPrograma=[]
    this.TagModalidad=[]
    this.SubAreas.forEach(x=>{
      this.SubAreaSelect.forEach(s=>{
        if(x.id==s){
          this.TagSubAreas.push({value:s,Nombre:x.nombre})
        }
      })
    })
    this.TipoPrograma.forEach(x=>{
      this.TipoProgramaSelect.forEach(t=>{
        if(x.id==t){
          this.TagTipoPrograma.push({value:t,Nombre:x.nombre})
        }
      })
    })
    this.Modalidad.forEach(x=>{
      this.ModalidadSelect.forEach(m=>{
        if(x.id==m){
          this.TagModalidad.push({value:m,Nombre:x.nombre})
        }
      })
    })
  }
}
