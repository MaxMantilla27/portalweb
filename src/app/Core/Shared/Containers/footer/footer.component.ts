import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../Services/helper.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  servicios: any [] = []
  centralTelefonica: any [] = []
  redesSociales: any [] = []
  constructor(
    private _HelperService: HelperService,
  ) {

  }

  ngOnInit(): void {
    this.servicios = [
      {
        title: 'Carreras Profesionales',
        route: '/carreras-profesionales'
      },
      {
        title: 'Formación Continua',
        route: '/programas-certificaciones-cursos'
      },
      // {
      //   title: 'Servicios Corporativos',
      //   route: '/'
      // },
      // {
      //   title: 'Facturación Electrónica',
      //   route: '/'
      // },
      {
        title: 'Transparencia',
        route: '/Transparencia'
      }
    ]
    this.centralTelefonica = [
      {
        icono: '../../../../../assets/icons/peru-icon.svg',
        pais: 'Perú',
        telefono: '+51(1) 207-2770'
      },
      {
        icono: '../../../../../assets/icons/colombia-icon.svg',
        pais: 'Colombia',
        telefono: '+57(601)381-9462'
      },
      {
        icono: '../../../../../assets/icons/bolivia-icon.svg',
        pais: 'Bolivia',
        telefono: '+59(1) 7733-8111'
      },
      {
        icono: '../../../../../assets/icons/mexico-icon.svg',
        pais: 'México',
        telefono: '+52(55) 4000-3255'
      }
    ]
    this.redesSociales = [
      {
        icono: '../../../../../assets/icons/facebook-icon.svg',
        route: 'https://www.facebook.com/BSGInstituteOficial/',
        name: 'Facebook'
      },
      {
        icono: '../../../../../assets/icons/instagram-icon.svg',
        route: 'https://www.instagram.com/bsg_institute/',
        name: 'Instragram'
      },
      {
        icono: '../../../../../assets/icons/youtube-icon.svg',
        route: 'https://www.youtube.com/user/BSGRUPOsac',
        name: 'Youtube'
      },
      {
        icono: '../../../../../assets/icons/twitter-icon.svg',
        route: 'https://twitter.com/BSG_Institute',
        name: 'Twitter'
      },
      {
        icono: '../../../../../assets/icons/linkedin-icon.svg',
        route: 'https://pe.linkedin.com/school/bsg-institute/',
        name: 'LinkedIn'
      },

    ]
  }
  ScrollTO(scroll:string){
    this._HelperService.enviarScrollFooter(scroll);
  }

}
