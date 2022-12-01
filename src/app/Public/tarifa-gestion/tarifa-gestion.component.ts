import { Component, OnInit } from '@angular/core';
import { HelperService} from 'src/app/Core/Shared/Services/helper.service';
import { Subject, take, takeUntil } from 'rxjs';
import {TarifaGestionService} from 'src/app/Core/Shared/Services/TarifaGestion/tarifa-gestion.service'

@Component({
  selector: 'app-tarifa-gestion',
  templateUrl: './tarifa-gestion.component.html',
  styleUrls: ['./tarifa-gestion.component.scss']
})
export class TarifaGestionComponent implements OnInit {
  private signal$ = new Subject();
  public Paises:any;

  constructor(
    private _HelperService:HelperService,
    private _TarifaGestionService: TarifaGestionService,
  ) { }



  public tarifas:any

  ngOnInit(): void {
    this._HelperService.recibirDataPais.pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
       console.log(x)
       this.ObtenerTarifas()
      }
    })
    this._HelperService.recibirChangePais().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        this.Paises=x;
        console.log(this.Paises)
        this.ObtenerTarifas()
      }
    })


  }
  ObtenerTarifas(){
    this._TarifaGestionService.ObtenerTarifas().pipe(takeUntil(this.signal$)).subscribe({
      next:x=>{
        console.log(x)
        this.tarifas=x
      }
    })
  }

}


