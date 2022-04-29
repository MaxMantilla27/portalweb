import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {CarreraProfesionalService} from "../../../Core/Shared/Services/Carrera/carrera-profesional.service";
import {CarreraProfesionalTecnicaDetalleDTO} from "../../../Core/Models/ProgramaDTO";

@Component({
  selector: 'app-carrera-profesional-detalle',
  templateUrl: './carrera-profesional-detalle.component.html',
  styleUrls: ['./carrera-profesional-detalle.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CarreraProfesionalDetalleComponent implements OnInit {

  public migaPan: any = [];
  //public carrera: CarreraProfesionalTecnicaDetalleDTO = {};
  public carrera: any = {};

  //Secciones
  public generalInformacion: any = [];
  public montoPagoPrograma: any = {};
  public planEstudios: any;
  public certificaciones: any;
  public contenidoCertificacionAdicional: String = '';
  public notaCertificacionAdicional: String = '';

  //Para armar la ruta completa de la imagen del programa
  public rutaImagen: string = 'https://img.bsginstitute.com/repositorioweb/img/carreras/';

  // faeke renderiza toda la app public video: string = '<iframe src="player.vimeo.com/video/304251200?title=0&amp;amp;byline=0" width="425" height="350" ></iframe>'
  public videoPrueba: string = '&lt;iframe src=\"//player.vimeo.com/video/304251200?title=0&amp;amp;byline=0\"\"&gt;&lt;/iframe&gt;<vacio></vacio>'
  public loader: boolean = false

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _CarreraProfesionalService: CarreraProfesionalService,
  ) { }

  ngOnInit(): void {
    this.migaPan = [
      {
        titulo: 'Inicio',
        urlWeb: '/',
      },
      {
        titulo: 'Carreras Profesionales',
        urlWeb: '/carreras-profesionales'
      }
    ]
    this.activatedRoute.params.subscribe((params) => {
      //Lo separamos en partes
      let auxParams = params["urlWeb"].split('-')
      let idBusqueda = auxParams[auxParams.length -1]
      let nombre = auxParams.splice(0,auxParams.length -1).toString().replace(/,/g,' ')
      //Se elimina el texto por defecto
      let nombreCorto = nombre.replace('Carrera Profesional en','')
      //Insertamos la ruta en la miga de pan
      this.migaPan.push({
        titulo: nombre,
        urlWeb: params["urlWeb"]
      })
      this.getCarreraDetalle(idBusqueda, nombre)
    })
    this.videoPrueba = this.formatVideo(this.videoPrueba)
  }
  getCarreraDetalle(idBusqueda:number, nombre:string){
    this._CarreraProfesionalService.GetCarrerasDetalle(idBusqueda, nombre).subscribe({
      next:(x)=>{
        this.carrera = x.programaInformacionDTO
        //Informacion General
        this.generalInformacion = this.filtrarContenido(this.carrera.contenidoProgramaInformacionDTO, ['Perfil del Egresado', 'Duración y Horarios', 'Mercado Laboral'])
        //Montos pago
        this.montoPagoPrograma = `1 matrícula de ${this.carrera.montoPagoProgramaInformacionDTO.simbolo}${Math.round(this.carrera.montoPagoProgramaInformacionDTO.matricula)} y ${this.carrera.montoPagoProgramaInformacionDTO.nroCuotas} pensiones de  ${this.carrera.montoPagoProgramaInformacionDTO.simbolo}${Math.round(this.carrera.montoPagoProgramaInformacionDTO.cuotas)}`
        //Plan de Estudios damos formato para cards
        let almPlanEstudios: any = this.filtrarContenido(this.carrera.contenidoProgramaInformacionDTO, ['Plan de Estudios'])
        this.planEstudios = "<div class='real-contenedor'>"+ almPlanEstudios[0].contenido.replaceAll("<p><strong>","<div class='container-card'><p><strong>").
        replaceAll("</ul><div class='container-card'>","</ul></div><div class='container-card'>")+"</div></div>"
        this.planEstudios = this.planEstudios.replaceAll("</strong></p>","</strong></p><div class='line'></div>")
        //Certificaciones
        let almCerticaciones: any = this.filtrarContenido(this.carrera.contenidoProgramaInformacionDTO, ['Certificaciones'])
        this.certificaciones = almCerticaciones[0].contenido
        //Certificaciones Adicionales
        //Se hace debido a que no podemos separar de manera correcta la información de la nota por la manera en que se creo
        let almCertificacionesAdicionales: any = this.filtrarContenido(this.carrera.contenidoProgramaInformacionDTO, ['Certificaciones\tAdicionales'])
        let verifyEnd = almCertificacionesAdicionales[0].contenido.indexOf("</div><p><strong>NOTA</strong>")
        //Para verificar la posicion
        if(verifyEnd !== -1) {
          almCertificacionesAdicionales[0].contenido = almCertificacionesAdicionales[0].contenido.replaceAll("</div><p><strong>NOTA</strong>","<p>&nbsp;</p><div><p><strong>NOTA</strong>")+"</div>"
        }

        //Separamos el contenido de la nota en certificaicones adicionales
        this.contenidoCertificacionAdicional = almCertificacionesAdicionales[0].contenido.split("<p>&nbsp;</p><div><p><strong>NOTA</strong>")[0].replaceAll("<div class=\"row\"><div class=\"col-sm-8\"><p><br /></p></div></div>","").replaceAll("<hr />","")
        let contenidoCertificacionSplit = almCertificacionesAdicionales[0].contenido.split("<p>&nbsp;</p>")
        this.notaCertificacionAdicional = contenidoCertificacionSplit[contenidoCertificacionSplit.length-1]
        this.loader = true
      },
      error:(x)=>{console.log(x)}
    });
  }
  formatVideo(video: any) {
    return video.split('<p>').join('').split('<vacio></vacio>').join('')
      .split('&lt;').join('<').split("&gt;").join(">").split("src=").join('id=\"presentacionVideo\" src=').split('""').join('"');
  }
  filtrarContenido (contenido: Array<string>, condiciones: Array<string>) {
    return contenido.filter(function(cont: any) {
      for(let j = 0 ; j < condiciones.length ; j++) {
        if(condiciones[j] === cont.titulo){
          return cont
        }
      }
    })
  }
}
