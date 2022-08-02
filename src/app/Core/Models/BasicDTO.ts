export interface Basic{
  Nombre:string,
  value:any
}
export interface BasicUrl{
  Nombre:string,
  value:number,
  Url:string,
  style?:any,
  change?:boolean
}

export interface BasicUrlIcon{
  Nombre:string,
  value:string,
  Url:string,
  Icon:string,
  style?:any
}
export interface PaisesListaDTO{
  Nombre:string,
  value:string,
  Url:string,
  Icon:string,
  style?:any
}
export interface PaisesDTO{
  Nombre:string,
  value:string,
  Url:string,
  Icon?:string,
  style?:any,
  PrefijoTelefono:string
}
export interface BasicBotonesExpandibles{
  Nombre:string,
  style?:any,
  data:Array<BasicUrl>,
  estatus:boolean
}
export interface BasicCarousel{
  path:string,
  width:number,
  height:number
}

export interface CardMatriculasDTO{
  Title:string,
  Img:string,
  ImgAlt:string,
  Tipo:number,
  Url:string,
}
export interface CardProgramasDTO{
  Title:string,
  Img:string,
  ImgAlt:string,
  Url:string,
  Content:string
  Inversion:string
}

export interface CardMatriculasPruebaDTO{
  Title:string,
  Img:string,
  ImgAlt:string,
  Tipo:number,
  Url:string,
  Valido:boolean
}
