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
}

export interface NotaRegistrarDTO {
  Id: number;
  IdEvaluacion: number;
  IdMatriculaCabecera: number;
  Nota: number;
}
