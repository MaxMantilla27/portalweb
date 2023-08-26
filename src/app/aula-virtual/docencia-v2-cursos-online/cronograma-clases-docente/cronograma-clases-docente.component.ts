import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DatosPerfilService } from 'src/app/Core/Shared/Services/DatosPerfil/datos-perfil.service';

@Component({
  selector: 'app-cronograma-clases-docente',
  templateUrl: './cronograma-clases-docente.component.html',
  styleUrls: ['./cronograma-clases-docente.component.scss']
})
export class CronogramaClasesDocenteComponent implements OnInit ,OnChanges , OnDestroy {
  private signal$ = new Subject();

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  columnHeader = {
    'orden'  : 'Sesión',
    'fechaHoraInicio': 'Fecha',
    'HoraInicio': 'Hora Inicio',
    'HoraFinal': 'Hora Final',
    'nombrePais': 'País',
  };

  TipoContenido:any={
    fechaHoraInicio: ['date'],
    'HoraInicio': ['hora'],
    'HoraFinal': ['hora'],
    //'Acciones': ['buttons'],
  }
  constructor(
    private _DatosPerfilService: DatosPerfilService,
  ) { }

  @Input() IdPespecifico = 0;
  public sesiones: any;
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.IdPespecifico)
    if(this.IdPespecifico>0){
      this.ObtenerSesionesOnlineWebinarDocentePorIdPespecifico()
    }
  }
  ObtenerSesionesOnlineWebinarDocentePorIdPespecifico() {
    this._DatosPerfilService
      .ObtenerSesionesOnlineWebinarDocentePorIdPespecifico(this.IdPespecifico)
      .pipe(takeUntil(this.signal$))
      .subscribe({
        next: (x) => {
          this.sesiones = x;
          console.log(this.sesiones);
          if(this.sesiones!=undefined && this.sesiones!=null && this.sesiones.length){
            this.sesiones.forEach((s:any) => {
              var f=new Date(s.fechaHoraInicio);
              f.setMinutes(f.getMinutes()+(s.duracion*60))
              s.fechaHoraFinal=f
              s.HoraInicio=s.fechaHoraInicio;
              s.HoraFinal=s.fechaHoraFinal;
            });
          }
        },
      });
  }
}
