export interface ParametroObtenerEvaluacionTarea {
  id:number,
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
  idMatriculaCabecera:number
}
export interface ParametroEnvioTrabajoPares{

  IdEvaluacion:number,
  IdParametroEvaluacion:number,
  IdEscalaCalificacionDetalle:number,
  ValorCalificado:number,
  IdEsquemaEvaluacionPGeneralDetalle:number,
  file: File,
  Retroalimentacion: string;
}
export interface ParametroEnvioCriterioReflexivo
{
  Registros:Array<ListaRespuestaReflexivosDTO> ,
  IdUsuario:  string ,
  IdEvaluacion:  number ,
  IdPGeneral:  number ,
  IdPEspecifico:  number,
  IdTareaEvaluacionTarea:number
}
export interface ListaRespuestaReflexivosDTO
{
  IdParametroEvaluacion:number ,
  IdEscalaCalificacionDetalle:number ,
  IdEsquemaEvaluacionPGeneralDetalle:number ,
  IdEsquemaEvaluacionPGeneralDetalleCongelado:number ,
}

export interface DevolverProyectoDTO
{
  Id:number ,
  Motivo:string
}
