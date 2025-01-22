import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/Core/Shared/Services/Account/account.service';
import { DatosPortalService } from 'src/app/Core/Shared/Services/DatosPortal/datos-portal.service';
import { FormularioProgresivoConfiguracionCodigoDescuentoService } from 'src/app/Core/Shared/Services/FormularioProgresivoConfiguracionCodigoDescuento/formulario-progresivo-configuracion-codigo-descuento.service';
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
    private _FormularioProgresivoConfiguracionCodigoDescuentoService: FormularioProgresivoConfiguracionCodigoDescuentoService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private _router: Router,
    private _AccountService: AccountService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.formCamposDinamicos = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('600px', 'auto');
    this.obtenerListaBanderas();
    this.obtenerOpcionesCombos();
    this.formularioProgresivoYaMostradoLocal();
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    this.signal$.next(true);
    this.signal$.complete();
  }

  handleBeforeUnload(event: BeforeUnloadEvent): void {
    this.guardarFormularioEnLocalStorage();
    this.eliminaFormularioProgresivoYaMostrado();
  }
  
  formCamposDinamicos!: FormGroup;
  listaIconPais: Array<any> = [];
  valorDefectoPais: number | null = null;
  valorDefectoPaisTelef: string | null = null;
  tipoPagina: string = 'index';
  indicePrograma: number = 0;
  auxTipoPrograma: string = "";
  auxNombrePrograma: string = "";
  auxCorreoCliente: string = "";
  auxCodigoDescuento: string = "";
  public datosUsuario: datosRegistroVisitaPortalDTO[] = [];

  usuarioWeb: string = '';
  id: number = 0;
  tipo = null;
  idFormularioInicial = null;
  condicionMostrar = null;
  tiempoSesion = null;

  titulo = null;
  tituloTexto: string | null = null;

  cabeceraMensajeSup = null;
  cabeceraMensajeSupTexto: string | null = null;
  cabeceraMensaje = null;
  cabeceraMensajeIndexCurso = null;
  cabeceraMensajeTexto: string | null = null;
  cabeceraMensajeTextoCurso: string | null = null;
  cabeceraMensajeBordes = null;
  cabeceraMensajeInf = null;
  cabeceraMensajeInfIndexCurso = null;
  cabeceraMensajeInfTexto: string | null = null;
  cabeceraMensajeInfTextoCurso: string | null = null;
  cabeceraBoton = null;
  cabeceraBotonTexto: string | null = null;
  cabeceraBotonAccion = null;

  cuerpoMensajeSup = null;
  cuerpoMensajeSupTexto: string | null = null;

  boton = null;
  botonTexto: string | null = null;
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
    var dataRuta = JSON.parse(this._SessionStorageService.SessionGetValue('dataRuta'));
    this.indicePrograma = dataRuta.idBusqueda;
    this.tipoPagina = formData.tipoPagina
    // this.indicePrograma = formData.indicePrograma
    this.auxTipoPrograma = formData.auxTipoPrograma
    this.auxNombrePrograma = formData.auxNombrePrograma
    this.auxCorreoCliente = formData.auxCorreoCliente
    this.auxCodigoDescuento = formData.auxCodigoDescuento
    this.usuarioWeb = formData.usuarioWeb
    this.id = formData.id;
    this.tipo = formData.tipo;
    if (this.tipo === 2) {
      this.idFormularioInicial = formData.idFormularioProgresivoInicial;
    }
    this.condicionMostrar = formData.condicionMostrar;
    this.tiempoSesion = formData.tiempoSesion;
    this.titulo = formData.titulo;
    this.tituloTexto = this.reemplazarTextoConDiccionario(
      formData.tituloTexto || '',
      {
        '*correo cliente*': this.auxCorreoCliente || '',
        '*tipo programa*': this.auxTipoPrograma || 'programa',
        '*nombre programa*': this.auxNombrePrograma || 'programa',
        '*codigo descuento*': this.auxCodigoDescuento || ''
      }
    );
    this.cabeceraMensajeSup = formData.cabeceraMensajeSup;
    this.cabeceraMensajeSupTexto = this.reemplazarTextoConDiccionario(
      formData.cabeceraMensajeSupTexto || '',
      {
        '*correo cliente*': this.auxCorreoCliente || '',
        '*tipo programa*': this.auxTipoPrograma || 'programa',
        '*nombre programa*': this.auxNombrePrograma || 'programa',
        '*codigo descuento*': this.auxCodigoDescuento || ''
      }
    );
    this.cabeceraMensaje = formData.cabeceraMensaje;
    this.cabeceraMensajeIndexCurso = formData.cabeceraMensajeIndexCurso;
    this.cabeceraMensajeTexto = this.reemplazarTextoConDiccionario(
      formData.cabeceraMensajeTexto || '',
      {
        '*correo cliente*': this.auxCorreoCliente || '',
        '*tipo programa*': this.auxTipoPrograma || 'programa',
        '*nombre programa*': this.auxNombrePrograma || 'programa',
        '*codigo descuento*': this.auxCodigoDescuento || ''
      }
    );
    this.cabeceraMensajeTextoCurso = this.reemplazarTextoConDiccionario(
      formData.cabeceraMensajeTextoCurso || '',
      {
        '*correo cliente*': this.auxCorreoCliente || '',
        '*tipo programa*': this.auxTipoPrograma || 'programa',
        '*nombre programa*': this.auxNombrePrograma || 'programa',
        '*codigo descuento*': this.auxCodigoDescuento || ''
      }
    );
    this.cabeceraMensajeBordes = formData.cabeceraMensajeBordes;
    this.cabeceraMensajeInf = formData.cabeceraMensajeInf;
    this.cabeceraMensajeInfIndexCurso = formData.cabeceraMensajeInfIndexCurso;
    this.cabeceraMensajeInfTexto = this.reemplazarTextoConDiccionario(
      formData.cabeceraMensajeInfTexto || '',
      {
        '*correo cliente*': this.auxCorreoCliente || '',
        '*tipo programa*': this.auxTipoPrograma || 'programa',
        '*nombre programa*': this.auxNombrePrograma || 'programa',
        '*codigo descuento*': this.auxCodigoDescuento || ''
      }
    );
    this.cabeceraMensajeInfTextoCurso = this.reemplazarTextoConDiccionario(
      formData.cabeceraMensajeInfTextoCurso || '',
      {
        '*correo cliente*': this.auxCorreoCliente || '',
        '*tipo programa*': this.auxTipoPrograma || 'programa',
        '*nombre programa*': this.auxNombrePrograma || 'programa',
        '*codigo descuento*': this.auxCodigoDescuento || ''
      }
    );
    this.cabeceraBoton = formData.cabeceraBoton;
    this.cabeceraBotonTexto = this.reemplazarTextoConDiccionario(
      formData.cabeceraBotonTexto || '',
      {
        '*correo cliente*': this.auxCorreoCliente || '',
        '*tipo programa*': this.auxTipoPrograma || 'programa',
        '*nombre programa*': this.auxNombrePrograma || 'programa',
        '*codigo descuento*': this.auxCodigoDescuento || ''
      }
    );
    this.cabeceraBotonAccion = formData.cabeceraBotonAccion;

    this.cuerpoMensajeSup = formData.cuerpoMensajeSup;
    // this.cuerpoMensajeSupTexto = formData.cuerpoMensajeSupTexto;
    this.cuerpoMensajeSupTexto = this.reemplazarTextoConDiccionario(
      formData.cuerpoMensajeSupTexto || '',
      {
        '*correo cliente*': this.auxCorreoCliente || '',
        '*tipo programa*': this.auxTipoPrograma || 'programa',
        '*nombre programa*': this.auxNombrePrograma || 'programa',
        '*codigo descuento*': this.auxCodigoDescuento || ''
      }
    );

    this.boton = formData.boton;
    this.botonTexto = this.reemplazarTextoConDiccionario(
      formData.botonTexto || '',
      {
        '*correo cliente*': this.auxCorreoCliente || '',
        '*tipo programa*': this.auxTipoPrograma || 'programa',
        '*nombre programa*': this.auxNombrePrograma || 'programa',
        '*codigo descuento*': this.auxCodigoDescuento || ''
      }
    );
    this.botonAccion = formData.botonAccion;

    this.camposConfigurados = [];
    this.condicionMostrarCuerpo = false;
    this.tipoTelefono = false;

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
      this.valorDefectoPais = this.opcionesPorCampo.pais.find(pais => pais.codigoIso === codigoIso)?.value ?? null;
      this.valorDefectoPaisTelef = this.valorDefectoPais ? `+${this.valorDefectoPais.toString()}` : null;
      this.camposConfigurados.push({
        id: 'pais',
        label: 'País',
        tipo: 'text',
        tipoControl: 'combo',
        opciones: this.opcionesPorCampo.pais,
        valorDefecto: this.valorDefectoPais,
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
        tipo: 'phone',
        tipoControl: 'input',
        valorDefecto: this.valorDefectoPaisTelef,
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

  reemplazarTextoConDiccionario(texto: string, diccionario: { [clave: string]: string }): string {
    return texto.replace(/\*[^*]+\*/g, (match) => {
      return diccionario[match] || match;
    });
  }

  get mensajeCabecera(): string {
    if (this.cabeceraMensajeIndexCurso) {
      return this.tipoPagina === 'curso' 
        ? this.cabeceraMensajeTextoCurso ?? '' 
        : this.cabeceraMensajeTexto ?? '';
    }
    return this.cabeceraMensajeTexto ?? '';
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

      if (!valoresGuardados['pais'] || !valoresGuardados['telefono']) {
        if (!valoresGuardados['pais']) {
          delete valoresGuardados['pais'];
        }
        if (!valoresGuardados['telefono']) {
          delete valoresGuardados['telefono'];
        }
      }

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

  actualizarBandera(valorDefectoPais: number| string | null | undefined): void {
    const icono = this.getIconoPorPais(valorDefectoPais);
    const campoTelefono = this.camposConfigurados.find(campoConfig => campoConfig.id === 'telefono');
    if (campoTelefono) {
      campoTelefono.valorDefecto = valorDefectoPais;
    }
  }

  getIconoPorPais(valorDefectoAux: number | string | null | undefined): string {
    if (typeof valorDefectoAux === 'string' && valorDefectoAux.startsWith('+')) {
      valorDefectoAux = valorDefectoAux.substring(1);
    }
    const valorDefectoNumero = typeof valorDefectoAux === 'string' ? Number(valorDefectoAux) : valorDefectoAux;
    if (valorDefectoNumero && !isNaN(valorDefectoNumero)) {
      const pais = this.listaIconPais.find(pais => pais.idPais === valorDefectoNumero);
      return pais ? pais.icono : 'https://repositorioweb.blob.core.windows.net/repositorioweb/FlagIcons/internacional.png';
    }
    return 'https://repositorioweb.blob.core.windows.net/repositorioweb/FlagIcons/internacional.png';
  }

  onComboChange(event: any, campo: any): void {
    if (campo.id === 'pais') {
      const nuevoValorDefectoPais = event.value;
      const campoPais = this.camposConfigurados.find(campoConfig => campoConfig.id === 'pais');
      if (campoPais) {
        this.valorDefectoPais = nuevoValorDefectoPais
        campoPais.valorDefecto = this.valorDefectoPais;
        this.valorDefectoPaisTelef = nuevoValorDefectoPais? `+${nuevoValorDefectoPais.toString()}` : null;
      }
      const campoTelefono = this.camposConfigurados.find(campoConfig => campoConfig.id === 'telefono');
      if (campoTelefono) {
        this.formCamposDinamicos.patchValue({
          telefono: this.valorDefectoPaisTelef ?? ''
        });
        campoTelefono.valorDefecto = this.valorDefectoPaisTelef;
        const inputElement = document.getElementById('telefono') as HTMLInputElement;
        if (inputElement) {
          inputElement.value = this.valorDefectoPaisTelef ?? '';
          inputElement.selectionStart = inputElement.value.length;
        }
      }
      this.getIconoPorPais(nuevoValorDefectoPais);
    }
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    if (this.valorDefectoPaisTelef && typeof this.valorDefectoPaisTelef === 'string') {
      if (!value.startsWith(this.valorDefectoPaisTelef)) {
        value = this.valorDefectoPaisTelef + value.replace(/^(\+?\d*)/, '');
      }
      value = value.replace(/[^0-9+]/g, '');
      if (value.startsWith(this.valorDefectoPaisTelef)) {
        value = this.valorDefectoPaisTelef + value.substring(this.valorDefectoPaisTelef.length).replace(/\D/g, '');
      } else {
        value = this.valorDefectoPaisTelef + value.replace(/\D/g, '');
      }
      input.value = value;
      this.formCamposDinamicos.patchValue({
        telefono: value
      });
    }
  }

  accionarBoton(): void {
    if (this.botonAccion) {
      if (this.validaFormularioAccion()) {
        this.ejecutarFormularioProgresivo(this.botonAccion);
      }
    }
    else if (this.cabeceraBotonAccion) {
      this.ejecutarFormularioProgresivo(this.cabeceraBotonAccion);
    }
  }

  validaFormularioAccion(): boolean {
    if (this.formCamposDinamicos.invalid) {
      this.formCamposDinamicos.markAllAsTouched();
      return false;
    }
    return true;
  }

  async ejecutarFormularioProgresivo(accion: number): Promise<void> {
    switch (accion) {
      case 1:
      case 2:
      case 3:
        try {
          await this.guardaDatos(accion);
          await this.generaCodigoDescuento(accion);
          this.abreFormularioRespuesta(this.id);
          this.cerrarFormulario();
        } catch (error) {
          console.error('Error durante la ejecución del formulario progresivo:', error);
        }
        break;
      case 4:
        try {
          await this.copiaCodigo();
          this.abreFormularioRespuesta(this.id);
        } catch (error) {
          console.error('Error durante la ejecución del formulario progresivo:', error);
        }
        break;
      case 5:
        await this.guardaDatos(accion);
        this.abreFormularioRespuesta(this.id);
        this.cerrarFormulario();
        break;
      case 6:
        await this.guardaDatos(accion);
        await this.consultarDatosUsuarioFomularioProgresivoCompleto();
        this.guardaFormularioProgresivoActivoLocalStorage();
        this.enviaAulaVirtual();
        this.abreFormularioRespuesta(this.id);
        this.cerrarFormulario();
        break;

      default:
        console.warn('Acción no definida:', accion);
    }
  }

  formularioProgresivoYaMostradoLocal() {
    localStorage.setItem('formularioProgresivoYaMostrado', JSON.stringify(true));
  }

  guardaDatos(accion: number): Promise<void> {
    const valoresFormulario = this.formCamposDinamicos.value;
    const actualizarCampos: {
      idContactoPortal: boolean;
      correo: boolean;
      nombres: boolean;
      apellidos: boolean;
      pais: boolean;
      telefono: boolean;
      cargo: boolean;
      areaFormacion: boolean;
      areaTrabajo: boolean;
      industria: boolean;
    } = {
      idContactoPortal: false,
      correo: false,
      nombres: false,
      apellidos: false,
      pais: false,
      telefono: false,
      cargo: false,
      areaFormacion: false,
      areaTrabajo: false,
      industria: false,
    };
    this.camposConfigurados.forEach(campo => {
      if (campo.id in actualizarCampos) {
        if (valoresFormulario[campo.id] !== null && valoresFormulario[campo.id] !== undefined) {
          actualizarCampos[campo.id as keyof typeof actualizarCampos] = true;
        }
      }
    });
    const datosRegistro: InsertaRegistroVisitaPortalDTO = {
      usuarioWeb: this.usuarioWeb,
      idContactoPortal: null,
      correo: valoresFormulario.correo,
      nombre: valoresFormulario.nombres,
      apellido: valoresFormulario.apellidos,
      idPais: valoresFormulario.pais,
      telefono: valoresFormulario.telefono,
      idCargo: valoresFormulario.cargo,
      idAreaFormacion: valoresFormulario.areaFormacion,
      idAreaTrabajo: valoresFormulario.areaTrabajo,
      idIndustria: valoresFormulario.industria,
      usuario: "portalweb",
      accionBoton: accion,
      indicePrograma: this.indicePrograma,
      actualizarCampos,
    };
    const datosFinales = Object.fromEntries(
      Object.entries(datosRegistro).map(([key, value]) => [key, value !== undefined ? value : null])
    ) as InsertaRegistroVisitaPortalDTO;
    return this._RegistroVisitaPortalService.InsertaActualizaRegistroVisitaPortal(datosFinales)
    .pipe(takeUntil(this.signal$))
    .toPromise()
    .then(async () => {
      await this.consultarDatosUsuarioFomularioProgresivo();
      console.log('Registro insertado exitosamente');
    })
    .catch(error => {
      console.error('Error al insertar el registro:', error);
      throw error;
    });
  }

  generaCodigoDescuento(accion: number): Promise<void> {
    const valoresFormulario = this.formCamposDinamicos.value;
    const datosRegistro: InsertaActualizaRegistroVisitaPortalDTO = {
      accion: accion,
      correo: valoresFormulario.correo,
    }
    return new Promise((resolve, reject) => {
      this._FormularioProgresivoConfiguracionCodigoDescuentoService.ProcesoInsertarActualizarCodigoDescuento(datosRegistro)
        .pipe(takeUntil(this.signal$))
        .subscribe({
          next: (respuesta) => {
            this.auxCodigoDescuento = respuesta.datosCodigoDescuento.codigoDescuentoArmado;
            resolve();
          },
          error: (error) => {
            console.error('Error al consultar datos del usuario:', error);
            reject(error);
          },
        });
    });
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

  guardaFormularioProgresivoActivoLocalStorage() {
    const formularioProgresivoActivo = 'Y';
    localStorage.setItem('formularioProgresivo Activo', JSON.stringify(formularioProgresivoActivo));
  }

  enviaAulaVirtual(): void {
    var token=this._SessionStorageService.validateTokken();
    if(token){
      this._AccountService.RegistroCursoAulaVirtualNueva(this.indicePrograma).pipe(takeUntil(this.signal$)).subscribe({
        next:x=>{
          this._router.navigate(['/AulaVirtual/MisCursos']);
        },
      })
    }
    else{
      this._SessionStorageService.SessionSetValueSesionStorage("accesoPrueba",this.indicePrograma.toString());
      this._router.navigate(['/Registrarse']);
    }
  }

  consultarDatosUsuarioFomularioProgresivoCompleto(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._RegistroVisitaPortalService.ObtenerListaRegistroVisitaPortalPorUsuarioWeb(this.usuarioWeb)
        .pipe(takeUntil(this.signal$))
        .subscribe({
          next: (respuesta) => {
            if (respuesta && respuesta.datosRegistroVisitaPortal && respuesta.datosRegistroVisitaPortal.length > 0) {
              this.datosUsuario = respuesta.datosRegistroVisitaPortal[0];
              this.guardarFormularioProgresivoCompletoLocalStorage();
            } else {
              this.datosUsuario = [];
            }
            resolve();
          },
          error: (error) => {
            console.error('Error al consultar datos del usuario:', error);
            reject(error);
          },
        });
    });
  }

  guardarFormularioProgresivoCompletoLocalStorage(): void {
    const valoresFormulario = this.datosUsuario;
    localStorage.setItem('DatosFormularioProgresivo', JSON.stringify(valoresFormulario));
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
                tipoPagina: "",
                indicePrograma: this.indicePrograma,
                auxTipoPrograma: this.auxTipoPrograma,
                auxNombrePrograma: this.auxNombrePrograma,
                auxCorreoCliente: this.auxCorreoCliente,
                auxCodigoDescuento: this.auxCodigoDescuento,
                usuarioWeb: this.usuarioWeb,
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
                cabeceraMensajeIndexCurso: formularioRpta.cabeceraMensajeIndexCurso,
                cabeceraMensajeTexto: formularioRpta.cabeceraMensajeTexto,
                cabeceraMensajeTextoCurso: formularioRpta.cabeceraMensajeTextoCurso,
                cabeceraMensajeBordes: formularioRpta.cabeceraMensajeBordes,
                cabeceraMensajeInf: formularioRpta.cabeceraMensajeInf,
                cabeceraMensajeInfIndexCurso: formularioRpta.cabeceraMensajeInfIndexCurso,
                cabeceraMensajeInfTexto: formularioRpta.cabeceraMensajeInfTexto,
                cabeceraMensajeInfTextoCurso: formularioRpta.cabeceraMensajeInfTextoCurso,
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

  async consultarDatosUsuarioFomularioProgresivo(): Promise<void> {
    this.auxCorreoCliente = "";
    await this._RegistroVisitaPortalService.ObtenerListaRegistroVisitaPortalPorUsuarioWeb(this.usuarioWeb)
    .pipe(takeUntil(this.signal$))
    .toPromise()
    .then(response => {
        if (response && response.datosRegistroVisitaPortal && response.datosRegistroVisitaPortal.length > 0) {
            this.auxCorreoCliente = response.datosRegistroVisitaPortal[0].correo;
        } else {
            console.warn('No se encontraron datos válidos en la respuesta.');
        }
    })
    .catch(error => {
        console.error('Error al consultar datos del usuario:', error);
    });
  }


  cerrarFormulario(): void {
    this.guardarFormularioEnLocalStorage();
    this.eliminaFormularioProgresivoYaMostrado();
    this.dialogRef.close();
  }

  guardarFormularioEnLocalStorage(): void {
    const valoresFormulario = this.formCamposDinamicos.getRawValue();
    localStorage.setItem('formularioGuardado', JSON.stringify(valoresFormulario));
  }

  eliminaFormularioProgresivoYaMostrado() {
    localStorage.removeItem('formularioProgresivoYaMostrado');
  }

}

interface CampoConfigurado {
  id: string;
  label: string;
  tipo: string;
  tipoControl: 'input' | 'combo';
  opciones?: { value: any; label: string }[];
  valorDefecto: number| string | null | undefined;
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
  idContactoPortal?: number | null;
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
  accionBoton: number;
  indicePrograma: number;
  actualizarCampos: {
    idContactoPortal: boolean;
    correo: boolean;
    nombres: boolean;
    apellidos: boolean;
    pais: boolean;
    telefono: boolean;
    cargo: boolean;
    areaFormacion: boolean;
    areaTrabajo: boolean;
    industria: boolean;
  };
}

interface datosRegistroVisitaPortalDTO {
  correo?: string;
  nombre?: string;
  apellido?: string;
  idPais?: number;
  telefono?: string;
  idCargo?: number;
  idAreaFormacion?: number;
  idAreaTrabajo?: number;
  idIndustria?: number;
}

interface InsertaActualizaRegistroVisitaPortalDTO {
  accion: number;
  correo: string;
}