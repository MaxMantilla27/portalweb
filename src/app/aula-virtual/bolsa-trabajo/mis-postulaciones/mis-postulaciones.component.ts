import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
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
export class MisPostulacionesComponent implements OnInit {

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

  public listaConvocatorias:any[]=[]



  public isSelect:boolean=false

  ngOnInit(): void {
    console.log("mis postulacions")
    this.ObtenerPostulacionesAlumno()
  }

  selectPanel(data:any) {
    if(data.isSelect==true)data.isSelect=false
    else data.isSelect=true
    this.listaConvocatorias.forEach((e:any)=>{
      if(e.id!=data.id) e.isSelect=false
    })
  }

  ObtenerPostulacionesAlumno(){
    this._OfertaLaboralService.ObtenerPostulacionesAlumno().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        x.forEach((e:any)=>{
          e.fechaFin = new Date(e.fechaFin)
          e.fechaInicio = new Date(e.fechaInicio)
          e.isSelect=false
        })
        this.listaConvocatorias=x
      }
    })
  }
  
  BuscarDataSeleccionada(idConvotaria:number){
    this.listaConvocatorias.forEach(e=>{
      e.isSelect=false
    })
    if(idConvotaria!=0){
      let data = this.listaConvocatorias.find((e:any)=>e.id==idConvotaria)
      if(data!=null){
        this.listaConvocatorias = this.listaConvocatorias.filter((e:any)=>e.id!=idConvotaria)
        this.listaConvocatorias.unshift(data)
        this.selectPanel(data)
      }
    }
    
  }

}
