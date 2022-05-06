import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { formulario } from 'src/app/Core/Models/Formulario';
import { FormularioContactoDTO } from 'src/app/Core/Models/FormularioDTO';
import { listaTagDTO } from 'src/app/Core/Models/listaTagDTO';
import { ArticuloService } from 'src/app/Core/Shared/Services/Articulo/articulo.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { TagService } from 'src/app/Core/Shared/Services/Tag/tag.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BlogComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private _ArticuloService: ArticuloService,
    private _SessionStorageService: SessionStorageService,
    private _TagService: TagService
  ) {}
  public idWeb = 0;
  public UrlWeb = '';
  public Title = '';
  public descripcion = '';
  public contenido = '';
  public imagen = '';
  public alt = '';
  public area=''
  public tags: Array<listaTagDTO> = [];
  public migaPan: any = [
    {
      titulo: 'Inicio',
      urlWeb: '/',
    },
    {
      titulo: 'BS Campus',
      urlWeb: '/bs-campus',
    },
    {
      titulo: 'Blogs',
      urlWeb: '/bs-campus',
    },
    {
      titulo: '',
      urlWeb: '',
    },
  ];

  statuscharge = false;
  formVal: boolean = false;
  public formularioContacto:FormularioContactoDTO={
    nombres:'',
    apellidos:'',
    email:'',
    pais:undefined,
    region:undefined,
    telefono:'',
  }
  public fileds: Array<formulario> = [];
  ngOnInit(): void {
    this.addFielOptions()
    this.activatedRoute.params.subscribe({
      next: (x) => {
        var whitepaper = x['blog'].split('-');
        this.idWeb = whitepaper[whitepaper.length - 1];
        this.UrlWeb=whitepaper.slice(0, -1).join('-')
        this.Title=whitepaper.slice(0, -1).join(' ')
      },
    });
    this.ObtenerArticuloDetalleHome();
    this.ListTagArticuloRelacionadoPorIdWeb();
  }
  ObtenerArticuloDetalleHome(){
    this._ArticuloService.ObtenerArticuloDetalleHome(1,this.idWeb,this.UrlWeb).subscribe({
      next:(x)=>{
        console.log(x)
        this.migaPan[3].titulo=x.articuloDetalleHomeDTO.articuloDetalle.areaCapacitacion;
        this.Title=x.articuloDetalleHomeDTO.articuloDetalle.nombre;
        this.descripcion=x.articuloDetalleHomeDTO.articuloDetalle.contenido
        this.area=x.articuloDetalleHomeDTO.articuloDetalle.areaCapacitacion
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
  dowloadBlog(e:any){
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
  }
}
