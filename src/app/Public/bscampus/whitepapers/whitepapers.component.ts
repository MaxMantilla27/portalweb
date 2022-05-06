
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { formulario } from 'src/app/Core/Models/Formulario';
import { listaTagDTO } from 'src/app/Core/Models/listaTagDTO';
import { WhitePapersDTO } from 'src/app/Core/Models/WhitePaperDTO';
import { ArticuloService } from 'src/app/Core/Shared/Services/Articulo/articulo.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { TagService } from 'src/app/Core/Shared/Services/Tag/tag.service';

@Component({
  selector: 'app-whitepapers',
  templateUrl: './whitepapers.component.html',
  styleUrls: ['./whitepapers.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WhitepapersComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private _ArticuloService: ArticuloService,
    private _SessionStorageService:SessionStorageService,
    private _TagService:TagService
  ) {}
  public idWeb = 0;
  public UrlWeb='';
  public Title='';
  public descripcion='';
  public contenido='';
  public imagen=''
  public alt=''
  public tags:Array<listaTagDTO>=[]
  public migaPan: any =  [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: 'BS Campus',
      urlWeb: '/bs-campus'
    },
    {
      titulo: 'White Papers',
      urlWeb: '/bs-campus'
    },
    {
      titulo: '',
      urlWeb: ''
    }
  ];


  statuscharge=false;
  formVal:boolean=false;
  public whitepaper:WhitePapersDTO={
    nombres:'',
    apellidos:'',
    email:'',
    pais:undefined,
    region:undefined,
    telefono:'',
    cargo:undefined,
    areaF:undefined,
    areaT:undefined,
    industria:undefined,
  }
  public fileds:Array<formulario>=[];
  ngOnInit(): void {
    this.addFielOptions()
    this.activatedRoute.params.subscribe({
      next: (x) => {
        var whitepaper = x['whitepaper'].split('-');
        this.idWeb = whitepaper[whitepaper.length - 1];
        this.UrlWeb=whitepaper.slice(0, -1).join('-')
        this.Title=whitepaper.slice(0, -1).join(' ')
        this.migaPan[3].titulo=this.Title;
      },
    });
    this.ObtenerArticuloDetalleHome();
    this.ListTagArticuloRelacionadoPorIdWeb();
  }
  ObtenerArticuloDetalleHome(){
    this._ArticuloService.ObtenerArticuloDetalleHome(3,this.idWeb,this.UrlWeb).subscribe({
      next:(x)=>{
        console.log(x)
        this.migaPan[3].titulo=x.articuloDetalleHomeDTO.articuloDetalle.nombre;
        this.Title=x.articuloDetalleHomeDTO.articuloDetalle.nombre;
        var content=x.articuloDetalleHomeDTO.articuloDetalle.contenido.split('Contenidos');
        this.descripcion=content[0].split('<h3')[0]
        this.contenido=content[1].split('</h3>')[1]
        this.imagen=x.articuloDetalleHomeDTO.articuloDetalle.imgPortada;
        this.imagen=this.imagen.toLowerCase();
        this.imagen=this.imagen.split('´').join('');
        this.alt=x.articuloDetalleHomeDTO.articuloDetalle.imgPortadaAlt;

      }
    })
  }
  ListTagArticuloRelacionadoPorIdWeb(){
    this._TagService.ListTagArticuloRelacionadoPorIdWeb(this.idWeb).subscribe({
      next:(x)=>{
        console.log(x)
        this.tags=x.listaTagDTO
        this.tags.forEach(x=>{
          x.codigo='/tag/'+x.codigo
        })
      }
    })
  }
  migaPanChange(e:any){
    if(e.titulo=="White Papers"){
      this._SessionStorageService.SessionSetValue('campus','1');
    }
  }
  dowloadWP(e:any){
    console.log(e)
  }
  addFielOptions(){
    this.fileds.push({
      nombre:"nombres",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required],
      label:"Nombres",
      style:"color: #7d7d7c;"
    })
    this.fileds.push({
      nombre:"apellidos",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required],
      label:"Apellidos",
      //style:"font-size: 12px;color: #7d7d7c;"
    })
    this.fileds.push({
      nombre:"email",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required,Validators.email],
      label:"Email",
      //style:"font-size: 12px;color: #7d7d7c;"
    })
    this.fileds.push({
      nombre:"pais",
      tipo:"number",
      valorInicial:"",
      validate:[Validators.required],
      label:"Pais",
      //style:"font-size: 12px;color: #7d7d7c;"
    })
    this.fileds.push({
      nombre:"region",
      tipo:"number",
      valorInicial:"",
      validate:[Validators.required],
      label:"Region",
      //style:"font-size: 12px;color: #7d7d7c;"
    })
    this.fileds.push({
      nombre:"telefono",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required,Validators.minLength(5)],
      label:"Telefono",
      //style:"font-size: 12px;color: #7d7d7c;"
    })
    this.fileds.push({
      nombre:"cargo",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required],
      label:"Cargo",
      //style:"font-size: 12px;color: #7d7d7c;"
    })
    this.fileds.push({
      nombre:"areaF",
      tipo:"number",
      valorInicial:"",
      validate:[Validators.required],
      label:"Area Formacion",
      //style:"font-size: 12px;color: #7d7d7c;"
    })
    this.fileds.push({
      nombre:"areaT",
      tipo:"number",
      valorInicial:"",
      validate:[Validators.required],
      label:"Area Trabajo",
      //style:"font-size: 12px;color: #7d7d7c;"
    })
    this.fileds.push({
      nombre:"industria",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required],
      label:"Industria",
      //style:"font-size: 12px;color: #7d7d7c;"
    })
  }
}
