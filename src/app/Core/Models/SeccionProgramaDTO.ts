export interface programaCabeceraDetalleDTO{
  areaCapacitacion:string,
  areaDescripcion:string,
  duracion:string,
  imagenPrograma:string,
  imgPrincipal:string,
  nombre:string,
  nombreSubArea:string,
  subAreaDescripcion:string,
  tituloHtml:string,
  listProgramaEspecificoInformacionDTO:Array<listProgramaEspecificoInformacionDTO>,
  idPartner:any
}
export interface listaSeccionPrograma{
  duracionHorario:string,
  metodologiaOnline:string,
  objetivo:string,
  publicoObjetivo:string,
  video:string,
  vistaPrevia:string,
}
export interface listProgramaEspecificoInformacionDTO{
  ciudad:string,
  codigoIso:string,
  duracion:string,
  estadoPId:number,
  fechaCreacion:string,
  fechaInicio:string,
  id:number,
  idCategoria:number,
  nombre:string,
  tipo:string,
  fechaInicioTexto:string,
}
export interface listaPrerrequisitoDTO{
  cabecera:string;
  contenido:Array<string>;
  piePagina:string;
}

export interface listaCertificacionDTO{
  cabecera:string;
  contenido:Array<string>;
  piePagina:string;
  descripcion:string;
  descripcionHeader:Array<string>;
  descripcionBody:Array<string>;
  descripcionLeyenda:string
}

export interface listaMontoPagoProgramaInformacionDTO{
  cuotas:string;
  idTipoPago:number;
  matricula:string;
  nroCuotas:number;
  simbolo:string;
  paquete:number;
  porcentajeDescuento:number;
  precio:number;
  precioDescuento:number;
  textoCabeceraDescuento:string;
  montoPagoDescripcion:string;
}
