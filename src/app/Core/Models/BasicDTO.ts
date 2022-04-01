export interface Basic{
  Nombre:string,
  value:number
}
export interface BasicUrl{
  Nombre:string,
  value:number,
  Url:string,
  style?:any
}

export interface BasicBotonesExpandibles{
  Nombre:string,
  style?:any,
  data:Array<BasicUrl>
}
