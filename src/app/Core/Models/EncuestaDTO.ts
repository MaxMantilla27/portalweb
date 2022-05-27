export interface ParametrosEncuestaDTO {
  IdPGeneral: number;
  IdEvaluacion: number;
}

export interface ParametroEnvioEncuestaDTO {
  IdPrincipal: number;
  IdPGeneral: number;
  IdPEspecificoPadre: number;
  IdPEspecifico: number;
  Respuestas: Array<ExamenRealizadoRespuestasDTO>;
}

export interface ExamenRealizadoRespuestasDTO
{
  Id:number,
  IdExamenAsignado:number,
  IdPregunta:number,
  IdRespuesta:number,
  TextoRespuesta:string,
}
