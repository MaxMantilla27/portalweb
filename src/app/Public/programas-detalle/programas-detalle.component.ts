import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Basic, CardProgramasDTO } from 'src/app/Core/Models/BasicDTO';
import { BeneficiosDTO } from 'src/app/Core/Models/BeneficiosDTO';
import { ContactenosDTO } from 'src/app/Core/Models/ContactenosDTO';
import { estructuraCursoDTO } from 'src/app/Core/Models/EstructuraProgramaDTO';
import { formulario } from 'src/app/Core/Models/Formulario';
import { FormularioContactoDTO } from 'src/app/Core/Models/FormularioDTO';
import { listaExpositorDTO } from 'src/app/Core/Models/listaExpositorDTO';
import { listaTagDTO } from 'src/app/Core/Models/listaTagDTO';
import { programaCabeceraDetalleDTO,listaSeccionPrograma, listaPrerrequisitoDTO, listaCertificacionDTO, listaMontoPagoProgramaInformacionDTO } from 'src/app/Core/Models/SeccionProgramaDTO';
import { FormularioComponent } from 'src/app/Core/Shared/Containers/formulario/formulario.component';
import { BeneficioService } from 'src/app/Core/Shared/Services/Beneficio/beneficio.service';
import { DatosPortalService } from 'src/app/Core/Shared/Services/DatosPortal/datos-portal.service';
import { ExpositorService } from 'src/app/Core/Shared/Services/Expositor/expositor.service';
import { HelperService } from 'src/app/Core/Shared/Services/Helper/helper.service';
import { ProgramaService } from 'src/app/Core/Shared/Services/Programa/programa.service';
import { RegionService } from 'src/app/Core/Shared/Services/Region/region.service';
import { SeccionProgramaService } from 'src/app/Core/Shared/Services/SeccionPrograma/seccion-programa.service';
import { SilaboService } from 'src/app/Core/Shared/Services/Silabo/silabo.service';
import { TagService } from 'src/app/Core/Shared/Services/Tag/tag.service';

