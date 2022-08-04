import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Basic, CardProgramasDTO } from 'src/app/Core/Models/BasicDTO';
import { ContactenosDTO } from 'src/app/Core/Models/ContactenosDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { FormularioContactoDTO } from 'src/app/Core/Models/FormularioDTO';
import { listaTagDTO } from 'src/app/Core/Models/listaTagDTO';
import { FormularioComponent } from 'src/app/Core/Shared/Containers/formulario/formulario.component';
import { ArticuloService } from 'src/app/Core/Shared/Services/Articulo/articulo.service';
import { DatosPortalService } from 'src/app/Core/Shared/Services/DatosPortal/datos-portal.service';
import { HelperService } from 'src/app/Core/Shared/Services/Helper/helper.service';
import { RegionService } from 'src/app/Core/Shared/Services/Region/region.service';
import { SeccionProgramaService } from 'src/app/Core/Shared/Services/SeccionPrograma/seccion-programa.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';
import { SnackBarServiceService } from 'src/app/Core/Shared/Services/SnackBarService/snack-bar-service.service';
import { TagService } from 'src/app/Core/Shared/Services/Tag/tag.service';
import { HelperService as Help} from 'src/app/Core/Shared/Services/helper.service';
import { Title } from '@angular/platform-browser';
import { SeoService } from 'src/app/Core/Shared/Services/seo.service';

