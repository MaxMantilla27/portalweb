import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PEspecificoSesionRecursoConectividadSaveDTO } from 'src/app/Core/Models/PEspecificoSesionRecursoConectividadSaveDTO';
import { PEspecificoSesionRecursoConectividadService } from 'src/app/Core/Shared/Services/PEspecificoSesionRecursoConectividad/pespecifico-sesion-recurso-conectividad.service';
import { PespecificoSesionTemaService } from 'src/app/Core/Shared/Services/PespecificoSesionTema/pespecifico-sesion-tema.service';

@Component({
  selector: 'app-pespecifico-sesion-recurso-conectividad',
  templateUrl: './pespecifico-sesion-recurso-conectividad.component.html',
  styleUrls: ['./pespecifico-sesion-recurso-conectividad.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PespecificoSesionRecursoConectividadComponent implements OnInit,OnChanges, OnDestroy{
  private signal$ = new Subject();
  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  constructor(
    private _PEspecificoSesionRecursoConectividadService: PEspecificoSesionRecursoConectividadService,
    public dialog: MatDialog,
  ) {}

  @Input() IdSesion = 0;
  public charge = false;
  public tipoExamen:any
  public tipoDispositivo:any
  public tipoAmbienteClase:any
  public json:PEspecificoSesionRecursoConectividadSaveDTO={
    ExposicionAlumnos:null,
    IdPEspecificoSesion:0,
    IdPwTipoAmbienteClase:null,
    IdPwTipoDispositivo:null,
    IdPwTipoExamen:null,
    TrabajoGrupal:null,
    Usuario:'',
    UsoCamara:null
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.IdSesion != 0) {
      console.log('carga recursos....', this.IdSesion);
      this.charge = true;
      this.ObtenerPEspecificoSesionRecursoConectividad();
    }
  }
  ngOnInit(): void {
    this.getOptions()
  }
  ObtenerPEspecificoSesionRecursoConectividad(){
    this.json={
      ExposicionAlumnos:null,
      IdPEspecificoSesion:0,
      IdPwTipoAmbienteClase:null,
      IdPwTipoDispositivo:null,
      IdPwTipoExamen:null,
      TrabajoGrupal:null,
      Usuario:'',
      UsoCamara:null
    }
    this._PEspecificoSesionRecursoConectividadService.ObtenerPEspecificoSesionRecursoConectividad(this.IdSesion).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        console.log(x);
        if(x!=null){
          this.json.IdPEspecificoSesion=this.IdSesion
          this.json.ExposicionAlumnos=x.exposicionAlumnos
          this.json.IdPwTipoAmbienteClase=x.idPwTipoAmbienteClase
          this.json.IdPwTipoDispositivo=x.idPwTipoDispositivo
          this.json.IdPwTipoExamen=x.idPwTipoExamen
          this.json.TrabajoGrupal=x.trabajoGrupal
          this.json.UsoCamara=x.usoCamara
        }
        this.charge = false;
      },
    });
  }
  getOptions(){
    this.ObtenerTipoExamen()
    this.ObtenerTipoAmbienteClase()
    this.ObtenerTipoDispositivo()
  }
  ObtenerTipoExamen(){
    this._PEspecificoSesionRecursoConectividadService.ObtenerTipoExamen().pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        this.tipoExamen=x
      },
    });
  }
  ObtenerTipoAmbienteClase(){
    this._PEspecificoSesionRecursoConectividadService.ObtenerTipoAmbienteClase().pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        this.tipoAmbienteClase=x
      },
    });
  }
  ObtenerTipoDispositivo(){
    this._PEspecificoSesionRecursoConectividadService.ObtenerTipoDispositivo().pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        this.tipoDispositivo=x
      },
    });
  }
  GuardarRecurso(){
    this.json.IdPEspecificoSesion=this.IdSesion
    this.charge = true;
    this._PEspecificoSesionRecursoConectividadService.AgregarPEspecificoSesionRecursoConectividad(this.json).pipe(takeUntil(this.signal$))
    .subscribe({
      next: (x) => {
        this.ObtenerPEspecificoSesionRecursoConectividad();
      },
    });
  }
}