@Component({
  selector: 'app-programas-detalle',
  templateUrl: './programas-detalle.component.html',
  styleUrls: ['./programas-detalle.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ProgramasDetalleComponent implements OnInit {

  isBrowser: boolean;
  @ViewChild(FormularioComponent)
  form!: FormularioComponent;
  constructor(
    private activatedRoute:ActivatedRoute,
    private _SeccionProgramaService:SeccionProgramaService,
    private _ProgramaService:ProgramaService,
    private _BeneficioService:BeneficioService,
    private _SilaboService:SilaboService,
    private _ExpositorService:ExpositorService,
    private _TagService:TagService,
    private _RegionService:RegionService,
    private _DatosPortalService:DatosPortalService,
    private _HelperService: HelperService,
    config: NgbCarouselConfig,
    @Inject(PLATFORM_ID) platformId: Object
    ) {
    this.isBrowser = isPlatformBrowser(platformId);
    config.interval = 20000;
    config.keyboard = true;
    config.pauseOnHover = true;
    }
  public area='';
  public idBusqueda=0;
  public contenidoCabecera='';
  public tags:Array<listaTagDTO>=[]
  public cabecera:programaCabeceraDetalleDTO={
    areaCapacitacion:'',
    areaDescripcion:'',
    duracion:'',
    imagenPrograma:'',
    imgPrincipal:'',
    listProgramaEspecificoInformacionDTO:[],
    nombre:'',
    nombreSubArea:'',
    subAreaDescripcion:'',
    tituloHtml:'',
  }
  public seccion:listaSeccionPrograma={
    duracionHorario:'',
    metodologiaOnline:'',
    objetivo:'',
    publicoObjetivo:'',
    video:'',
    vistaPrevia:'',
  }
  public prerequisitos:listaPrerrequisitoDTO={
    cabecera:'',
    contenido:[],
    piePagina:''
  }
  public certificado:listaCertificacionDTO={
    cabecera:'',
    contenido:[],
    piePagina:'',
    descripcion:'',
    descripcionBody:'',
    descripcionHeader:''
  }
  public expositor:Array<listaExpositorDTO>=[]
  public stepExpositors:Array<Array<listaExpositorDTO>>=[];
  public estructuraPrograma:Array<estructuraCursoDTO>=[];
  public beneficios:Array<BeneficiosDTO>=[]
  public programasRelacionados:Array<CardProgramasDTO>=[];
  public idPegeneral=0;
  public MontoPago:Array<listaMontoPagoProgramaInformacionDTO>=[];
  public BeneficiosPiePagina='';
  public EstructuraPiePagina='';
  public PrerrequisitosPiePagina='';
  public CertificacionPiePagina='';
  public seccionStep=3;
  public innerWidth: any;
  statuscharge = false;
  formVal: boolean = false;
  public initValues = false;
  public fileds: Array<formulario> = [];
  public formularioContacto:FormularioContactoDTO={
    Nombres:'',
    Apellidos:'',
    Email:'',
    IdPais:0,
    IdRegion:0,
    Movil:'',
    IdCargo:0,
    IdAreaFormacion:0,
    IdAreaTrabajo:0,
    IdIndustria:0
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

  ngOnInit(): void {
    if(this.isBrowser){
      this.innerWidth = window.innerWidth;
      if(this.innerWidth<992)this.seccionStep=2;
      if(this.innerWidth<768)this.seccionStep=1;
    }
    this.activatedRoute.params.subscribe({
      next:(x)=>{
        this.area=x['AreaCapacitacion'].replace('-',' ');
        var namePrograma=x['ProgramaNombre'].split('-');
        this.idBusqueda=namePrograma[namePrograma.length-1]

      }
    })
    this.ObtenerCabeceraProgramaGeneral();
    this.ListSeccionPrograma();
    this.ListPrerrequisito();
    this.EstructuraProgramaPortal();
    this.ListBeneficioPrograma();
    this.ListCertificacion();
    this.ListExpositor();
    this.ListMontoPago();
    this.ListTagProgramaRelacionadoPorIdBusqueda();
    this.AddFields();
    this.ObtenerCombosPortal();
  }
  ObtenerCabeceraProgramaGeneral(){
    this._SeccionProgramaService.ObtenerCabeceraProgramaGeneral(this.idBusqueda).subscribe({
      next:(x)=>{
        console.log(x)
        this.cabecera=x.programaCabeceraDetalleDTO
        if(x.programaCabeceraDetalleDTO.imgPrincipal!=null){
          this.cabecera.imgPrincipal='https://img.bsginstitute.com/repositorioweb/img/partners/'+x.programaCabeceraDetalleDTO.imgPrincipal;
        }
      }
    })
  }
  ListSeccionPrograma(){
    this._SeccionProgramaService.ListSeccionPrograma(this.idBusqueda).subscribe({
      next:(x)=>{
        console.log(x)
        if(x.listaSeccionPrograma.video.includes('vimeo')){
          this.contenidoCabecera=x.listaSeccionPrograma.video.split('<p>').join('').split('<vacio></vacio>').join('')
          .split('&lt;').join('<').split("&gt;").join(">").split("src=").join('id=\"presentacionVideo\" src=').split('""').join('"');
        }else{
          var splitCont=x.listaSeccionPrograma.video.split('</p><p>');
          this.contenidoCabecera=splitCont[splitCont.length-1].split('</p>').join('');
        }
        this.seccion=x.listaSeccionPrograma;
      }
    })
  }

  ListPrerrequisito(){
    this._SeccionProgramaService.ListPrerrequisito(this.idBusqueda).subscribe({
      next:(x)=>{
        this.prerequisitos=x.listaPrerrequisitoDTO;
      }
    })
  }
  EstructuraProgramaPortal(){
    this._ProgramaService.EstructuraProgramaPortal(this.idBusqueda).subscribe({
      next:(x)=>{
        this.estructuraPrograma=x.estructuraCurso;
        this.estructuraPrograma.map(x=>{
          x.opened=false
        })
        this.idPegeneral=x.idPGeneral;
        this.ObtenerSilaboCurso();
        this.ListProgramaRelacionado();
        //this.prerequisitos=x.listaPrerrequisitoDTO;
      }
    })
  }
  ListBeneficioPrograma(){
    this._BeneficioService.ListBeneficioPrograma(this.idBusqueda).subscribe({
      next:(x)=>{
        console.log(x)
        this.beneficios=x.listaBeneficioProgramaDTO
        let i=1;
        var beneficioLista:Array<number>=[];
        while(i<=2){

          var TipoBeneficio=this.beneficios.find(x=>x.paquete==i);
          if(TipoBeneficio!=undefined){
            TipoBeneficio.contenido.forEach(element => {
              if(element.idBeneficio>0){
                beneficioLista.push(element.idBeneficio);
              }
            });
            this.beneficios.forEach(x=>{
              if(x.paquete==(i+1)){
                var existe=false;
                x.contenido.forEach(c=>{
                  if(beneficioLista.indexOf(c.idBeneficio)>-1){
                    c.idBeneficio=0;
                    existe=true;
                  }
                });
                if(existe){
                  if(i==1){
                    x.contenido.unshift({contenido:'Todos los beneficios de la versión básica ademas de:',idBeneficio:-1})
                  }
                  if(i==2){
                    x.contenido.unshift({contenido:'Todos los beneficios de la versión profesional ademas de:',idBeneficio:-1})
                  }
                }
              }
            })
          }
          i++;
        }
      }
    })
  }
  ObtenerSilaboCurso(){
    this._SilaboService.ObtenerSilaboCurso(this.idPegeneral).subscribe({
      next:(x)=>{
        console.log(x);
        var piePag=x.listaSeccionesContenidosDocumento.find((x:any)=>x.titulo=="Beneficios")
        if(piePag!=undefined){
          this.BeneficiosPiePagina=piePag.piePagina;
        }
        var piePag=x.listaSeccionesContenidosDocumento.find((x:any)=>x.titulo=="Certificacion")
        if(piePag!=undefined){
          this.CertificacionPiePagina=piePag.piePagina;
        }
        var piePag=x.listaSeccionesContenidosDocumento.find((x:any)=>x.titulo=="Descripci&#243;n Estructura")
        if(piePag!=undefined){
          this.EstructuraPiePagina=piePag.piePagina;
          if(piePag.piePagina.trim()==''){
            this.EstructuraPiePagina=piePag.contenido
          }
        }
        var piePag=x.listaSeccionesContenidosDocumento.find((x:any)=>x.titulo=="Prerrequisitos")
        if(piePag!=undefined){
          this.PrerrequisitosPiePagina=piePag.piePagina;
        }

      }
    })

  }
  ListCertificacion(){
    this._SeccionProgramaService.ListCertificacion(this.idBusqueda).subscribe({
      next:(x)=>{
        console.log(x)
        this.certificado=x.listaCertificacionDTO
        if(this.certificado.descripcion!=null){
          var desc=this.certificado.descripcion.split('</strong></p>');
          if(desc.length>2){
            this.certificado.descripcionHeader=desc[0]+'</strong></p>'
            let i=0;
            this.certificado.descripcionBody='';
            desc.forEach(d=>{
              if(i!=0){
                this.certificado.descripcionBody+=d+'</strong></p>'
              }
              i++;
            })
          }
        }
      }
    })
  }
  ListExpositor(){
    this._ExpositorService.ListExpositor(this.idBusqueda).subscribe({
      next:(x)=>{
        console.log(x)
        this.expositor=x.listaExpositorDTO
        var ind=1;
        var step:Array<any>=[];
        this.expositor.forEach(
          p=>{
            step.push(p);
            if(ind==this.seccionStep){
              this.stepExpositors.push(step);
              step=[];
              ind=0
            }
            ind++
          }
        );
        if(step.length>0){
          this.stepExpositors.push(step);
        }
      }
    })
  }
  ListMontoPago(){
    this._SeccionProgramaService.ListMontoPago(this.idBusqueda).subscribe({
      next:(x)=>{
        console.log(x)
        this.MontoPago=x.listaMontoPagoProgramaInformacionDTO
        if(x.listaMontoPagoProgramaInformacionDTO!=null){
          this.MontoPago.sort(function(a, b) {
            return a.idTipoPago - b.idTipoPago;
          });
        }
      }
    })
  }
  ListProgramaRelacionado(){
    this._SeccionProgramaService.ListProgramaRelacionado(this.idPegeneral).subscribe({
      next:(x)=>{
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
  ListTagProgramaRelacionadoPorIdBusqueda(){
    this._TagService.ListTagProgramaRelacionadoPorIdBusqueda(this.idBusqueda).subscribe({
      next:(x)=>{
        console.log(x);
        this.tags=x.listaTagDTO
        this.tags.forEach(x=>{
          x.codigo='/tag/'+x.codigo
        })
      }
    })
  }
  ScrollTo(el: HTMLElement) {
    el.scrollIntoView();
  }
  SetContacto(value:any){
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
    this._HelperService.EnviarFormulario(this.DatosEnvioFormulario).subscribe({
      next: (x) => {
        console.log(x);
      },
      complete: () => {
        this.statuscharge = false;
      },
    });
  }
  ObtenerCombosPortal(){
    this._DatosPortalService.ObtenerCombosPortal().subscribe({
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
  GetRegionesPorPais(idPais:number){
    this._RegionService.ObtenerCiudadesPorPais(idPais).subscribe({
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
      label:"Pais",
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
      tipo:"text",
      valorInicial:"",
      validate:[Validators.required],
      label:"Teléfono Móvil",
    });
    this.fileds.push({
      nombre:"IdCargo",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"Cargo",
    });
    this.fileds.push({
      nombre:"IdAreaFormacion",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"Área Formación",
    });
    this.fileds.push({
      nombre:"IdAreaTrabajo",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"Área Trabajo",
    });
    this.fileds.push({
      nombre:"IdIndustria",
      tipo:"select",
      valorInicial:"",
      validate:[Validators.required],
      label:"Industria",
    });
  }
}
