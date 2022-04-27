import { Component, ComponentFactoryResolver, EventEmitter, OnInit, Output } from '@angular/core';
import { Basic, BasicBotonesExpandibles, BasicUrl,BasicUrlIcon } from 'src/app/Core/Models/BasicDTO';
import {SessionStorageService} from './../../Services/session-storage.service'
import {PaisService} from './../../Services/Pais/pais.service'
import { PaisDTO } from 'src/app/Core/Models/PaisDTO';
import { CarreraProfecionalService } from '../../Services/Carrera/carrera-profecional.service';
import { HeaderPermissionsService } from '../../Services/header-permissions.service';
import { AreacapasitacionService } from '../../Services/AreaCapasitacion/areacapasitacion.service';
import { HelperService } from '../../Services/helper.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output()
  OnClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  public Formacion: Array<BasicUrl> = [];
  public carreras: Array<BasicUrl> = [];
  public tecnica: Array<BasicUrl> = [];
  public paises: Array<BasicUrlIcon>=[] ;
  public paisesApi:Array<PaisDTO>=[];
  public expandibles:Array<BasicBotonesExpandibles>=[
    {
      Nombre:'Formacion Continua',
      data:this.Formacion,
      estatus:true
    },
    {
      Nombre:'Carreras Profecionales',
      data:this.carreras,
      estatus:false
    },
    {
      Nombre:'Educacion Tecnica',
      data:this.tecnica,
      estatus:false
    }
  ]
  public token:boolean=this._SessionStorageService.validateTokken();
  public CodigoIso:string='INTC';

  constructor(
    private _SessionStorageService:SessionStorageService,
    private _PaisService:PaisService,
    private _CarreraProfecionalService:CarreraProfecionalService,
    private _HeaderPermissionsService:HeaderPermissionsService,
    private _AreacapasitacionService:AreacapasitacionService,
    private _HelperService :HelperService
  ) { }

  ngOnInit(): void {
    this.GetPaises();
    this.GetCarreras();
    this.GetAreaCapasitacionList();
  }
  GetPaises(){
    this.paises=[];
    this._PaisService.GetPaises().subscribe({
      next:(x)=>{
        this.paises=x.listaPaisCabeceraDTO.map((p:any)=>{
          var ps:BasicUrlIcon={Nombre:p.pais,value:p.codigoIso,Url:p.flag,Icon:p.icono};
          return ps;
        });
      },
      error:(x)=>{console.log(x)}
    });
  }
  GetAreaCapasitacionList(){
    this.Formacion=[];
    this._AreacapasitacionService.GetAreaCapasitacionList().subscribe({
      next:(x)=>{
        this.Formacion=x.listaareaCapasitacionDTO.map((c:any)=>{
          var ps:BasicUrl={Nombre:c.nombre,value:c.id,Url:'/programas-certificaciones-cursos/'+c.id};
          return ps;
        });
        var formacionOrden:Array<BasicUrl>=x.listaareaCapasitacionDTO.map((c:any)=>{
          var ps:BasicUrl={Nombre:c.nombre,value:c.id,Url:'/programas-certificaciones-cursos/'+c.id};
          return ps;
        });
        formacionOrden.sort(function(a, b) {
          return a.value - b.value;
        });
        console.log(formacionOrden);
        this._HelperService.enviarArrayFormacion(formacionOrden);
        this.Formacion.push({ Nombre: 'Ver Todo', value: 1, Url: '/login', style: { 'font-weight': 'bold' } });
        this.expandibles[0].data=this.Formacion;
      },
      error:(x)=>{console.log(x)}
    });
  }
  GetCarrerasProfecionales(){
    this._CarreraProfecionalService.GetCarreras(11).subscribe({
      next:(x)=>{
        this.carreras=x.listaProfesionCabeceraDTO.map((c:any)=>{
          var ps:BasicUrl={Nombre:c.titulo,value:c.idBusqueda,Url:'/'+c.idBusqueda};
          return ps;
        });
        this._HelperService.enviarArrayCarrera(this.carreras);
        this.carreras.push({ Nombre: 'Ver Todo', value: 1, Url: '/login', style: { 'font-weight': 'bold' } });
        if(this.CodigoIso.toLowerCase()=="co"){
          this.expandibles[1].Nombre='Educacion para el Trabajo';
        }else{
          this.expandibles[1].Nombre='Carreras Profecionales';
        }
        this.expandibles[1].estatus=true;
        this.expandibles[1].data=this.carreras;
        this._HelperService.enviarStringCarrera(this.expandibles[1].Nombre);
      },
      error:(x)=>{console.log(x)}
    });
  }
  GetEducacionTecnica(){
    this._CarreraProfecionalService.GetCarreras(16).subscribe({
      next:(x)=>{
        this.tecnica=x.listaProfesionCabeceraDTO.map((c:any)=>{
          var ps:BasicUrl={Nombre:c.titulo,value:c.idBusqueda,Url:'/'+c.idBusqueda};
          return ps;
        });
        this.tecnica.push({ Nombre: 'Ver Todo', value: 1, Url: '/login', style: { 'font-weight': 'bold' } });
        this.expandibles[2].estatus=true;
        this.expandibles[2].data=this.tecnica;

      },
      error:(x)=>{console.log(x)}
    });
  }
  GetCarreras(){
    this.carreras=[];
    this.tecnica=[];
    this.CodigoIso = this._SessionStorageService.SessionGetValue('ISO_PAIS')!=''?this._SessionStorageService.SessionGetValue('ISO_PAIS'):'INTC';
    this._SessionStorageService.SessionSetValue('ISO_PAIS',this.CodigoIso);
    if(this._HeaderPermissionsService.ValidateCarrerasTecnicas(this.CodigoIso)){
      this.GetEducacionTecnica();
    }else{
      this.expandibles[2].estatus=false;
    }
    if(this._HeaderPermissionsService.ValidateCarreras(this.CodigoIso)){
      this.GetCarrerasProfecionales();
    }else{
      this.expandibles[1].estatus=false;
      this._HelperService.enviarStringCarrera('');
    }
  }
  ChangePais(e:any){
    this._SessionStorageService.SessionSetValue('ISO_PAIS',e);
    this.GetCarreras();
  }
}
