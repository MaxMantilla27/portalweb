import { Component, OnInit } from '@angular/core';
import {  Subject, takeUntil } from 'rxjs';
import { OfertaLaboralService } from 'src/app/Core/Shared/Services/OfertaLaboral/oferta-laboral.service';

@Component({
  selector: 'app-bolsa-trabajo',
  templateUrl: './bolsa-trabajo.component.html',
  styleUrls: ['./bolsa-trabajo.component.scss']
})
export class BolsaTrabajoComponent implements OnInit {
  private signal$ = new Subject();
  constructor(
    private _OfertaLaboralService:OfertaLaboralService,
  ) { }
  listaConvocatorias:any[]=[]
  dataTemp :any=null
  ngOnInit(): void {
    this.ObtenerCombocatoriasVigentes()
  }

  ObtenerCombocatoriasVigentes(){
    this._OfertaLaboralService.ObtenerCombocatoriasVigentes().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        x.forEach((e:any)=>{
          e.fechaFin = new Date(e.fechaFin)
          e.fechaInicio = new Date(e.fechaInicio)
          e.isSelect=false
        })
        this.listaConvocatorias=x
        if(this.listaConvocatorias.length>0){
          this.listaConvocatorias[0].isSelect=true
          this.mostrarConvocatoria(this.listaConvocatorias[0])
        }
      }
    })
  }

  mostrarConvocatoria(data:any){
    data.isSelect=true
    this.listaConvocatorias.forEach((e:any)=>{
      if(e.id!=data.id) e.isSelect=false
    })
    this.dataTemp=data
  }
}
