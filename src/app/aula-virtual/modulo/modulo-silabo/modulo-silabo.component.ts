import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { SilaboService } from 'src/app/Core/Shared/Services/Silabo/silabo.service';

@Component({
  selector: 'app-modulo-silabo',
  templateUrl: './modulo-silabo.component.html',
  styleUrls: ['./modulo-silabo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModuloSilaboComponent implements OnInit,OnChanges,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _SilaboService:SilaboService,
    private _HelperService:HelperService
  ) { }
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
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
    console.log(this.Estructura)
  }
  EventoInteraccionAccordion(nombre:string,estado:string){
    this._HelperService.enviarMsjAcciones({Tag:'Accordion',Nombre:nombre,Estado:estado,Seccion:'silabo'})
  }
  ObtenerSilaboCurso(){
    this._SilaboService.ObtenerSilaboCurso(this.IdPgeneral).pipe(takeUntil(this.signal$)).subscribe({
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
            x.titulo="Presentación"
            x.order=1;
          }
          if(x.titulo=="Objetivos"){
            x.order=2;
          }
          if(x.titulo=="Público Objetivo"){
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
            x.titulo="Certificación"
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
            x.titulo="Bibliografía"
            x.order=6;
          }
          i++
        })
        this.listaSeccionesContenidosDocumento.push({
          titulo:'Estructura Curricular',
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
