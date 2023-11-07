import { Component, OnInit } from '@angular/core';

import * as moment  from 'moment';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
@Component({
  selector: 'app-examen-suficiencia',
  templateUrl: './examen-suficiencia.component.html',
  styleUrls: ['./examen-suficiencia.component.scss']
})
export class ExamenSuficienciaComponent implements OnInit {

  constructor(
    private _HelperService: HelperService) { }
  ComenzoExamen=false
  public fechaSelec=new Date()
  ngOnInit(): void {
    const hoy = moment(new Date);
    this.fechaSelec=new Date(hoy.add(3,'M').format('YYYY-MM-DD hh:mm:ss a'))
  }
  Ir(){
    this.ComenzoExamen=true
    this._HelperService.enviarOcultar();
  }
}
