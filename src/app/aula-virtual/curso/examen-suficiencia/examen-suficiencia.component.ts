import { Component, Input, OnInit } from '@angular/core';

import * as moment  from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
@Component({
  selector: 'app-examen-suficiencia',
  templateUrl: './examen-suficiencia.component.html',
  styleUrls: ['./examen-suficiencia.component.scss']
})
export class ExamenSuficienciaComponent implements OnInit {
  private signal$ = new Subject();

  constructor(
    private _HelperService: HelperService,
    private _ProgramaContenidoService: ProgramaContenidoService,
  ) { }
  @Input() IdMatricula=0;
  @Input() idPGeneral=0;
  @Input() TrabajoExamenSuficienciaProfesional:any
  ComenzoExamen=false
  public fechaSelec=new Date()
  public BloquearExamen=true;
  ngOnInit(): void {
    // const hoy = moment(new Date);
    // this.fechaSelec=new Date(hoy.add(3,'M').format('YYYY-MM-DD hh:mm:ss a'))
    this.ObtenerExamenSuficienciaProfesionalCarrera()
  }
  Ir(){
    this.ComenzoExamen=true
    this._HelperService.enviarOcultar();
  }
  ObtenerExamenSuficienciaProfesionalCarrera(){
    this.BloquearExamen=false;
    this._ProgramaContenidoService.ObtenerExamenSuficienciaProfesionalCarrera(this.IdMatricula).pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.TrabajoExamenSuficienciaProfesional=x
        if(x.fechaEnvio!=null){
          this.BloquearExamen=false;
        }
        this.fechaSelec=x.fechaEntrega
      },
      complete:()=>{

      }
    })
  }
}
