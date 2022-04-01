import { Component, OnInit } from '@angular/core';
import { Basic, BasicBotonesExpandibles, BasicUrl } from 'src/app/Core/Models/BasicDTO';
import {SessionStorageService} from './../../Services/session-storage.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers:[SessionStorageService]
})
export class HeaderComponent implements OnInit {

  constructor(private _SessionStorageService:SessionStorageService) { }
  Formacion: Array<BasicUrl> = [
    { Nombre: 'Transformación Digital', value: 1, Url: '1' },
    { Nombre: 'Big Data', value: 1, Url: '1' },
    { Nombre: 'Seguridad de la Información', value: 1, Url: '1' },
    { Nombre: 'Continuidad del Negocio', value: 1, Url: '1' },
    { Nombre: 'Inteligencia Artificial', value: 1, Url: '1' },
    { Nombre: 'Mantenimiento', value: 1, Url: '1' },
    { Nombre: 'Construcción', value: 1, Url: '1' },
    { Nombre: 'Proyectos', value: 1, Url: '1' },
    { Nombre: 'Seguridad Alimentaria', value: 1, Url: '1' },
    { Nombre: 'Tecnologías de la Información', value: 1, Url: '1' },
    { Nombre: 'Calidad', value: 1, Url: '1' },
    { Nombre: 'Finanzas', value: 1, Url: '1' },
    { Nombre: 'Gestión Ambiental', value: 1, Url: '1' },
    { Nombre: 'Seguridad y Salud en el Trabajo', value: 1, Url: '1' },
    { Nombre: 'Minería', value: 1, Url: '1' },
    { Nombre: 'Ver Todo', value: 1, Url: '/login', style: { 'font-weight': 'bold' } },
  ];
  carreras: Array<BasicUrl> = [
    { Nombre: 'Carrera Profesional en Administracion de Empresas', value: 1, Url: '1' },
    { Nombre: 'Carrera Profesional en Desarrollo de Sistemas de Informacion', value: 1, Url: '1' },
    { Nombre: 'Ver Todo', value: 1, Url: '/login', style: { 'font-weight': 'bold' } },
  ];
  tecnica: Array<BasicUrl> = [
    { Nombre: 'Certificacion en Atencion al cliente', value: 1, Url: '1' },
    { Nombre: 'Certificacion en promotor de ventas', value: 1, Url: '1' },
    { Nombre: 'Ver Todo', value: 1, Url: '/login', style: { 'font-weight': 'bold' } },
  ]
  paises: Array<BasicUrl> =[
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/Argentina_flag.png", value: 1, Nombre: "Argentina" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/Bolivia_flag.png", value: 2, Nombre: "Bolivia" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/brazil_flag.png", value: 3, Nombre: "Brazil" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/Chile_flag.png", value: 4, Nombre: "Chile" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/Colombia_flag.png", value: 5, Nombre: "Colombia" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/CostaRica_flag.png", value: 6, Nombre: "Costa Rica" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/Cuba_flag.png", value: 7, Nombre: "Cuba" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/Ecuador_flag.png", value: 8, Nombre: "Ecuador" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/ElSalvador_flag.png", value: 9, Nombre: "El Salvador" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/Guatemala_flag.png", value: 10, Nombre: "Guatemala" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/Honduras_flag.png", value: 11, Nombre: "Honduras" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/Mexico_flag.png", value: 12, Nombre: "Mexico" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/Nicaragua_flag.png", value: 13, Nombre: "Nicaragua" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/Panama_flag.png", value: 14, Nombre: "Panama" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/Paraguay_flag.png", value: 15, Nombre: "Paraguay" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/Peru_flag.png", value: 16, Nombre: "Perú" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/RepublicaDominicana_flag.png", value: 17, Nombre: "Republica Dominicana" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/Uruguay_flag.png", value: 18, Nombre: "Uruguay" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/Venezuela_flag.png", value: 19, Nombre: "Venezuela" },
    { Url: "https://repositorioweb.blob.core.windows.net/repositorioweb/flags/globe_flag.png", value: 20, Nombre: "Internacional" }
  ]

  expandibles:Array<BasicBotonesExpandibles>=[
    {
      Nombre:'Formacion Continua',
      data:this.Formacion
    },
    {
      Nombre:'Carreras Profecionales',
      data:this.carreras
    },
    {
      Nombre:'Educacion Tecnica',
      data:this.tecnica
    }
  ]
  token:boolean=this._SessionStorageService.validateTokken();
  ngOnInit(): void {
    console.log(this.token)
  }
  clickHandler() { }
}
