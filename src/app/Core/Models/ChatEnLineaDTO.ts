export interface ValidacionChatFormularioDTO{
  Email:string,
  Nombres:string,
  Apellidos:string,
  Movil:string,
  IdPais?:number,
  IdRegion?:number,
  IdLocalidad?:number
}
export interface ValidacionChatEnvioDTO{
  Email:string,
  Nombres:string,
  Apellidos:string,
  Movil:string,
  IdPrograma?:number,
  EstadoAsesor:string,
  IdUsuario?:string,
  IdCategoriaDato?:number,
  IdCampania?:number,
  IdPespecifico?:number,

}
export interface SetChat{
  idprogramageneralalumno?:number,
  idcursoprogramageneralalumno?:number,
  idcapitulo?:number,
  idsesion?:number,
  idMatriculaCabecera?:number,
  idcentrocosto?:number,
  idcoordinadora?:number,
}
