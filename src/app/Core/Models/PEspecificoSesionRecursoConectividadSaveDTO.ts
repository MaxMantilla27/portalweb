export interface PEspecificoSesionRecursoConectividadSaveDTO {
  IdPEspecificoSesion: number;
  IdPwTipoExamen:  number|null;
  TrabajoGrupal:  number|null;
  ExposicionAlumnos:  number|null;
  UsoCamara:  boolean|null;
  IdPwTipoDispositivo:  number|null;
  IdPwTipoAmbienteClase:  number|null;
  Usuario: string;
}
