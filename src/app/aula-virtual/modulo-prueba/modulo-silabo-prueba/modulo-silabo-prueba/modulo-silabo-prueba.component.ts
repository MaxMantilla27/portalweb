import { Component, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { SilaboService } from 'src/app/Core/Shared/Services/Silabo/silabo.service';

@Component({
  selector: 'app-modulo-silabo-prueba',
  templateUrl: './modulo-silabo-prueba.component.html',
  styleUrls: ['./modulo-silabo-prueba.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ModuloSilaboPruebaComponent implements OnInit {

  constructor(private _SilaboService:SilaboService) { }
  @Input() IdPgeneral=0
  @Input() Estructura:any=[]
  @Input() Capitulo='';
  public listaSeccionesContenidosDocumento:Array<any>=[];
  public prese=''
  public presentacionC=''
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdPgeneral!=0){
      this.ObtenerSilaboCurso()
    }

  }
  ObtenerSilaboCurso(){
    this._SilaboService.ObtenerSilaboCurso(this.IdPgeneral).subscribe({
      next:x=>{
        console.log(x);
        this.listaSeccionesContenidosDocumento=x.listaSeccionesContenidosDocumento;
        var i=0;
        var indexB=-1
        var indexC=-1
        this.listaSeccionesContenidosDocumento.forEach(x=>{
          x.order=0
          x.ArrayContent=[];
          x.estado=true
          if(x.titulo=="Presentacion"){
            x.order=1;
          }
          if(x.titulo=="Objetivos"){
            x.order=2;
          }
          if(x.titulo=="Publico Objetivo"){
            x.order=3;
          }
          if(x.titulo=="Beneficios"){
            if(indexB==-1){
              indexB=i
              x.order=4;
              this.listaSeccionesContenidosDocumento[indexB].ArrayContent.push(x.contenido)
            }else{
              this.listaSeccionesContenidosDocumento[indexB].ArrayContent.push(x.contenido)
              x.estado=false
            }
          }
          if(x.titulo=="Certificacion"){
            if(indexC==-1){
              indexC=i
              x.order=5;
              this.listaSeccionesContenidosDocumento[indexC].ArrayContent.push(x.contenido)
            }else{
              this.listaSeccionesContenidosDocumento[indexC].ArrayContent.push(x.contenido)
              x.estado=false
            }
          }
          if(x.titulo=="Bibliografia"){
            x.order=6;
          }
          i++
        })
        this.listaSeccionesContenidosDocumento.push({
          titulo:'Estrutura Curicular',
          Contenido:'',
          order:7,
          ArrayContent:[],
          estado:true
        })
        this.listaSeccionesContenidosDocumento.sort(function (a, b) {
          return a.order - b.order;
        });
      }
    })
  }

}
