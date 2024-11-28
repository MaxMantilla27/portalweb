import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DatosPortalService } from 'src/app/Core/Shared/Services/DatosPortal/datos-portal.service';
import { FormularioProgressiveProfilingService } from 'src/app/Core/Shared/Services/FormularioProgressiveProfiling/formulario-progressive-profiling.service';
import { HelperService } from 'src/app/Core/Shared/Services/helper.service';
import { RegistroVisitaPortalService } from 'src/app/Core/Shared/Services/RegistroVisitaPortal/registro-visita-portal.service';
import { SessionStorageService } from 'src/app/Core/Shared/Services/session-storage.service';

@Component({
  selector: 'app-formulario-progressive-profiling',
  templateUrl: './formulario-progressive-profiling.component.html',
  styleUrls: ['./formulario-progressive-profiling.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormularioProgressiveProfilingComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FormularioProgressiveProfilingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _FormularioProgressiveProfilingService: FormularioProgressiveProfilingService,
    private _HelperService:HelperService,
    private _DatosPortalService: DatosPortalService,
    private _SessionStorageService: SessionStorageService,
    private _RegistroVisitaPortalService: RegistroVisitaPortalService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.formCamposDinamicos = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('600px', 'auto');
    this.obtenerListaBanderas();
    this.obtenerOpcionesCombos();
  }

  ngOnDestroy(): void {
    this.signal$.next(true);
    this.signal$.complete();
  }
  
  formCamposDinamicos!: FormGroup;
  listaIconPais: Array<any> = [];
  
  usuarioWeb: string = '';
  id: number = 0;
  tipo = null;
  idFormularioInicial = null;
  condicionMostrar = null;
  tiempoSesion = null;

  titulo = null;
  tituloTexto = null;

  cabeceraMensajeSup = null;
  cabeceraMensajeSupTexto = null;
  cabeceraMensaje = null;
  cabeceraMensajeTexto = null;
  cabeceraMensajeBordes = null;
  cabeceraMensajeInf = null;
  cabeceraMensajeInfTexto = null;
  cabeceraBoton = null;
  cabeceraBotonTexto = null;
  cabeceraBotonAccion = null;

  cuerpoMensajeSup = null;
  cuerpoMensajeSupTexto = null;

  boton = null;
  botonTexto = null;
  botonAccion = null;

  condicionMostrarCuerpo: boolean = false;
  tipoControl: string = '';
  tipoTelefono: boolean = false

  camposConfigurados: CampoConfigurado[] = [];

  opcionesPorCampo: {
    pais: Pais[];
    cargo: Opcion[];
    areaFormacion: Opcion[];
    areaTrabajo: Opcion[];
    industria: Opcion[];
  } = {
    pais: [],
    cargo: [],
    areaFormacion: [],
    areaTrabajo: [],
    industria: [],
  };

  private signal$ = new Subject();

  obtenerListaBanderas() {
    this._HelperService.recibirDataPais.pipe(takeUntil(this.signal$)).subscribe({
      next: resp =>{
        this.listaIconPais = [];
        if(resp){
          this.listaIconPais = resp;
        }
      }
    })
  }

  obtenerOpcionesCombos() {
    this._DatosPortalService.ObtenerCombosFormularioProgresivo().pipe(takeUntil(this.signal$))
      .subscribe({
        next: (resp) => {
          if (resp.listaPais && resp.listaPais.length > 0) {
            this.opcionesPorCampo.pais = resp.listaPais.map((pais: { idPais: number, pais: string, codigoIso: string, longCelular: number }) => ({
              value: pais.idPais,
              label: pais.pais,
              codigoIso: pais.codigoIso,
              longCelular: pais.longCelular
            }));
          }
          if(resp.listaCargo && resp.listaCargo.length > 0) {
            this.opcionesPorCampo.cargo = resp.listaCargo.map((cargo: { idCargo: number, cargo: string }) => ({
              value: cargo.idCargo,
              label: cargo.cargo
            }));
          }
          if(resp.listaAreaFormacion && resp.listaAreaFormacion.length > 0) {
            this.opcionesPorCampo.areaFormacion = resp.listaAreaFormacion.map((areaFormacion: { idAreaFormacion: number, areaFormacion: string }) => ({
              value: areaFormacion.idAreaFormacion,
              label: areaFormacion.areaFormacion
            }));
          }
          if(resp.listaAreaTrabajo && resp.listaAreaTrabajo.length > 0) {
            this.opcionesPorCampo.areaTrabajo = resp.listaAreaTrabajo.map((areaTrabajo: { idAreaTrabajo: number, areaTrabajo: string }) => ({
              value: areaTrabajo.idAreaTrabajo,
              label: areaTrabajo.areaTrabajo
            }));
          }
          if(resp.listaIndustria && resp.listaIndustria.length > 0) {
            this.opcionesPorCampo.industria = resp.listaIndustria.map((industria: { idIndustria: number, industria: string }) => ({
              value: industria.idIndustria,
              label: industria.industria
            }));
          }
          this.obtenerListaFormularioProgresivo(this.data);
        }
    })
  }

  obtenerListaFormularioProgresivo(formData: any) {
    this.usuarioWeb = formData.usuarioWeb
    this.id = formData.id;
    this.tipo = formData.tipo;
    if (this.tipo === 2) {
      this.idFormularioInicial = formData.idFormularioProgresivoInicial;
    }
    this.condicionMostrar = formData.condicionMostrar;
    this.tiempoSesion = formData.tiempoSesion;
    this.titulo = formData.titulo;
    this.tituloTexto = formData.tituloTexto;
    this.cabeceraMensajeSup = formData.cabeceraMensajeSup;
    this.cabeceraMensajeSupTexto = formData.cabeceraMensajeSupTexto;
    this.cabeceraMensaje = formData.cabeceraMensaje;
    this.cabeceraMensajeTexto = formData.cabeceraMensajeTexto;
    this.cabeceraMensajeBordes = formData.cabeceraMensajeBordes;
    this.cabeceraMensajeInf = formData.cabeceraMensajeInf;
    this.cabeceraMensajeInfTexto = formData.cabeceraMensajeInfTexto;
    this.cabeceraBoton = formData.cabeceraBoton;
    this.cabeceraBotonTexto = formData.cabeceraBotonTexto;
    this.cabeceraBotonAccion = formData.cabeceraBotonAccion;

    this.cuerpoMensajeSup = formData.cuerpoMensajeSup;
    this.cuerpoMensajeSupTexto = formData.cuerpoMensajeSupTexto;

    this.boton = formData.boton;
    this.botonTexto = formData.botonTexto;
    this.botonAccion = formData.botonAccion;

    this.camposConfigurados = [];
    this.condicionMostrarCuerpo = false;
    this.tipoTelefono = false;

    let valorDefectoPais: number | null = null;

    if (formData.cuerpoCorreo === true) {
      this.condicionMostrarCuerpo = true;
      this.camposConfigurados.push({
        id: 'correo',
        label: 'Correo',
        tipo: 'email',
        tipoControl: 'input',
        valorDefecto: null,
        obligatorio: formData.cuerpoCorreoObl,
        orden: formData.cuerpoCorreoOrden,
      });
    }

    if (formData.cuerpoNombres === true) {
      this.condicionMostrarCuerpo = true;
      this.camposConfigurados.push({
        id: 'nombres',
        label: 'Nombres',
        tipo: 'text',
        tipoControl: 'input',
        valorDefecto: null,
        obligatorio: formData.cuerpoNombresObl,
        orden: formData.cuerpoNombresOrden,
      });
    }

    if (formData.cuerpoApellidos === true) {
      this.condicionMostrarCuerpo = true;
      this.camposConfigurados.push({
        id: 'apellidos',
        label: 'Apellidos',
        tipo: 'text',
        tipoControl: 'input',
        valorDefecto: null,
        obligatorio: formData.cuerpoApellidosObl,
        orden: formData.cuerpoApellidosOrden,
      });
    }

    if (formData.cuerpoPais === true) {
      this.condicionMostrarCuerpo = true;
      var codigoIso = this._SessionStorageService.SessionGetValue('ISO_PAIS');
      valorDefectoPais = this.opcionesPorCampo.pais.find(pais => pais.codigoIso === codigoIso)?.value ?? null;
      this.camposConfigurados.push({
        id: 'pais',
        label: 'País',
        tipo: 'text',
        tipoControl: 'combo',
        opciones: this.opcionesPorCampo.pais,
        valorDefecto: valorDefectoPais,
        obligatorio: formData.cuerpoPaisObl,
        orden: formData.cuerpoPaisOrden,
      });
    }

    if (formData.cuerpoTelefono === true) {
      this.condicionMostrarCuerpo = true;
      this.tipoTelefono = true
      this.camposConfigurados.push({
        id: 'telefono',
        label: 'Teléfono',
        tipo: 'text',
        tipoControl: 'input',
        valorDefecto: valorDefectoPais,
        obligatorio: formData.cuerpoTelefonoObl,
        orden: formData.cuerpoTelefonoOrden,
      });
    }

    if (formData.cuerpoCargo === true) {
      this.condicionMostrarCuerpo = true;
      this.camposConfigurados.push({
        id: 'cargo',
        label: 'Cargo',
        tipo: 'text',
        tipoControl: 'combo',
        opciones: this.opcionesPorCampo.cargo,
        valorDefecto: null,
        obligatorio: formData.cuerpoCargoObl,
        orden: formData.cuerpoCargoOrden,
      });
    }

    if (formData.cuerpoAreaFormacion === true) {
      this.condicionMostrarCuerpo = true;
      this.camposConfigurados.push({
        id: 'areaFormacion',
        label: 'Área Formación',
        tipo: 'text',
        tipoControl: 'combo',
        opciones: this.opcionesPorCampo.areaFormacion,
        valorDefecto: null,
        obligatorio: formData.cuerpoAreaFormacionObl,
        orden: formData.cuerpoAreaFormacionOrden,
      });
    }

    if (formData.cuerpoAreaTrabajo === true) {
      this.condicionMostrarCuerpo = true;
      this.camposConfigurados.push({
        id: 'areaTrabajo',
        label: 'Área Trabajo',
        tipo: 'text',
        tipoControl: 'combo',
        opciones: this.opcionesPorCampo.areaTrabajo,
        valorDefecto: null,
        obligatorio: formData.cuerpoAreaTrabajoObl,
        orden: formData.cuerpoAreaTrabajoOrden,
      });
    }

    if (formData.cuerpoIndustria === true) {
      this.condicionMostrarCuerpo = true;
      this.camposConfigurados.push({
        id: 'industria',
        label: 'Industria',
        tipo: 'text',
        tipoControl: 'combo',
        opciones: this.opcionesPorCampo.industria,
        valorDefecto: null,
        obligatorio: formData.cuerpoIndustriaObl,
        orden: formData.cuerpoIndustriaOrden,
      });
    }
    this.camposConfigurados.sort((a, b) => {
      const ordenA = a.orden ?? Infinity;
      const ordenB = b.orden ?? Infinity;
      return ordenA - ordenB;
    });
    this.actualizarFormularioDinamico();
    this.obtenerDatosLocalStorage();
  }

  actualizarFormularioDinamico() {
    this.formCamposDinamicos = this.formBuilder.group({});
    this.camposConfigurados.forEach(campo => {
      const validators = [];
      if (campo.obligatorio) {
        validators.push(Validators.required);
      }
      if (campo.tipo === 'email') {
        validators.push(Validators.email);
      }
      const control = new FormControl(campo.valorDefecto || null, validators);
      this.formCamposDinamicos.addControl(campo.id, control);
    });
  }

  obtenerDatosLocalStorage() {
    const formularioGuardado = localStorage.getItem('formularioGuardado');
    if (formularioGuardado) {
      const valoresGuardados = JSON.parse(formularioGuardado);
      this.formCamposDinamicos.patchValue(valoresGuardados);

      const paisGuardado = valoresGuardados['pais'];
      if (paisGuardado) {
        const campoPais = this.camposConfigurados.find(campoConfig => campoConfig.id === 'pais');
        if (campoPais) {
          campoPais.valorDefecto = paisGuardado;
        }
        const campoTelefono = this.camposConfigurados.find(campoConfig => campoConfig.id === 'telefono');
        if (campoTelefono) {
          campoTelefono.valorDefecto = paisGuardado;
        }
        this.actualizarBandera(paisGuardado);
      }
    }
  }

  actualizarBandera(valorDefectoPais: number | null | undefined): void {
    const icono = this.getIconoPorPais(valorDefectoPais);
    const campoTelefono = this.camposConfigurados.find(campoConfig => campoConfig.id === 'telefono');
    if (campoTelefono) {
      campoTelefono.valorDefecto = valorDefectoPais;
    }
  }

  getIconoPorPais(valorDefecto: number | null | undefined): string {
    if (valorDefecto) {
      const pais = this.listaIconPais.find(pais => pais.idPais === valorDefecto);
      return pais ? pais.icono : 'https://repositorioweb.blob.core.windows.net/repositorioweb/FlagIcons/internacional.png';
    }
    return 'https://repositorioweb.blob.core.windows.net/repositorioweb/FlagIcons/internacional.png';
  }

  onComboChange(event: any, campo: any): void {
    if (campo.id === 'pais') {
      const nuevoValorDefectoPais = event.value;
      const campoPais = this.camposConfigurados.find(campoConfig => campoConfig.id === 'pais');
      if (campoPais) {
        campoPais.valorDefecto = nuevoValorDefectoPais;
      }
      const campoTelefono = this.camposConfigurados.find(campoConfig => campoConfig.id === 'telefono');
      if (campoTelefono) {
        campoTelefono.valorDefecto = nuevoValorDefectoPais;
      }
      this.getIconoPorPais(nuevoValorDefectoPais);
    }
  }

  accionarBoton(): void {
    if (this.botonAccion) {
      if (this.validaFormularioAccion()) {
        this.ejecutarAccion(this.botonAccion);
      }
    }
    else if (this.cabeceraBotonAccion) {
      this.ejecutarAccion(this.cabeceraBotonAccion);
    }
  }

  validaFormularioAccion(): boolean {
    if (this.formCamposDinamicos.invalid) {
      this.formCamposDinamicos.markAllAsTouched();
      return false;
    }
    return true;
  }

  ejecutarAccion(accion: number): void {
    switch (accion) {
      case 1:
        this.guardaDatos();
        this.abreFormularioRespuesta(this.id);
        this.cerrarFormulario();
        break;
      case 2:
        this.guardaDatos();
        this.abreFormularioRespuesta(this.id);
        this.cerrarFormulario();
        break;
      case 3:
        this.guardaDatos();
        this.abreFormularioRespuesta(this.id);
        this.cerrarFormulario();
        break;
      case 4:
        this.copiaCodigo();
        break;
      case 5:
        this.enviaBrochure();
        this.abreFormularioRespuesta(this.id);
        break;
      case 6:
        this.enviaAulaVirtual();
        this.abreFormularioRespuesta(this.id);
        break;
      default:
        console.warn('Acción no definida:', accion);
    }
  }

  copiaCodigo(): void {
    if (this.cabeceraMensajeTexto) {
      navigator.clipboard.writeText(this.cabeceraMensajeTexto).then(
        () => {
          console.log('Texto copiado al portapapeles:', this.cabeceraMensajeTexto);
        },
        (err) => {
          console.error('Error al copiar el texto:', err);
        }
      );
    } else {
      console.warn('No hay texto para copiar.');
    }
  }

  enviaBrochure(): void {
    
  }

  enviaAulaVirtual(): void {
    
  }

  guardaDatos(): Promise<void> {
    const valoresFormulario = this.formCamposDinamicos.value;
    const datosRegistro: InsertaRegistroVisitaPortalDTO = {
      usuarioWeb: this.usuarioWeb,
      idAlumno: null,
      correo: valoresFormulario.correo,
      nombre: valoresFormulario.nombres,
      apellido: valoresFormulario.apellidos,
      idPais: valoresFormulario.pais,
      telefono: valoresFormulario.telefono,
      idCargo: valoresFormulario.cargo,
      idAreaFormacion: valoresFormulario.areaFormacion,
      idAreaTrabajo: valoresFormulario.areaTrabajo,
      idIndustria: valoresFormulario.industria,
      usuario: "portalweb"
    };
    const datosFinales = Object.fromEntries(
      Object.entries(datosRegistro).map(([key, value]) => [key, value !== undefined ? value : null])
    ) as InsertaRegistroVisitaPortalDTO;
    return this._RegistroVisitaPortalService.InsertarRegistroVisitaPortal(datosFinales)
      .pipe(takeUntil(this.signal$))
      .toPromise()
      .catch(error => {
        console.error('Error al insertar el registro:', error);
      });
  }

  abreFormularioRespuesta(formularioInicial: number) {
    this._FormularioProgressiveProfilingService.ObtenerListaFormularioProgresivo()
    .subscribe({
      next: x => {
        const formDataRpta = x.datosFormularioProgresivo;
        formDataRpta.forEach((formularioRpta: any) => {
          if (formularioRpta.activado === true && formularioRpta.idFormularioProgresivoInicial === formularioInicial) {
            this.dialog.open(FormularioProgressiveProfilingComponent, {
              disableClose: true,
              data: {
                id: formularioRpta.id,
                tipo: formularioRpta.tipo,
                idFormularioProgresivoInicial: formularioRpta.idFormularioProgresivoInicial,
                condicionMostrar: formularioRpta.condicionMostrar,
                tiempoSesion: formularioRpta.tiempoSesion,
                titulo: formularioRpta.titulo,
                tituloTexto: formularioRpta.tituloTexto,
                cabeceraMensajeSup: formularioRpta.cabeceraMensajeSup,
                cabeceraMensajeSupTexto: formularioRpta.cabeceraMensajeSupTexto,
                cabeceraMensaje: formularioRpta.cabeceraMensaje,
                cabeceraMensajeTexto: formularioRpta.cabeceraMensajeTexto,
                cabeceraMensajeBordes: formularioRpta.cabeceraMensajeBordes,
                cabeceraMensajeInf: formularioRpta.cabeceraMensajeInf,
                cabeceraMensajeInfTexto: formularioRpta.cabeceraMensajeInfTexto,
                cabeceraBoton: formularioRpta.cabeceraBoton,
                cabeceraBotonTexto: formularioRpta.cabeceraBotonTexto,
                cabeceraBotonAccion: formularioRpta.cabeceraBotonAccion,
                cuerpoMensajeSup: formularioRpta.cuerpoMensajeSup,
                cuerpoMensajeSupTexto: formularioRpta.cuerpoMensajeSupTexto,
                cuerpoCorreo: formularioRpta.cuerpoCorreo,
                cuerpoCorreoOrden: formularioRpta.cuerpoCorreoOrden,
                cuerpoCorreoObl: formularioRpta.cuerpoCorreoObl,
                cuerpoNombres: formularioRpta.cuerpoNombres,
                cuerpoNombresOrden: formularioRpta.cuerpoNombresOrden,
                cuerpoNombresObl: formularioRpta.cuerpoNombresObl,
                cuerpoApellidos: formularioRpta.cuerpoApellidos,
                cuerpoApellidosOrden: formularioRpta.cuerpoApellidosOrden,
                cuerpoApellidosObl: formularioRpta.cuerpoApellidosObl,
                cuerpoPais: formularioRpta.cuerpoPais,
                cuerpoPaisOrden: formularioRpta.cuerpoPaisOrden,
                cuerpoPaisObl: formularioRpta.cuerpoPaisObl,
                cuerpoTelefono: formularioRpta.cuerpoTelefono,
                cuerpoTelefonoOrden: formularioRpta.cuerpoTelefonoOrden,
                cuerpoTelefonoObl: formularioRpta.cuerpoTelefonoObl,
                cuerpoCargo: formularioRpta.cuerpoCargo,
                cuerpoCargoOrden: formularioRpta.cuerpoCargoOrden,
                cuerpoCargoObl: formularioRpta.cuerpoCargoObl,
                cuerpoAreaFormacion: formularioRpta.cuerpoAreaFormacion,
                cuerpoAreaFormacionOrden: formularioRpta.cuerpoAreaFormacionOrden,
                cuerpoAreaFormacionObl: formularioRpta.cuerpoAreaFormacionObl,
                cuerpoAreaTrabajo: formularioRpta.cuerpoAreaTrabajo,
                cuerpoAreaTrabajoOrden: formularioRpta.cuerpoAreaTrabajoOrden,
                cuerpoAreaTrabajoObl: formularioRpta.cuerpoAreaTrabajoObl,
                cuerpoIndustria: formularioRpta.cuerpoIndustria,
                cuerpoIndustriaOrden: formularioRpta.cuerpoIndustriaOrden,
                cuerpoIndustriaObl: formularioRpta.cuerpoIndustriaObl,
                boton: formularioRpta.boton,
                botonTexto: formularioRpta.botonTexto,
                botonAccion: formularioRpta.botonAccion
              }
            });
          }
        });
      },
      error: err => {
        console.error('Error al obtener los datos de respuesta:', err);
      }
    });
  }

  cerrarFormulario(): void {
    const valoresFormulario = this.formCamposDinamicos.getRawValue();
    localStorage.setItem('formularioGuardado', JSON.stringify(valoresFormulario));
    this.dialogRef.close();
  }

}

interface CampoConfigurado {
  id: string;
  label: string;
  tipo: string;
  tipoControl: 'input' | 'combo';
  opciones?: { value: any; label: string }[];
  valorDefecto: number | null | undefined;
  obligatorio: boolean;
  orden: number | null;
}

interface Opcion {
  value: number;
  label: string;
}

interface Pais extends Opcion {
  codigoIso: string;
  longCelular: number;
}

interface InsertaRegistroVisitaPortalDTO {
  usuarioWeb: string;
  idAlumno?: number | null;
  correo?: string | null;
  nombre?: string | null;
  apellido?: string | null;
  idPais?: number | null;
  telefono?: string | null;
  idCargo?: number | null;
  idAreaFormacion?: number | null;
  idAreaTrabajo?: number | null;
  idIndustria?: number | null;
  usuario: string;
}