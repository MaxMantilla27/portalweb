import { Injectable } from '@angular/core';
import {Meta} from '@angular/platform-browser'
import { environment } from 'src/environments/environment';
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
    console.log(config);
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
}
