import { Injectable } from '@angular/core';
import {Meta} from '@angular/platform-browser'
import { environment } from 'src/environments/environment';
import { PartnerImagesDTO } from '../../Models/PartnerImagesDTO';
@Injectable({
  providedIn: 'root'
})
export class SeoService {

  public urlBase=environment.url_portal;
  constructor(private meta:Meta) { }
  generateTags(config:any){
    config={
      title:'BSG Institute - Conocimiento para Crecer',
      description:'Programas, Certificaciones y Cursos en Big Data, Analytics, Proyectos, ISO 9001, ISO 14001, OHSAS 18001, ISO 27001, Construcción, Minería',
      image:'',
      imageW:"851",
      imageH:'315',
      Author:'BSG Institute',
      keywords:'BSG Institute,curso de excel avanzado, curso autocad, curso de excel basico, especializacion en gerencia de proyectos, certificacion itil, especializacion en salud ocupacional, curso ms project,curso revit',
      slug: '',
      ogTitle:'',
      twiterTitle:'',
      ogDescription:'Diplomas y Cursos en Big Data, Ciberseguridad, Cloud, Proyectos, ISO 9001, ISO 14001, OHSAS 18001, ISO 22301, ISO 27001, ISO 50001, Construccioacuten, Minería',
      twiterDescription:'Diplomas y Cursos en Big Data, Ciberseguridad, Cloud, Proyectos, ISO 9001, ISO 14001, OHSAS 18001, ISO 22301, ISO 27001, ISO 50001, Construcción, Minería',
      ...config
    }
    this.meta.addTag({ name: 'title', content: config.title });
    this.meta.addTag({ name: 'description', content: config.description });
    this.meta.addTag({ name: 'keywords', content: config.keywords });
    this.meta.addTag({ name: 'author', content: config.Author });

    if(config.twiterTitle!=undefined && config.twiterTitle!=''){
      this.meta.addTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.meta.addTag({ name: 'twitter:site', content: 'BS_Grupo' });
      this.meta.addTag({ name: 'twitter:title', content: config.twiterTitle });
      this.meta.addTag({ name: 'twitter:description', content: config.twiterDescription });
      this.meta.addTag({ name: 'twitter:image', content: config.image });
    }
    if(config.ogTitle!=undefined && config.ogTitle!=''){
      this.meta.addTag({ property: 'og:type', content: 'website' });
      this.meta.addTag({ property: 'og:site_name', content: 'BSG Institute' });
      this.meta.addTag({ property: 'og:title', content: config.ogTitle });
      this.meta.addTag({ property: 'og:description', content: config.ogDescription });
      this.meta.addTag({ property: 'og:image', content: config.image });
      this.meta.addTag({ property: 'og:image:width', content:config.imageW });
      this.meta.addTag({ property: 'og:image:height', content:config.imageH });
      this.meta.addTag({ property: 'og:url', content: this.urlBase+`${config.slug}` });
    }
  }
  getimagesPartner(){
    var img:Array<PartnerImagesDTO>=[ {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/logo-pmi.png",
      imagenAlt: "BSG Institute es un Authorized Training Partner – ATP del Project Management Institute - PMI®"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/logo-ec-council.png",
      imagenAlt: "BSG Institute es un Accredited Training Center - ATC del Consejo Internacional de Consultores de E-Comerce - EC-COUNCIL"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/logo-microsoft.png",
      imagenAlt: "BSG Institute es un Learning Partner con la Competencia Silver Cloud Platform de Microsoft"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/logo-aenor.png",
      imagenAlt: "BSG Institute posee un Acuerdo de Formación basado en el fomento de actividades educativas con AENOR"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/logo-linux.png",
      imagenAlt: "BSG Institute es un Approved Training Partner - ATP del Linux Professional Institute - LPI"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/logo-exin.png",
      imagenAlt: "BSG Institute es un Accredited Training Provider – ATP de EXIN"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/logo-autodesk.png",
      imagenAlt: "BSG Institute es Centro Autorizado de Entrenamiento - ATC y Certificación – ACC de AUTODESK"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/logo-aafm.png",
      imagenAlt: "BSG Institute es Provider of Qualified Certification Education del American Academy of Financial Management - AAFM"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/logo-usgbc.png",
      imagenAlt: "BSG Institute es un Miembro del U.S. Green Building Council - USGBC"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/logo-isc2.png",
      imagenAlt: "BSG Institute es un Official Training Provider - OTP del The International Information Systems Security Certification Consortium - (ISC)²"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/logo-prince.png",
      imagenAlt: "BSG Institute es un Training Organization Accreditec – ATO por PEOPLECERT en nombre de AXELOS"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/logo-learnquest.png",
      imagenAlt: "BSG Institute es un Learning Partner de LearnQuest (Global Training Provider de IBM)"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/logo-itil-peoplecert.png",
      imagenAlt: "BSG Institute es un Accredited Training Provider – ATP de PeopleCert"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/logo-cqi-irca.png",
      imagenAlt: "BSG Institute es un Approved Training Partner – ATP de CQI e IRCA"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/togaf9-atc.png",
      imagenAlt: "BSG Institute ha obtenido un Accredited Training Course – ATC de TOGAF 9 de The Open Group"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/LOGO-CISCO-inferior.png",
      imagenAlt: "BSG Institute pertenece al programa de Cisco Networking Academy"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/logo-informs.png",
      imagenAlt: "BSG Institute es un Professional Education Partner – PEP® de INFORMS"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/logo-asme.png",
      imagenAlt: "The American Society of Mechanical Engineers - ASME"
    },
    {
      imgPrincipal: "https://img.bsginstitute.com/repositorioweb/img/partners/logo-comptia.png",
      imagenAlt: "Computing Technology Industry Association - CompTIA"
    }]
    return img;
  }

}
