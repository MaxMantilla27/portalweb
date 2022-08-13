export interface ParticipacionExpositorFiltroDTO {
  IdArea: string | null;
  IdSubArea: string | null;
  IdPGeneral: string | null;
  IdProgramaEspecifico: string | null;
  IdCentroCosto: string | null;
  IdEstadoPEspecifico: string | null;
  IdCodigoBSCiudad: string | null;
  IdModalidadCurso: string | null;
  IdCentroCostoD: number;
  IdProveedorOperaciones: string;
  SinNotaAprobada: boolean | null;
  SinAsistenciaAprobada: boolean | null;
}

export interface NotaRegistrarDTO {
  Id: number;
  IdEvaluacion: number;
  IdMatriculaCabecera: number;
  Nota: number;
}

export interface AsistenciaRegistrarDTO {
  Id: number;
  IdPEspecificoSesion: number;
  IdMatriculaCabecera: number;
  Asistio: boolean;
  Justifico: boolean;
}
export interface ParametroNotaRegistrarV3DTO {
  Id: number;
  IdPespecifico: number;
  Grupo: number;
  IdMatriculaCabecera: number;
  IdEsquemaEvaluacionPGeneralDetalle: number;
  IdParametroEvaluacion: number;
  IdEscalaCalificacionDetalle?: number;
  PortalTareaEvaluacionTareaId?: number;
  EsProyectoAnterior: boolean;
  IdProyectoAplicacionEnvioAnterior?: number;
  NombreArchivoRetroalimentacion: string;
  UrlArchivoSubidoRetroalimentacion: string;
}
