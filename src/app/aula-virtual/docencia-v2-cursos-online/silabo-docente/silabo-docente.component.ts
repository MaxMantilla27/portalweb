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
  public listaSeccionesContenidosDocumentoEstructura:any
  public listaSeccionesContenidosDocumentoEstructuraProcesada:any
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
          // if(x.titulo=="Certificacion"){
          //   x.titulo="Certificación"
          //   if(indexC==-1){
          //     indexC=i
          //     x.order=5;
          //     this.listaSeccionesContenidosDocumento[indexC].ArrayContent.push(x.contenido)
          //   }else{
          //     this.listaSeccionesContenidosDocumento[indexC].ArrayContent.push(x.contenido)
          //     x.estado=false
          //   }
          // }
          if(x.titulo=="Bibliografia"){
            x.titulo="Bibliografía"
            x.order=6;
          }
          i++
        })
        this.listaSeccionesContenidosDocumentoEstructura = x.listaSeccionesContenidosDocumentoEstructura;
        // Paso 1: Obtener títulos (IdSeccionTipoDetalle_PW = 12) sin duplicados
        const titulosMap = new Map();
        this.listaSeccionesContenidosDocumentoEstructura.forEach((item: any) => {
          if (item.idSeccionTipoDetalle_PW === 12) {
            if (titulosMap.has(item.contenido)) {
              titulosMap.set(item.contenido, titulosMap.get(item.contenido) + 1);
            } else {
              titulosMap.set(item.contenido, 1);
            }
          }
        });
        const titulos = Array.from(titulosMap.keys());
        const titulosCont = Array.from(titulosMap.entries()).map(([titulo, count]) => ({ titulo, count }));

        // Paso 2: Obtener contenidos (IdSeccionTipoDetalle_PW = 13) sin filtrar duplicados
        const contenidos = this.listaSeccionesContenidosDocumentoEstructura
          .filter((item: any) => item.idSeccionTipoDetalle_PW === 13)
          .map((item: any) => item.contenido);

        console.log(titulos);
        console.log(contenidos);
        // Paso 3: Armar el objeto anidado
        let contenidoIndex = 0;
        const estructuraCurricular = titulosCont.map(({ titulo, count }) => {
          const contenidosForTitulo = [];
          for (let i = 0; i < count && contenidoIndex < contenidos.length; i++) {
            contenidosForTitulo.push(contenidos[contenidoIndex]);
            contenidoIndex++;
          }
          return {
            titulo,
            contenidos: contenidosForTitulo
          };
        });

        // Eliminar contenidos duplicados
        const uniqueEstructuraCurricular = estructuraCurricular.map(({ titulo, contenidos }) => ({
          titulo,
          contenidos: Array.from(new Set(contenidos))
        }));
        console.log(uniqueEstructuraCurricular);
        this.listaSeccionesContenidosDocumentoEstructuraProcesada=uniqueEstructuraCurricular
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
