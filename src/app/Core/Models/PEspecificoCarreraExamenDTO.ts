export interface PEspecificoCarreraExamenSaveDTO {
  Id?: number;
  IdPEspecifico: number;
  Titulo: string;
  Descripcion: string | null;
  PlazoEntrega: number;
  CalificacionMaxima: number;
  TiempoLimite: number;
  Preguntas: Array<PEspecificoCarreraExamenPreguntaFileDTO>;
  Usuario: string;
}
export interface PEspecificoCarreraExamenPreguntaFileDTO {
  Id: number;
  IdPreguntaTipo: number;
  Enunciado: string;
  Descripcion: string | null;
  Puntaje: number;
  NombreArchivo: string | null;
  UrlArchivoSubido: string | null;
  Retroalimentacion: string | null;
  NombreArchivoRetroalimentacion: string | null;
  UrlArchivoSubidoRetroalimentacion: string | null;
  file: File;
  fileRetroalimentacion: File;
  Alternativas: Array<PEspecificoCarreraExamenPreguntaAlternativaDTO>;
}

export interface PEspecificoCarreraExamenPreguntaAlternativaDTO {
  Id: number | null;
  Alternativa: string;
  EsCorrecta: boolean;
  Puntaje: number;
  Disabled: boolean;
}
