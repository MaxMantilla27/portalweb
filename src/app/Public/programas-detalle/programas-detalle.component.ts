import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { programaCabeceraDetalleDTO,listaSeccionPrograma, listaPrerrequisitoDTO } from 'src/app/Core/Models/SeccionProgramaDTO';
import { SeccionProgramaService } from 'src/app/Core/Shared/Services/SeccionPrograma/seccion-programa.service';

@Component({
  selector: 'app-programas-detalle',
  templateUrl: './programas-detalle.component.html',
  styleUrls: ['./programas-detalle.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProgramasDetalleComponent implements OnInit {

  constructor(
    private activatedRoute:ActivatedRoute,
    private _SeccionProgramaService:SeccionProgramaService
    ) { }
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
  ngOnInit(): void {

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
}
