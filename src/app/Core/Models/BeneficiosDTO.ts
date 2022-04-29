
export interface BeneficiosDTO{
  version:string,
  contenido:Array<BeneficiosContenidoDTO>,
  paquete:number
}


export interface BeneficiosContenidoDTO{
  idBeneficio:number,
  contenido:string,
}
