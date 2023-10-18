export interface PEspecificoSesionCuestionarioSaveDTO {
  Id?: number;
  IdPEspecificoSesion: number;
  Titulo: string,
  Descripcion: string,
  FechaEntrega: string,
  IdCriterioEvaluacion: number;
  CalificacionMaxima: number;
  TiempoLimite: number;
  Preguntas: Array<PEspecificoSesionCuestionarioPreguntaFileDTO>;
  Usuario: string,
  FechaEntregaSecundaria: string | null,
  CalificacionMaximaSecundaria: number
}
export interface PEspecificoSesionCuestionarioPreguntaFileDTO {
  Id: number;
  IdPreguntaTipo: number | null;
  Enunciado: string,
  Descripcion: string,
  Puntaje: number;
  NombreArchivo: string | null;
  UrlArchivoSubido: string | null;
  Retroalimentacion: string | null;
  NombreArchivoRetroalimentacion: string | null;
  UrlArchivoSubidoRetroalimentacion: string | null;
  file: File;
  fileRetroalimentacion: File;
  Alternativas: Array<PEspecificoSesionCuestionarioPreguntaAlternativaDTO>;
}
export interface PEspecificoSesionCuestionarioPreguntaAlternativaDTO {
  Id: number | null;
  Alternativa: string,
  EsCorrecta: boolean;
  Puntaje: number;
  Disabled: boolean;

}
export interface PEspecificoSesionTareaSaveDTO {
  Id?: number;
  IdPEspecificoSesion: number;
  Titulo: string,
  Descripcion: string | null;
  file: File;
  FechaEntrega: string,
  IdCriterioEvaluacion: number;
  CalificacionMaxima: number;
  TieneArchivo: boolean;
  Usuario: string,
  FechaEntregaSecundaria: string | null,
  CalificacionMaximaSecundaria: number;
}

export interface PEspecificoSesionTareaAlumnoSaveParamsDTO {
  IdPEspecificoSesion: number;
  IdPwPEspecificoSesionTarea: number;
  IdMatriculaCabecera: number;
  file: File;
  Usuario: string,
}
export interface PEspecificoSesionMaterialAdicionalSaveDTO {
  Id: number | null;
  IdPEspecificoSesion: number;
  file: File;
  Usuario: string,
}

export interface AgregarPEspecificoSesionCuestionarioAlumnoDTO {
  IdPEspecificoSesion: number;
  IdPwPEspecificoSesionCuestionario: number;
  IdMatriculaCabecera: number;
  Preguntas: Array<RespuestasPreguntasDTO>;
  Usuario: string,
}
export interface RespuestasPreguntasDTO {
  IdPwPEspecificoSesionCuestionarioPregunta: number;
  Respuestas: Array<RespuestasCuestionarioDTO>;
}
export interface RespuestasCuestionarioDTO {
  valor: string,
}

export interface AgregarCalificacionCuestionarioAlumnoDocenteDTO {
  IdPwPEspecificoSesionCuestionarioAlumno: number;
  Respuestas: Array<RespuestasPreguntasDocenteDTO>;
  Usuario: string,
}
export interface RespuestasPreguntasDocenteDTO {
  Id: number;
  Puntos:number;
  Correcto: boolean;
  Retroalimentacion: string|null,
  file: File;
}

export interface CalificarTareaAlumnoOnlineDTO {
  Id: number,
  Nota: number,
  Retroalimentacion: string|null,
  file: File;
}
