export interface PEspecificoCarreraTrabajoDTO {
  Id?: number;
  IdPEspecifico: number;
  Titulo: string;
  Descripcion: string | null;
  file: File;
  PlazoEntrega: number;
  CalificacionMaxima: number;
  TieneArchivo: boolean;
  Usuario: string;
}

export interface CalificarTrabajoCarreraFileDataDTO {
  Id: number,
  Nota: number,
  Retroalimentacion: string|null,
  file: File;
}

export interface AgregarCalificacionCarreraExamenAlumnoDocenteDTO {
  IdPwMatriculaAlumnoCarreraExamen: number;
  Respuestas: Array<CarreraExamenRespuestasPreguntasDocenteDTO>;
  Usuario: string,
}
export interface CarreraExamenRespuestasPreguntasDocenteDTO {
  Id: number;
  Puntos:number;
  Retroalimentacion: string|null,
  file: File;
}
