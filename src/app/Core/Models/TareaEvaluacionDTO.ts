export interface ParametroObtenerEvaluacionTarea {
  idPrincipal: number;
  idPGeneral: number;
  idPEspecificoPadre: number;
  idPEspecifico: number;
  idEvaluacion: number;
}
export interface ModelTareaEvaluacionTareaDTO {
  file: File;
  idPGeneral: number;
  idPrincipal: number;
  idPEspecificoPadre: number;
  idPEspecificoHijo: number;
  idEvaluacion: number;
  idTipoEvaluacionTrabajo: number;
  idEsquemaEvaluacionPGeneralDetalle: number;
  idEsquemaEvaluacionPGeneralDetalle_Anterior: number;
}
