export interface InicioEntradaChatbotDTO {
  IdContactoPortalSegmento: string;
  IdFormulario: number;
}
export interface InformacionFormularioChatBotDTO {
  IdFormulario: number;
  IdPGeneral: number;
  NombrePGeneral: string;
  IdPEspecifico: number;
  IdCategoriaOrigen: number;
  IdConjuntoAnuncio: number;
  CodigoPGeneral: string;
}
export interface DetalleInicialChatBotDTO {
  IdChatbotUsuarioContacto: number;
  NombreUsuarioRegistrado?: string;
  Registrado: boolean;
  Historial: Array<ChatbotUsuarioRespuestaDTO>;
  DatosFormulario: InformacionFormularioChatBotDTO;
  DatosAlumno: ValidacionCorreoAlumnoDTO;
}
export interface ChatbotUsuarioRespuestaDTO {
  IdChatbotUsuarioContacto: number;
  UsuarioRegistrado?: boolean;
  IdConfiguracionFlujoChatbot?: number;
  Paso: number;
  Caso?: string;
  MensajeEnviado?: string;
  OpcionEnviadoJson?: string;
  Respuesta?: string;
  IdCampoContacto?: number;
}
export interface ComboContactoPortal {
  IdAlumno: number;
  Nombre: string;
}
export interface FlujoChatEntradalDTO {
  IdChatbotUsuarioContacto: number;
  UsuarioRegistrado: boolean;
  IdConfiguracionFlujoChatbot: number;
  Paso: number;
  Caso?: string;
  MensajeEnviado?: string;
  OpcionEnviadoJson?: string;
  Respuesta?: string;
  IdRespuesta?: number;
  IdCampoContacto: number;
  EsMensajeFinal?: boolean;
  CodigoPGeneral: string;
  NombreUsuario: string;
  NombrePGeneral: string;
  IdOportunidad: number;
  IdAlumno: number;
}
export interface ItemPreguntaChatBotCompuesto {
  ItemFlujo: ChatbotFlujoPreguntaPredefinidaDTO;
  Opciones: Array<ComboSPChatBotDTO>;
}
export interface ChatbotFlujoPreguntaPredefinidaDTO {
  IdChatbotConfiguracionFlujo: number;
  UsuarioRegistrado: boolean;
  Paso: number;
  Caso?: string;
  EsMensajeFinal?: boolean;
  Mensaje?: string;
  FuncionObtenerOpcion?: string;
  TipoOpcion?: string;
  NombreFuncion?: string;
  MensajeErrorValidacion?: string;
  TipoDeEntradaRespuesta?: string;
  MensajeFinalError?: string;
  CantidadValidacion?: number;
  IdCampoContacto: number;
  TipoEntrada?: string;
}
export interface ComboSPChatBotDTO {
  Id: number;
  Nombre: string;
}
export interface DeserializarProgramasDTO {
  IdAlumno: number;
  IdPGeneral: number;
  Probabilidad: number;
}
export interface ProbabilidadOportunidadDTO {
  IdOportunidad: number;
  Probabilidad: number;
}

export interface ValidacionCorreoAlumnoDTO {
  IdAlumno: number;
  NombresCompletos: string;
  Celular?: number;
  Correo: string;
  IdPais: number;
  IdCiudad: number;
  IdAreaTrabajo: number;
  IdCargo: number;
  IdAreaFormacion: number;
  IdIndustria: number;
}

export interface ActualizarAlumnoChatBotDTO {
  IdAlumno: number;
  IdentificadorApi: string;
  Valor: string;
}

export interface ValidacionChatBotEnvioDTO {
  Correo: string;
  NombresCompletos: string;
  Celular: string;
  IdUsuario?: string;
  IdPrograma: number;
  IdCategoriaDato: number;
  IdPespecifico: number;
  IdCampania?: number;
  IdPais?:number;
}
