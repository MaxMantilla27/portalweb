
export interface PespecificoSesionTemaSaveDTO {
  IdPespecificoSesion: number;
  Usuario: string;
  Tema: string;
}
export interface PespecificoSesionTemaUpdateOrdenDTO {
  Id: number;
  Orden: number;
}
export interface PespecificoSesionTemaUpdateDTO {
  Id: number;
  Usuario: string;
  Tema: string;
}
export interface PespecificoSesionTemaDeleteDTO {
  Id: number;
  Usuario: string;
}
