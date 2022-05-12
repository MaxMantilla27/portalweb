
export interface AvatarDTO{
  idAvatar:number,
  idAlumno:number,
  idAspNetUsers:string,
  topC:string,
  accessories:string,
  hair_Color:string,
  facial_Hair:string,
  facial_Hair_Color:string,
  clothes:string,
  clothes_Color:string,
  eyes:string,
  eyesbrow:string,
  mouth:string,
  skin:string
}
export interface AvatarCaracteristicaDTO{
  IdAvatarCaracteristica:number,
  Etiqueta:string,
  Valor:string,
}
export interface AvatarCombosDTO{
  listaCabello:Array<any>,
  listaColorCabello:Array<any>,
  listaBarbaBigote:Array<any>,
  listaColorBarbaBigote:Array<any>,
  listaMirada:Array<any>,
  listaCejas:Array<any>,
  listaBoca:Array<any>,
  listaColorPiel:Array<any>,
  listaRopa:Array<any>,
  listaColorRopa:Array<any>,
  listaAccesorios:Array<any>,
  UrlAvatar:string,
  DatosAvatar:AvatarDTO,
}

export interface AvatarEnvioDTO{
  topC:string,
  accessories:string,
  hair_Color:string,
  facial_Hair:string,
  facial_Hair_Color:string,
  clothes:string,
  clothes_Color:string,
  eyes:string,
  eyesbrow:string,
  mouth:string,
  skin:string
}
