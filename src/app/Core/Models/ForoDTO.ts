export interface ForoDTO{
    idPrincipal:number,
    idCurso: number,
    idPEspecificoPadre: number,
    idPEspecificoHijo: number,
    titulo: string,
    contenido: string
}

export interface ForoRespuestaDTO{
    idForoCurso:number,
    idPrincipal:number,
    idPGeneral: number,
    idPEspecificoPadre: number,
    idPEspecificoHijo: number,
    contenido: string,
    esDocente: boolean,
    estadoAtendido:number,
}
export interface ForoDTOCompleto{
  idPrincipal:number,
  idCurso: number,
  idPEspecificoPadre: number,
  idPEspecificoHijo: number,
  titulo: string,
  contenido: string,
  idOrigenForo: number,
  idCapitulo: number,
  idSesion: number,
  idSubSesion: number,
  idVideo: string,
  urlArchivo: string,
}
