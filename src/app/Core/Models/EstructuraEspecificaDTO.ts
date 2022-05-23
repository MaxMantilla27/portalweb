export interface ParametrosEstructuraEspecificaDTO {
  IdMatriculaCabecera: number;
  IdPEspecificoPadre: number;
  IdPEspecificoHijo: number;
  IdPGeneralPadre: number;
  IdPGeneralHijo: number;
  AccesoPrueba: boolean;
  NombrePrograma: string;
  NombreCapitulo: string;
  idModalidad: number;
}
export interface ParametrosVideoSesionDTO {
  IdMatriculaCabecera: number;
  IdPGeneral: number;
  IdCapitulo: number;
  IdSesion: number;
  AccesoPrueba: boolean;
}
