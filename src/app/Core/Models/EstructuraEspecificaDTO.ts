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
  OrdenSeccion:number
}
export interface  ParametrosCrucigramaVideoSesionDTO
{
    IdPGeneral:number,
    IdCapitulo:number,
    IdSesion:number,
    AccesoPrueba:boolean,
}
export interface EvaluacionPromedioCrucigramaDTO{
  Id:number,
  IdCrucigrama:number,
  IdPrincipal:number,
  IdPGeneral:number,
  IdPEspecificoPadre:number,
  IdPEspecifico:number,
  OrdenFilaCapitulo:number,
  OrdenFilaSesion:number,
  CodigoCrucigrama:string,
  Calificacion:number,
  AccesoPrueba:boolean,
}
export interface RegistroVideoUltimaVisualizacionDTO
{
  id:number,
  idPrincipal:number,
  idPGeneral:number,
  idPEspecificoPadre:number,
  idPEspecificoHijo:number,
  idCapitulo:number,
  idSesion:number,
  tiempoVisualizacion:number,
  accesoPrueba:boolean,
}
export interface ParametrosEstructuraEspecificaAccesoPruebaDTO {
  IdAccesoPrueba: number;
  IdPEspecificoPadre: number;
  IdPEspecificoHijo: number;
  IdPGeneralPadre: number;
  IdPGeneralHijo: number;
  AccesoPrueba: boolean;
  NombrePrograma: string;
  NombreCapitulo: string;
  idModalidad: number;
}
