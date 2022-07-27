export interface EvaluacionRegistrarDTO {
  Id: number | null,
  IdPEspecifico: number,
  Grupo: number,
  Nombre: string,
  IdCriterioEvaluacion: number | null,
  Porcentaje: number,
  Usuario: string,
}
export interface EvaluacionListadoDTO {
  Id: number | null,
  IdPEspecifico: number,
  Grupo: number,
  Nombre: string,
  IdCriterioEvaluacion: number | null,
  Porcentaje: number,
}
export interface PEspecificoSilaboRegistrarDTO {
  Id: number,
  IdPespecifico: number,
  ObjetivoAprendizaje: string,
  PautaComplementaria: string,
  PublicoObjetivo: string,
  Material: string,
  Bibliografia: string,
  Usuario: string,
  IdProveedor: number,
  ListadoCriteriosEvaluacion: Array<EvaluacionListadoDTO>,
}
