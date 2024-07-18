export interface ChatAtencionClienteContactoRegistrarDTO {
  IdContactoPortalSegmento: string;
  IdPGeneral: number;
  IdPEspecifico: number;
  IdAlumno: number;
  ChatIniciado: boolean;
  FormularioEnviado: boolean;
  ChatFinalizado: boolean;
  IdOportunidad: number;
  IdMatriculaCabecera?: number;
  EsAcademico?: boolean;
  EsSoporteTecnico?: boolean;
}
export interface ChatAtencionClienteContactoDetalleRegistrarDTO {
  IdChatAtencionClienteContacto: number;
  PasoActual: number;
  CasoActual: string;
  PasoSiguiente: number;
  CasoSiguiente: string;
  MensajeEnviado: string;
}
export interface ChatAtcFormularioEnviadoDTO{
  id:string,
  idAlumno:number
}
export interface ChatAtencionClienteContactoActualizarDTO {
  Id: number;
  IdPGeneral: number;
  IdPEspecifico: number;
  IdAlumno: number;
  FormularioEnviado: boolean;
  IdOportunidad: number;
  IdFaseOportunidadPortal: string;
  IdMatriculaCabecera: number;
}
