import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SilaboService } from 'src/app/Core/Shared/Services/Silabo/silabo.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-silabo-docente',
  templateUrl: './silabo-docente.component.html',
  styleUrls: ['./silabo-docente.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SilaboDocenteComponent implements OnInit ,OnChanges,OnDestroy {
  private signal$ = new Subject();


  constructor(
    private _SilaboService:SilaboService,
  ) { }

  @Input() IdPgeneral=0
  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.IdPgeneral!=0){
      this.ObtenerSilaboCurso()
    }
  }
  public listaSeccionesContenidosDocumento:Array<any>=[];
  ngOnInit(): void {
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
        console.log(this.listaSeccionesContenidosDocumento)
        // this.listaSeccionesContenidosDocumento.push({
        //   titulo:'Estructura Curricular',
        //   Contenido:'',
        //   order:7,
        //   ArrayContent:[],
        //   estado:true
        // })
        this.listaSeccionesContenidosDocumento.sort(function (a, b) {
          return a.order - b.order;
        });
      }
    })
  }
}
