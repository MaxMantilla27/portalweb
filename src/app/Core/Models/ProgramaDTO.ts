export interface CarreraProfesionalTecnicaDTO{
  nombre:string,
  titulo:string,
  idBusqueda:number,
  urlWeb?:string,
  imagen:string,
  imagenAlt?:string,
  descripcion:string
}
export interface CarreraProfesionalTecnicaDetalleDTO{
  programaGeneralInformacionVistaDTO?: Object,
  montoPagoProgramaInformacionDTO?: Object,
  parametroSeoProgramaDTO?: Object,
  programaEspecificoInformacionDTO?: [],
  contenidoProgramaInformacionDTO?: [],
}
