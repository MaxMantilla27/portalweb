import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DatosAlumnoValidacionCarreraDTO } from 'src/app/Core/Models/CertificadoDTO';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';

@Component({
  selector: 'app-tramites-informacion-personal',
  templateUrl: './tramites-informacion-personal.component.html',
  styleUrls: ['./tramites-informacion-personal.component.scss']
})
export class TramitesInformacionPersonalComponent implements OnInit ,OnDestroy {
  private signal$ = new Subject();

  constructor(
    private _HelperService:HelperService,
  ) { }

  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }

  public json:DatosAlumnoValidacionCarreraDTO={
    Nombres:'',
    Apellidos:'',
    file:new File([],'')
  }
  ngOnInit(): void {
    this._HelperService.recibirCombosPerfil.pipe(takeUntil(this.signal$)).subscribe((x:any) => {
      this.json.Nombres=x.datosAlumno.nombres
      this.json.Apellidos=x.datosAlumno.apellidos
      console.log(this.json)
    })
  }

}
