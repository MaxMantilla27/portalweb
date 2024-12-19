
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { DatosFormularioDTO } from 'src/app/Core/Models/DatosFormularioDTO';

@Component({
  selector: 'app-whitepapers',
  templateUrl: './whitepapers.component.html',
  styleUrls: ['./whitepapers.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WhitepapersComponent implements OnInit,OnDestroy {
  private signal$ = new Subject();
  @ViewChild(FormularioComponent)
  form!: FormularioComponent;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _ArticuloService: ArticuloService,
    private _SessionStorageService:SessionStorageService,
    private _TagService:TagService,
    private _RegionService:RegionService,
    private _DatosPortalService:DatosPortalService,
    private _SeccionProgramaService:SeccionProgramaService,
    private _SnackBarServiceService:SnackBarServiceService,
    private _HelperServiceP:Help,
    private _SeoService:SeoService,
    private titleSeo:Title,
    private router:Router

  ) {}
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public idWeb = 0;
  public UrlWeb='';
  public Title='';
  public descripcion='';
  public contenido='';
  public imagen='';
  public alt='';
  public urlDocumento='';
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

  statuscharge = false;
  formVal: boolean = false;
  public initValues = false;
  public programasRelacionados:Array<CardProgramasDTO>=[];
  public fileds: Array<formulario> = [];
  public formularioContacto:FormularioContactoDTO={
    Nombres:'',
    Apellidos:'',
    Email:'',
    IdPais:undefined,
    IdRegion:undefined,
    Movil:'',
  }
  public DatosEnvioFormulario: ContactenosDTO={
    Nombres:'',
    Apellidos:'',
    Correo1:'',
    IdPais:undefined,
    IdRegion:undefined,
    Movil:'',
    IdCargo:undefined,
    IdAreaFormacion:undefined,
    IdAreaTrabajo:undefined,
    IdIndustria:undefined,
    IdArticulo:undefined,
    NombreWhitePaper:'',
    urlWhitePaper:''
  }
  public combosPrevios:any
  public cargando=false
  public cleanSub=false
  public CompleteLocalStorage=false;
  public datos: DatosFormularioDTO ={
    nombres:'',
    apellidos:'',
    email:'',
    idPais:undefined,
    idRegion:undefined,
    movil:'',
    idCargo:undefined,
    idAreaFormacion:undefined,
    idAreaTrabajo:undefined,
    idIndustria:undefined,
  }
  public listaLocalidades?:any;
  public whitePapersisnull : any = true;

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        var whitepaper = x['whitepaper'].split('-');
        this.idWeb = whitepaper[whitepaper.length - 1];
        this.UrlWeb=whitepaper.slice(0, -1).join('-')
        this.Title=whitepaper.slice(0, -1).join(' ')
        this.migaPan[3].titulo=this.Title;
      },
    });
    this.obtenerFormularioCompletado();
    // this._HelperServiceP.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x) => {
      //   this.combosPrevios=x.datosAlumno;
      //   console.log(this.combosPrevios)
      //   this.formularioContacto.Nombres= this.combosPrevios.nombres,
      //   this.formularioContacto.Apellidos= this.combosPrevios.apellidos,
      //   this.formularioContacto.Email= this.combosPrevios.email,
      //   this.formularioContacto.IdPais= this.combosPrevios.idPais,
      //   this.formularioContacto.IdRegion= this.combosPrevios.idDepartamento,
      //   this.formularioContacto.Movil= this.combosPrevios.telefono
      //   if(this.formularioContacto.IdPais!=undefined){
        //     this.GetRegionesPorPais(this.formularioContacto.IdPais);
        //   }
        //   this.CompleteLocalStorage=false;
        // });
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
    this._ArticuloService.ObtenerArticuloDetalleHome(3,this.idWeb,this.UrlWeb).pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        console.log(x)
        if (x.articuloDetalleHomeDTO.articuloDetalle.id == 0) {
          this.router.navigate(['error404']);
          return;
        }
        if(x.articuloDetalleHomeDTO!=undefined && x.articuloDetalleHomeDTO.parametroSeo!=undefined){
          this.whitePapersisnull = false;
          var metas=x.articuloDetalleHomeDTO.parametroSeo;
          console.log('METAS',metas)
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
            this.titleSeo.setTitle(t);

            this._SeoService.generateTags({
              title:mt,
              slug:this.router.url.toString(),
              description:d,
              keywords:k,
              image:'https://repositorioweb.blob.core.windows.net/paper-bs/Paper/imagen/'+x.articuloDetalleHomeDTO.articuloDetalle.imgPortada,
              ogTitle:mt,
              twiterTitle:mt,
              ogDescription:d,
              twiterDescription:d,
              imageW:"348",
              imageH:'220',
            });

          }
        }
        this.migaPan[3].titulo=x.articuloDetalleHomeDTO.articuloDetalle.nombre;
        this.Title=x.articuloDetalleHomeDTO.articuloDetalle.nombre;
        var content=x.articuloDetalleHomeDTO.articuloDetalle.contenido.split('Contenidos');
        this.descripcion=content[0].split('<h3')[0]
        this.contenido=content[1].split('</h3>')[1]
        this.imagen=x.articuloDetalleHomeDTO.articuloDetalle.imgPortada;
        this.imagen=this.imagen.toLowerCase();
        this.imagen=this.imagen.split('´').join('');
        this.alt=x.articuloDetalleHomeDTO.articuloDetalle.imgPortadaAlt;
        this.urlDocumento=x.articuloDetalleHomeDTO.articuloDetalle.urlDocumento;

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
          if (this.tags != null) {
            if (x.codigo != null) {
              x.codigo='/tag/'+x.codigo
            }else{
              x.codigo='/error404'
            }

          }


        })
      }
    })
  }
  migaPanChange(e:any){
    if(e.titulo=="White Papers"){
      this._SessionStorageService.SessionSetValue('campus','1');
    }
  }
  obtenerFormularioCompletado(){
    var DatosFormulario = this._SessionStorageService.SessionGetValue('DatosFormulario');
    console.log(DatosFormulario)
    if(DatosFormulario!=''){
      var datos = JSON.parse(DatosFormulario);
      console.log(datos)
      this.formularioContacto.Nombres=datos.nombres;
      this.formularioContacto.Apellidos=datos.apellidos;
      this.formularioContacto.Email=datos.email;
      this.formularioContacto.IdPais=datos.idPais;
      this.formularioContacto.IdRegion=datos.idRegion;
      this.formularioContacto.Movil=datos.movil;
      if(this.formularioContacto.IdPais!=undefined){
        this.GetRegionesPorPais(this.formularioContacto.IdPais,1);
      }
      this.CompleteLocalStorage=true;
    }
    else{
      this.CompleteLocalStorage=false;
    }
  }
  SetContacto(value:any){

    if(!this.formVal){

      this._SnackBarServiceService.openSnackBar("Debes completar todos los campos",'x',10,"snackbarCrucigramaerror");
    }else{
      this.cargando=true
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
      this.DatosEnvioFormulario.IdArticulo=this.idWeb;
      this.DatosEnvioFormulario.NombreWhitePaper=this.Title;
      this.DatosEnvioFormulario.urlWhitePaper=this.urlDocumento;
      console.log(this.DatosEnvioFormulario)
      this._ArticuloService.EnviarFormulario(this.DatosEnvioFormulario).pipe(takeUntil(this.signal$)).subscribe({
        next: (x) => {
          this.cleanSub=false;
          this.datos.nombres = this.DatosEnvioFormulario.Nombres;
            this.datos.apellidos = this.DatosEnvioFormulario.Apellidos;
            this.datos.email = this.DatosEnvioFormulario.Correo1;
            this.datos.idPais = this.DatosEnvioFormulario.IdPais;
            this.datos.idRegion = this.DatosEnvioFormulario.IdRegion;
            this.datos.movil = this.DatosEnvioFormulario.Movil;
            var DatosFormulario = this._SessionStorageService.SessionGetValue('DatosFormulario');
            if(DatosFormulario!=''){
              var datosPrevios = JSON.parse(DatosFormulario);
              this.datos.idCargo=datosPrevios.idCargo;
              this.datos.idAreaFormacion=datosPrevios.idAreaFormacion;
              this.datos.idAreaTrabajo=datosPrevios.idAreaTrabajo;
              this.datos.idIndustria=datosPrevios.idIndustria;
            }
            this._SessionStorageService.SessionSetValue('DatosFormulario',JSON.stringify(this.datos));
            this.CompleteLocalStorage=true;
          console.log(x);
          this._SnackBarServiceService.openSnackBar("¡Solicitud enviada!",'x',15,"snackbarCrucigramaSucces");
        },
        complete: () => {
          this.statuscharge = false;
          this.cargando=false;
          this.obtenerFormularioCompletado();
        },
      });
    }
  }
  ObtenerCombosPortal(){
    this._DatosPortalService.ObtenerCombosPortal().pipe(takeUntil(this.signal$)).subscribe({
      next:(x)=>{
        console.log(x);
        this.listaLocalidades = x.listaLocalida.map((p:any)=>String(p.codigo));
        console.log(this.listaLocalidades)
        this.fileds.forEach(r=>{
          if(r.nombre=='IdPais'){
            r.data,  r.filteredOptions =x.listaPais.map((p:any)=>{
              var ps:Basic={Nombre:p.pais,value:p.idPais};
              return ps;
            })
            r.filteredOptionsAux=x.listaPais.map((p:any)=>{
              var ps:Basic={Nombre:p.pais,value:p.idPais};
              return ps;
            })

          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdCargo'){
            r.data=x.listaCargo.map((p:any)=>{
              var ps:Basic={Nombre:p.cargo,value:p.idCargo};
              return ps;
            })
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdAreaFormacion'){
            r.data=x.listaAreaFormacion.map((p:any)=>{
              var ps:Basic={Nombre:p.areaFormacion,value:p.idAreaFormacion};
              return ps;
            })
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdAreaTrabajo'){
            r.data=x.listaAreaTrabajo.map((p:any)=>{
              var ps:Basic={Nombre:p.areaTrabajo,value:p.idAreaTrabajo};
              return ps;
            })
          }
        })
        this.fileds.forEach(r=>{
          if(r.nombre=='IdIndustria'){
            r.data=x.listaIndustria.map((p:any)=>{
              var ps:Basic={Nombre:p.industria,value:p.idIndustria};
              return ps;
            })
          }
        })
      }
    })
    this.initValues = true;
  }
  GetRegionesPorPais(idPais:number,valor:number){
    console.log(valor)
    console.log(idPais)
    if(idPais!=undefined){
      this._RegionService.ObtenerCiudadesPorPais(idPais).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          console.log(x)
          this.fileds.forEach(r=>{
            if(r.nombre=='IdRegion'){
              r.disable=false;
              r.data, r.filteredOptions=x.map((p:any)=>{
                var ps:Basic={Nombre:p.nombreCiudad,value:p.idCiudad};
                return ps;
              })
              r.filteredOptionsAux=x.map((p:any)=>{
                var ps:Basic={Nombre:p.nombreCiudad,value:p.idCiudad};
                return ps;
              })
            }
            // if(r.nombre=='IdLocalidad'){
            //   r.disable=true;
            //   r.hidden=true;
            // }
          })
          this.form.enablefield('IdRegion');
        }
      })
    }
  }
  SelectChage(e:any){
    console.log(e)
    if(e.Nombre=="IdPais"){
      if(e.value!=undefined ){
      this.GetRegionesPorPais(e.value,2)

      }
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
    this.fileds.push({
      nombre: 'terminos',
      tipo: 'terminos',
      valorInicial: '',
      validate: [Validators.required,Validators.requiredTrue],
      label: 'terminos',
      style:'font-size: 12px;margin-bottom: 20px;'
    });
  }
  LimpiarCampos(){
    this.CompleteLocalStorage=false;
    this._SessionStorageService.SessionDeleteValue('DatosFormulario');
    this.combosPrevios=undefined;
    this.formularioContacto.Nombres= '',
    this.formularioContacto.Apellidos= '',
    this.formularioContacto.Email= '',
    this.formularioContacto.IdPais=undefined,
    this.formularioContacto.IdRegion=undefined,
    this.formularioContacto.Movil= '',
    this.GetRegionesPorPais(-1,3);
  }
}
