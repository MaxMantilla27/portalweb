import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Basic, CardProgramasDTO } from 'src/app/Core/Models/BasicDTO';
import { FiltroProgramasEnvioDTO, FiltrosProgramasDTO, ModalidadDTO, SubAreaCapacitacionDTO,TipoProgramaDTO} from 'src/app/Core/Models/FiltrosProgramasDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { ProgramasService } from 'src/app/Core/Shared/Services/Programas/programas.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { FiltroProgramasComponent } from './filtro-programas/filtro-programas.component';

@Component({
  selector: 'app-programas',
  templateUrl: './programas.component.html',
  styleUrls: ['./programas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProgramasComponent implements OnInit {

  private signal$ = new Subject();
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
    @Inject(PLATFORM_ID) platformId: Object,
    private _bottomSheet: MatBottomSheet,
    private _SnackBarServiceService:SnackBarServiceService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  public IdArea:number=0;
  public Title='Programas, certificaciones y cursos';
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
  public TagBusqueda:Array<Basic>=[]
  public TagAreas:Array<Basic>=[]
  public TagSubAreas:Array<Basic>=[]
  public TagModalidad:Array<Basic>=[]
  public TagTipoPrograma:Array<Basic>=[]
  public resposive=false;
  public innerWidth: any;
  public scrollValue=0;
  public expancions=[false,false,false,false]
  public buscar=''
  public cantidadProgramas=0

  public migaPan = [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    }

  ]
  ngOnInit(): void {
    this.buscar=this._SessionStorageService.SessionGetValue('BusquedaPrograma')
    if(this._SessionStorageService.SessionGetValue('BusquedaPrograma')!=''){
      this._SessionStorageService.SessionDeleteValue('BusquedaPrograma');
    }
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
          this.migaPan.push(
            {
              titulo: 'Programas, certificaciones y cursos',
              urlWeb: '/programas-certificaciones-cursos/'+this.IdArea
            }
          )
        }else{
          this.IdArea=0;
          this.migaPan.push(
            {
              titulo: 'Programas, certificaciones y cursos',
              urlWeb: '/programas-certificaciones-cursos'
            }
          )
        }
        this.GetFiltroProgramas()
      }
    })
  }
  ngAfterViewInit() {
  }
  removeAccents(strng:string){
    return strng.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }
  validateSearch(i:number){
    if(this.removeAccents(this.programas[i].Title).toLowerCase().includes(this.removeAccents(this.buscar).toLowerCase()) ||
    this.removeAccents(this.programas[i].Content).toLowerCase().includes(this.removeAccents(this.buscar).toLowerCase())){
      return true
    }
    return false
  }
  openExpand(i:number){
    console.log(i)

    if(this.expancions[i]==false){
      this.expancions=[false,false,false,false]
      this.expancions[i]=true
    }else{
      this.expancions[i]=false
    }
  }
  GetFiltroProgramas(){
    this._ProgramasService.GetFiltroProgramas(this.IdArea).subscribe({
      next:(x)=>{
        this.filtros=x.filtros;
        var area:any;
        this.filtros.areaCapacitacion.forEach(x=>{
          if(x.id==this.IdArea){
            x.select=true
            area=x
          }
        })
        this.GetProgramas();
        //this.Title=area==undefined?this.Title:area.nombre;
        this.SubAreas=area==undefined?[]:area.subAreaCapacitacion;

        this.Modalidad=this.filtros.modalidad;
        this.TipoPrograma=this.filtros.tipoPrograma;
      }
    })
  }
  SelectMod(index:number){
    if(this.charge==false){
      if(this.Modalidad[index].select==true){
        this.Modalidad[index].select=false
      }else{
        this.Modalidad[index].select=true
      }
      this.GetProgramas();
    }
  }
  SelectTipoP(index:number){
    if(this.charge==false){
      if(this.TipoPrograma[index].select==true){
        this.TipoPrograma[index].select=false
      }else{
        this.TipoPrograma[index].select=true
      }
      this.GetProgramas();
    }
  }
  SelectAreas(index:number){
    if(this.charge==false){
      if(this.filtros.areaCapacitacion[index].select==true){
        this.filtros.areaCapacitacion[index].select=false
        this.filtros.areaCapacitacion[index].subAreaCapacitacion.forEach(x=>{
          x.select=false
        })
      }else{
        this.filtros.areaCapacitacion[index].select=true
      }
      this.GetProgramas();
    }
  }
  SelectSubAreas(index:number,indexSub:number){
    if(this.charge==false){
      if(this.filtros.areaCapacitacion[index].subAreaCapacitacion[indexSub].select==true){
        this.filtros.areaCapacitacion[index].subAreaCapacitacion[indexSub].select=false
      }else{
        this.filtros.areaCapacitacion[index].subAreaCapacitacion[indexSub].select=true
      }
      this.GetProgramas();
    }
  }
  AreasCapasitacion(e:any){
    this.IdArea=e;
    var area=this.filtros.areaCapacitacion.find(x=>x.id==this.IdArea);
    // this.Title=area==undefined?this.Title:area.nombre;
    // if(this.IdArea==0){
    //   this.Title='Programas, certificaciónes y cursos';
    // }
    this.SubAreas=area==undefined?[]:area.subAreaCapacitacion;
    this.SubAreaSelect=[];
    this.GetProgramas();
  }
  RemoveArea(i:number){
    console.log(i)
    if(this.charge==false){
      this.filtros.areaCapacitacion.forEach(x=>{
        if(x.id==i){
          x.select=false
          x.subAreaCapacitacion.forEach(s=>{
            s.select=false
          })
        }
      })
      this.GetProgramas();
    }
  }
  RemoveSubArea(i:number){
    if(this.charge==false){
      this.filtros.areaCapacitacion.forEach(x=>{
        if(x.select!=undefined && x.select==true){
          x.subAreaCapacitacion.forEach(s=>{
            if(s.id==i){
              s.select=false
            }
          })
        }
      })
      this.GetProgramas();
    }
  }

  RemoveModalidad(i:number){
    if(this.charge==false){
      this.Modalidad.forEach(x=>{
        if(x.id==i){
          x.select=false
        }
      })
      this.GetProgramas();
    }
  }

  RemoveTipoPrograma(i:number){
    if(this.charge==false){
      this.TipoPrograma.forEach(x=>{
        if(x.id==i){
          x.select=false
        }
      })
      this.GetProgramas();
    }
  }
  RemoveAll(){
    if(this.charge==false){
      this.filtros.areaCapacitacion.forEach(x=>{
        if(x.select!=undefined && x.select==true){
          x.select=false
          x.subAreaCapacitacion.forEach(s=>{
            if(s.select!=undefined && s.select==true){
              s.select=false
            }
          })
        }
      })
      this.Modalidad.forEach(x=>{
        if(x.select!=undefined && x.select==true){
          x.select=false
        }
      })
      this.TipoPrograma.forEach(x=>{
        if(x.select!=undefined && x.select==true){
          x.select=false
        }
      })
      this.buscar='';
      this.GetProgramas();
    }
  }
  onSliderChage(e:any){
    this.GetProgramas();
  }
  SubAreasChange(event: any) {
    if(!event) {
      this.SetSubAreaSelect();
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
  ModalidadChange(event: any) {
    if(!event) {
      this.GetProgramas();
    }
  }
  // SetModalidadSelect(){
  //   var mod=this.Modalidad.find(x=>x.id==this.ModalidadSelect[0]);
  //   this.ModalidadTrigger = mod==undefined?this.Title:mod.nombre;
  //   if(this.ModalidadSelect.length>1){
  //     this.ModalidadTriggerOther = '(+'+(this.ModalidadSelect.length-1).toString()+' mas)';
  //   }else{
  //     this.ModalidadTriggerOther=''
  //   }
  // }
  GetProgramas(){
    this.textoResult=""
    this.SetTags();
    this.send.Maximo=this.rangoselect;
    this.send.idArea=[]
    this.send.idSubArea=[]
    this.send.IdCategoria=[];
    this.send.Modalidad=[]
    this.filtros.areaCapacitacion.forEach(x=>{
      if(x.select!=undefined && x.select==true){
        this.send.idArea.push(x.id)
        x.subAreaCapacitacion.forEach(s=>{
          if(s.select!=undefined && s.select==true){
            this.send.idSubArea.push(s.id);
          }
        })
      }
    })
    this.TipoPrograma.forEach(x=>{
      if(x.select!=undefined && x.select==true){
        this.send.IdCategoria.push(x.id)
      }
    })
    this.Modalidad.forEach(x=>{
      if(x.select!=undefined && x.select==true){
        this.send.Modalidad.push(x.id)
      }
    })
    this.charge=true;
    this._ProgramasService.GetProgramas(this.send).subscribe({
      next:(x)=>{
        console.log(x)
        this.programas=x.listaProgramasGeneralesTop.map(
          (c:any)=>{

            var urlArea=c.areaCapacitacion.replace(/\s+/g, '-')
            var urlSubArea=c.nombre.replace(' - ', '-')
            var urlSubArea=urlSubArea.replace(/\s+/g, '-')
            var ps:CardProgramasDTO={
              Inversion:c.montoPagoDescripcion,
              Content:c.descripcion,
              Url:'/'+urlArea+'/'+urlSubArea+'-'+c.idBusqueda,
              Img:'https://img.bsginstitute.com/repositorioweb/img/programas/'+c.imagen,ImgAlt:c.imagenAlt,Title:c.nombre};
            return ps;
          }
        );
        this.SetCantidadProgramas()
        this.charge=false
      },
      error:(x)=>{
        this.charge=false
      }
    })
  }
  SetCantidadProgramas(){
    this.cantidadProgramas=0
    this.programas.forEach(x=>{
      if(this.removeAccents(x.Title).toLowerCase().includes(this.removeAccents(this.buscar).toLowerCase()) ||
      this.removeAccents(x.Content).toLowerCase().includes(this.removeAccents(this.buscar).toLowerCase())){
        this.cantidadProgramas++
      }
    })
    this.textoResult="Se encontraron ("+this.cantidadProgramas+") resultados";
    // this._SnackBarServiceService.openSnackBar(this.textoResult,'x',1005,"snackbarCrucigramaInfo",'left');
  }
  SetTags(){
    this.TagAreas=[]
    this.TagSubAreas=[]
    this.TagTipoPrograma=[]
    this.TagModalidad=[]

    console.log(this.filtros.areaCapacitacion)
    this.filtros.areaCapacitacion.forEach(x=>{
      if(x.select!=undefined && x.select==true){
        this.TagAreas.push({value:x.id,Nombre:x.nombre});
        x.subAreaCapacitacion.forEach(s=>{
          if(s.select!=undefined && s.select==true){
            this.TagSubAreas.push({value:s.id,Nombre:s.nombre})
          }
        })
      }
    })
    this.TipoPrograma.forEach(x=>{
      if(x.select!=undefined && x.select==true){
        this.TagTipoPrograma.push({value:x.id,Nombre:x.nombre})
      }
    })
    this.Modalidad.forEach(x=>{
      if(x.select!=undefined && x.select==true){
        this.TagModalidad.push({value:x.id,Nombre:x.nombre})
      }
    })
  }
  openBottomSheet(){
    if(this.filtros.areaCapacitacion.length>0){
      const dialogRef = this._bottomSheet.open(FiltroProgramasComponent,{
        panelClass:'FilterPanelProgram',
        data: { TagBusqueda:this.TagBusqueda,
          TagAreas:this.TagAreas,
          TagSubAreas:this.TagSubAreas,
          TagModalidad:this.TagModalidad,
          TagTipoPrograma:this.TagTipoPrograma,
          filtros:this.filtros,
          Modalidad:this.Modalidad,
          TipoPrograma:this.TipoPrograma,
          buscar:this.buscar,
          textoResult:this.textoResult },
      });

      dialogRef.afterDismissed().pipe(takeUntil(this.signal$)).subscribe((result) => {
        console.log(result);
        if(result!=undefined){
          this.filtros = result.filtros;
          this.Modalidad = result.Modalidad;
          this.TipoPrograma = result.TipoPrograma;
          this.buscar = result.buscar;
          this.GetProgramas();
        }
      });

    }
  }
}
