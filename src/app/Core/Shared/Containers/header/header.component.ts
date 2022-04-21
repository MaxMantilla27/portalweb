import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Basic, BasicBotonesExpandibles, BasicUrl,BasicUrlIcon } from 'src/app/Core/Models/BasicDTO';
import {SessionStorageService} from './../../Services/session-storage.service'
import {PaisService} from './../../Services/Pais/pais.service'
import { PaisDTO } from 'src/app/Core/Models/PaisDTO';
import { CarreraProfecionalService } from '../../Services/Carrera/carrera-profecional.service';
import { HeaderPermissionsService } from '../../Services/header-permissions.service';
import { AreacapasitacionService } from '../../Services/AreaCapasitacion/areacapasitacion.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

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
  ) { }

  ngOnInit(): void {
    console.log(this.token)
    this.GetPaises();
    this.GetCarreras();
    this.GetAreaCapasitacionList();
  }
  GetPaises(){
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
    this._AreacapasitacionService.GetAreaCapasitacionList().subscribe({
      next:(x)=>{
        this.Formacion=x.listaareaCapasitacionDTO.map((c:any)=>{
          var ps:BasicUrl={Nombre:c.nombre,value:c.id,Url:'/programas-certificaciones-cursos/'+c.id};
          return ps;
        });
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
        this.carreras.push({ Nombre: 'Ver Todo', value: 1, Url: '/login', style: { 'font-weight': 'bold' } });
        this.expandibles[1].estatus=true;
        this.expandibles[1].data=this.carreras;
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
    this.CodigoIso = this._SessionStorageService.SessionGetValue('ISO_PAIS')!=''?this._SessionStorageService.SessionGetValue('ISO_PAIS'):'INTC';
    if(this._HeaderPermissionsService.ValidateCarrerasTecnicas(this.CodigoIso)){
      console.log(1)
      this.GetEducacionTecnica();
    }else{
      this.expandibles[2].estatus=false;
    }
    if(this._HeaderPermissionsService.ValidateCarreras(this.CodigoIso)){
      console.log(2)
      this.GetCarrerasProfecionales();
    }else{
      this.expandibles[1].estatus=false;
    }
  }
  ChangePais(e:any){
    console.log(e)
    this._SessionStorageService.SessionSetValue('ISO_PAIS',e);
    this.GetCarreras();
  }
}
