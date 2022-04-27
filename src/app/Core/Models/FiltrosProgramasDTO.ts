export interface FiltrosProgramasDTO{
  areaCapacitacion:Array<AreaCapacitacionDTO>,
  modalidad:Array<ModalidadDTO>,
  tipoPrograma:Array<TipoProgramaDTO>,
}
export interface AreaCapacitacionDTO{
  id:number,
  nombre:string,
  subAreaCapacitacion:Array<SubAreaCapacitacionDTO>,
}
export interface SubAreaCapacitacionDTO{
  id:number,
  idAreaCapacitacion:number,
  nombre:string,
}
export interface ModalidadDTO{
  id:number,
  nombre:string,
}
export interface TipoProgramaDTO{
  id:number,
  nombre:string,
}
export interface FiltroProgramasEnvioDTO{
  idArea:Array<number>,
  idSubArea:Array<number>,
  Modalidad:Array<number>,
  IdCategoria:Array<number>,
  Minimo:number,
  Maximo:number,
}
