import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { BeneficiosDTO } from 'src/app/Core/Models/BeneficiosDTO';
import { estructuraCursoDTO } from 'src/app/Core/Models/EstructuraProgramaDTO';
import { listaExpositorDTO } from 'src/app/Core/Models/listaExpositorDTO';
import { programaCabeceraDetalleDTO,listaSeccionPrograma, listaPrerrequisitoDTO, listaCertificacionDTO } from 'src/app/Core/Models/SeccionProgramaDTO';
import { BeneficioService } from 'src/app/Core/Shared/Services/Beneficio/beneficio.service';
import { ExpositorService } from 'src/app/Core/Shared/Services/Expositor/expositor.service';
import { ProgramaService } from 'src/app/Core/Shared/Services/Programa/programa.service';
import { SeccionProgramaService } from 'src/app/Core/Shared/Services/SeccionPrograma/seccion-programa.service';
import { SilaboService } from 'src/app/Core/Shared/Services/Silabo/silabo.service';

@Component({
  selector: 'app-programas-detalle',
  templateUrl: './programas-detalle.component.html',
  styleUrls: ['./programas-detalle.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProgramasDetalleComponent implements OnInit {

  isBrowser: boolean;
  constructor(
    private activatedRoute:ActivatedRoute,
    private _SeccionProgramaService:SeccionProgramaService,
    private _ProgramaService:ProgramaService,
    private _BeneficioService:BeneficioService,
    private _SilaboService:SilaboService,
    private _ExpositorService:ExpositorService,
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
  public idPegeneral=0;
  public BeneficiosPiePagina='';
  public EstructuraPiePagina='';
  public PrerrequisitosPiePagina='';
  public CertificacionPiePagina='';
  public seccionStep=3;
  public innerWidth: any;
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
  }
  ObtenerCabeceraProgramaGeneral(){
    this._SeccionProgramaService.ObtenerCabeceraProgramaGeneral(this.idBusqueda).subscribe({
      next:(x)=>{
        console.log(x)
        this.cabecera=x.programaCabeceraDetalleDTO
        this.cabecera.imgPrincipal='https://img.bsginstitute.com/repositorioweb/img/partners/'+x.programaCabeceraDetalleDTO.imgPrincipal;
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
  ScrollTo(el: HTMLElement) {
    el.scrollIntoView();
  }
}
