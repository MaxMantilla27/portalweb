import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OfertaLaboralService } from 'src/app/Core/Shared/Services/OfertaLaboral/oferta-laboral.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';


@Component({
  selector: 'mis-postulaciones',
  templateUrl: './mis-postulaciones.component.html',
  styleUrls: ['./mis-postulaciones.component.scss']
})
export class MisPostulacionesComponent implements OnInit,OnDestroy {

  private signal$ = new Subject();
  isBrowser: boolean;

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _OfertaLaboralService:OfertaLaboralService,
    private _SessionStorageService:SessionStorageService,
    private _router:Router,
    
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId); {}
    
  }


  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  buscando=false
  public listaConvocatorias:any[]=[]
  public isSelect:boolean=false

  ngOnInit(): void {
    this.ObtenerPostulacionesAlumno()
  }

  selectPanel(data:any) {
    this.buscando=true
    if(data.isSelect==true)data.isSelect=false
    else {
      data.isSelect=true
      this._OfertaLaboralService.ObtenerDetalleConvocatorias(data.id).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          data.stringIdiomas =x.idiomas.length>0? x.idiomas.map((e:any) => e.nombre).join(", "):""
          data.stringNivelEstudio =x.nivelEstudio.length>0? x.nivelEstudio.map((e:any) => e.nombre).join(", "):""
          data.stringExperiencia =x.experiencia.length>0? x.experiencia.map((e:any) => e.nombre).join(", "):""
          
          this.buscando=false
        }
      })
      
    }
    this.listaConvocatorias.forEach((e:any)=>{
      if(e.id!=data.id) e.isSelect=false
    })
  }

  ObtenerPostulacionesAlumno(isBoton?:boolean,idConvotaria?:number){
    this._OfertaLaboralService.ObtenerPostulacionesAlumno().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        x.forEach((e:any)=>{
          e.fechaFin = new Date(e.fechaFin)
          e.fechaInicio = new Date(e.fechaInicio)
          e.isSelect=false
        })
        this.listaConvocatorias=x
        if(isBoton==true){
          if(idConvotaria!=0){
            let data = this.listaConvocatorias.find((e:any)=>e.id==idConvotaria)
            if(data!=null){
              this.listaConvocatorias = this.listaConvocatorias.filter((e:any)=>e.id!=idConvotaria)
              this.ObtenerDetalleConvocatorias(data)
             
            }
          }
        }
      }
    })
  }
  
  BuscarDataSeleccionada(idConvotaria:number){
    this.ObtenerPostulacionesAlumno(true,idConvotaria)
  }

  ObtenerDetalleConvocatorias(data:any){
    this._OfertaLaboralService.ObtenerDetalleConvocatorias(data.id).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        data.stringIdiomas =x.idiomas.length>0? x.idiomas.map((e:any) => e.nombre).join(", "):""
        data.stringNivelEstudio =x.nivelEstudio.length>0? x.nivelEstudio.map((e:any) => e.nombre).join(", "):""
        data.stringExperiencia =x.experiencia.length>0? x.experiencia.map((e:any) => e.nombre).join(", "):""
        this.listaConvocatorias.unshift(data)
        this.selectPanel(data)
      }
    })
  }
}