import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BlogComponent implements OnInit {
  private signal$ = new Subject();
  @ViewChild(FormularioComponent)
  form!: FormularioComponent;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _ArticuloService: ArticuloService,
    private _SessionStorageService: SessionStorageService,
    private _TagService: TagService,
    private _RegionService:RegionService,
    private _DatosPortalService:DatosPortalService,
    private _HelperService: HelperService,
    private _SeccionProgramaService:SeccionProgramaService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _HelperServiceP:Help,
    private _SeoService:SeoService,
    private title:Title,
    private router:Router
  ) {}
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
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
  public initValues = false;
  public fileds: Array<formulario> = [];
  public programasRelacionados:Array<CardProgramasDTO>=[];
  public formularioContacto:FormularioContactoDTO={
    Nombres:'',
    Apellidos:'',
    Email:'',
    IdPais:0,
    IdRegion:0,
    Movil:'',
  }
  public DatosEnvioFormulario: ContactenosDTO={
    Nombres:'',
    Apellidos:'',
    Correo1:'',
    IdPais:0,
    IdRegion:0,
    Movil:'',
    IdCargo:0,
    IdAreaFormacion:0,
    IdAreaTrabajo:0,
    IdIndustria:0
  }
  public combosPrevios:any

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        var whitepaper = x['blog'].split('-');
        this.idWeb = whitepaper[whitepaper.length - 1];
        this.UrlWeb=whitepaper.slice(0, -1).join('-')
        this.Title=whitepaper.slice(0, -1).join(' ')
      },
    });
    this._HelperServiceP.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      this.combosPrevios=x.datosAlumno;
      console.log(this.combosPrevios)
      this.formularioContacto.Nombres= this.combosPrevios.nombres,
      this.formularioContacto.Apellidos= this.combosPrevios.apellidos,
      this.formularioContacto.Email= this.combosPrevios.email,
      this.formularioContacto.IdPais= this.combosPrevios.idPais,
      this.formularioContacto.IdRegion= this.combosPrevios.idDepartamento,
      this.formularioContacto.Movil= this.combosPrevios.telefono
      if(this.formularioContacto.IdPais!=undefined){
        this.GetRegionesPorPais(this.formularioContacto.IdPais);
      }
    });
    this.ObtenerArticuloDetalleHome();
    this.ListTagArticuloRelacionadoPorIdWeb();
    this.AddFields();
    this.ObtenerCombosPortal();
  }

  ListArticuloProgramaRelacionado(id:number){
    console.log(id)
    this._SeccionProgramaService.ListArticuloProgramaRelacionado(id).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        if(x.listaProgramaRelacionadoDTO!=null){
          this.programasRelacionados=x.listaProgramaRelacionadoDTO.map(
            (c:any)=>{

              var urlArea=c.areaCapacitacion.replace(/\s+/g, '-')
              var urlSubArea=c.nombre.replace(' - ', '-')
              var urlSubArea=urlSubArea.replace(/\s+/g, '-')
              var ps:CardProgramasDTO={Inversion:c.montoPagoDescripcion,Content:c.descripcion,Url:'/'+urlArea+'/'+urlSubArea+'-'+c.idBusqueda,Img:'https://img.bsginstitute.com/repositorioweb/img/programas/'+c.imagen,ImgAlt:c.imagenAlt,Title:c.nombre};
              return ps;
            }
          );
        }
      }
    })
  }
  ObtenerArticuloDetalleHome(){
    this._ArticuloService.ObtenerArticuloDetalleHome(1,this.idWeb,this.UrlWeb).pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        console.log(x)

        if(x.articuloDetalleHomeDTO!=undefined && x.articuloDetalleHomeDTO.parametroSeo!=undefined){
          var metas=x.articuloDetalleHomeDTO.parametroSeo;
          if(metas.length>0){

            let mt=metas.find((par:any)=>par.nombre=='Titulo Pestaña')!=undefined?
                      metas.find((par:any)=>par.nombre=='Titulo Pestaña').descripcion:undefined
            let t=metas.find((par:any)=>par.nombre=='title')!=undefined?
                      metas.find((par:any)=>par.nombre=='title').descripcion:undefined
            let d=metas.find((par:any)=>par.nombre=='description')!=undefined?
                      metas.find((par:any)=>par.nombre=='description').descripcion:undefined
            let k=metas.find((par:any)=>par.nombre=='keywords')!=undefined?
                      metas.find((par:any)=>par.nombre=='keywords').descripcion:undefined
            console.log(mt)
            this.title.setTitle(mt);

            this._SeoService.generateTags({
              title:t,
              slug:this.router.url.toString(),
              description:d,
              keywords:k,
              image:'https://img.bsginstitute.com/repositorioweb/img/'+x.articuloDetalleHomeDTO.articuloDetalle.imgPortada,
              ogTitle:mt,
              twiterTitle:mt,
              ogDescription:d,
              twiterDescription:d,
              imageW:"348",
              imageH:'220',
            });

          }
        }
        this.migaPan[3].titulo=x.articuloDetalleHomeDTO.articuloDetalle.areaCapacitacion;
        this.Title=x.articuloDetalleHomeDTO.articuloDetalle.nombre;
        this.descripcion=x.articuloDetalleHomeDTO.articuloDetalle.contenido
        this.area=x.articuloDetalleHomeDTO.articuloDetalle.areaCapacitacion
        this.ListArticuloProgramaRelacionado(x.articuloDetalleHomeDTO.articuloDetalle.id);
      }
    })
  }
  ListTagArticuloRelacionadoPorIdWeb(){
    this._TagService.ListTagArticuloRelacionadoPorIdWeb(this.idWeb).pipe(takeUntil(this.signal$)).subscribe({
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
  SetContacto(value:any){

    if(!this.formVal){

      this._SnackBarServiceService.openSnackBar("Debes completar todos los campos",'x',10,"snackbarCrucigramaerror");
    }else{
      this.initValues = false;
      this.DatosEnvioFormulario.Nombres=value.Nombres;
      this.DatosEnvioFormulario.Apellidos=value.Apellidos;
      this.DatosEnvioFormulario.Correo1=value.Email;
      this.DatosEnvioFormulario.IdPais=value.IdPais;
      this.DatosEnvioFormulario.IdRegion=value.IdRegion;
      this.DatosEnvioFormulario.Movil=value.Movil;
      this.DatosEnvioFormulario.IdCargo=value.IdCargo;
      this.DatosEnvioFormulario.IdAreaFormacion=value.IdAreaFormacion;
      this.DatosEnvioFormulario.IdAreaTrabajo=value.IdAreaTrabajo;
      this.DatosEnvioFormulario.IdIndustria=value.IdIndustria;
      console.log(this.DatosEnvioFormulario)
      this._HelperService.EnviarFormulario(this.DatosEnvioFormulario).pipe(takeUntil(this.signal$)).subscribe({
        next: (x) => {
          console.log(x);

          this._SnackBarServiceService.openSnackBar("¡Solicitud enviada!",'x',15,"snackbarCrucigramaSucces");
        },
        complete: () => {
          this.statuscharge = false;
        },
      });
    }
  }
  ObtenerCombosPortal(){
    this._DatosPortalService.ObtenerCombosPortal().pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        console.log(x);
        this.fileds.forEach(r=>{
          if(r.nombre=='IdPais'){
            r.data=x.listaPais.map((p:any)=>{
              var ps:Basic={Nombre:p.pais,value:p.idPais};
              return ps;
            })
          }
        })
      }
    })
    this.initValues = true;
  }
  GetRegionesPorPais(idPais:number){
    this._RegionService.ObtenerCiudadesPorPais(idPais).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.fileds.forEach(r=>{
          if(r.nombre=='IdRegion'){
            r.disable=false;
            r.data=x.map((p:any)=>{
              var ps:Basic={Nombre:p.nombreCiudad,value:p.idCiudad};
              return ps;
            })
          }
        })
        this.form.enablefield('IdRegion');
      }
    })
  }
  SelectChage(e:any){
    if(e.Nombre=="IdPais"){
      this.GetRegionesPorPais(e.value)
    }
  }
  AddFields(){

    this.fileds.push({
      nombre:"Nombres",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required],
      label:"Nombres",
    });
    this.fileds.push({
      nombre:"Apellidos",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required],
      label:"Apellidos",

    });
    this.fileds.push({
      nombre:"Email",
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required,Validators.email],
      label:"E-mail",

    });
    this.fileds.push({
      nombre:"IdPais",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"País",
    });
    this.fileds.push({
      nombre:"IdRegion",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      disable:true,
      label:"Región",
    });
    this.fileds.push({
      nombre:"Movil",
      tipo:"phone",
      valorInicial:"",
      validate:[Validators.required],
      label:"Teléfono Móvil",
    });
  }
  LimpiarCampos(){
    this.combosPrevios=undefined;
    this.formularioContacto.Nombres= '',
      this.formularioContacto.Apellidos= '',
      this.formularioContacto.Email= '',
      this.formularioContacto.IdPais=0,
      this.formularioContacto.IdRegion=0,
      this.formularioContacto.Movil= '',
      this.GetRegionesPorPais(-1);
  }
}
