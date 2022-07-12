export interface ValidacionChatFormularioDTO{
  Email:string,
  Nombres:string,
  Apellidos:string,
  Movil:string,
}
export interface ValidacionChatEnvioDTO{
  Email:string,
  Nombres:string,
  Apellidos:string,
  Movil:string,
  IdPrograma?:number,
  EstadoAsesor:string,
  IdUsuario?:string,
}
