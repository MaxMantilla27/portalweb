export interface Basic{
  Nombre:string,
  value:number
}
export interface BasicUrl{
  Nombre:string,
  value:number,
  Url:string,
  style?:any,
  change?:number
}

export interface BasicUrlIcon{
  Nombre:string,
  value:string,
  Url:string,
  Icon?:string,
  style?:any
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

export interface CardProgramasDTO{
  Title:string,
  Img:string,
  ImgAlt:string,
  Url:string,
  Content:string
}
