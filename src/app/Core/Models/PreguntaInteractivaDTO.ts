export interface GrupoPreguntaFiltroDTO {
  IdPgeneral: number;
  IdPEspecifico:number,
  GrupoPregunta: string;
}

export interface  ValidaRespuestaPreguntaDTO
{
    IdPGeneral:number,
    IdPEspecifico:number,
    IdPregunta:number,
    IdRespuesta:Array<number>,
    Texto:string|null,
}

export interface  RegistroPreguntaDTO
{
    IdPrincipal:number,
    IdPGeneral:number,
    IdPEspecifico:number,
    IdPEspecificoPadre:number,
    IdPregunta:string|null,
    IdRespuesta:string|null,
    Texto:string|null,
    IdSexo:number,
    IdAccesoPrueba:boolean
}
