
export interface BeneficiosDTO{
  version:string,
  contenido:Array<BeneficiosContenidoDTO>,
  paquete:number
}


export interface BeneficiosContenidoDTO{
  idBeneficio:number,
  contenido:string,
}
export interface DetallesDatoAdicionalDTO{
  id:number,
  idMatriculaCabeceraBeneficios:number,
  idMatriculaCabecera:number,
  codigoMatricula:string,
  datosAdicionales:Array<DatoAdicionalBeneficioDTO>
}
export interface DatoAdicionalBeneficioDTO{
  id:number,
  contenido:string
}
