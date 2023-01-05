import { Component, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CursoPadrePruebaDTO, ProgresoAlumnoProgramaAulaVirtualPruebaDTO } from 'src/app/Core/Models/ListadoProgramaContenidoPruebaDTO';
import { CuentaService } from 'src/app/Core/Shared/Services/Cuenta/cuenta.service';
import { ProgramaContenidoService } from 'src/app/Core/Shared/Services/ProgramaContenido/programa-contenido.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-curso-prueba-modulos',
  templateUrl: './curso-prueba-modulos.component.html',
  styleUrls: ['./curso-prueba-modulos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CursoPruebaModulosComponent implements OnInit {

  constructor(
    private _ProgramaContenidoService: ProgramaContenidoService,
    private _SessionStorageService: SessionStorageService,
    private _CuentaService: CuentaService,
  ) {}

  public progresoPrograma: ProgresoAlumnoProgramaAulaVirtualPruebaDTO = {
    progresoVideo: [],
  };
  @Input() programaEstructura: CursoPadrePruebaDTO = {
    idAlumno: 0,
    idRegistroPrueba: 0,
    idModalidad: 0,
    idPEspecifico: 0,
    idPGeneral: 0,
    listaCursoMatriculado: [],
    modalidad: '',
    programaGeneral: '',
  };
  @Input() idRegistroPrueba = 0;
  ngOnInit(): void {
    console.log(this.programaEstructura)

  }
}

