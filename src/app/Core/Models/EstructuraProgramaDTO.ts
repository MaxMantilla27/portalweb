
export interface estructuraCursoDTO{
  duracion:number,
  subTitulo:Array<estructuraCursoSubtituloDTO>,
  titulo:string,
  opened:boolean
}
export interface estructuraCursoSubtituloDTO{
  contenido:string,
  documento:number,
  numeroFila:number
}
