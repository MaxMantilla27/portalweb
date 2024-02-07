export interface datosAlumnoDTO {
  apellidos: string,
  direccion: string,
  dni: string,
  email: string,
  empresa: string,
  idAlumno: number,
  idAreaFormacion: number,
  idAreaTrabajo: number,
  idCargo: number,
  idDepartamento: number,
  ciudad: string,
  idGenero: number,
  idIndustria: number,
  idPais: number,
  idTipoDocumento: string,
  nombres: string,
  telefono: string,
  idProveedor:number,
  cursos:number
}

export interface RegisterModuloDTO {
  Nombres: string,
  Apellidos: string,
  Email: string,
  IdPais?: number,
  IdRegion?: number,
  Movil: string,
  IdCargo?: number,
  IdAreaFormacion?: number,
  IdAreaTrabajo?: number,
  IdIndustria?: number,
  Password: string,
}
export interface RegisterDTO {
  Nombres: string,
  Apellidos: string,
  Email: string,
  IdPais?: number,
  IdRegion?: number,
  Movil: string,
  IdCargo?: number,
  IdAreaFormacion?: number,
  IdAreaTrabajo?: number,
  IdIndustria?: number,
  Password: string,
  CategoriaDato:number,
  Tipo:string,
  IdPEspecifico:number,
}
export interface combosPerfilDTO{
  listaTipoDocumento:Array<any>,
  listaGenero:Array<any>,
  listaPais:Array<any>,
  listaCiudad:Array<any>,
  listaCargo:Array<any>,
  listaAreaTrabajo:Array<any>,
  listaAreaFormacion:Array<any>,
  listaIndustria:Array<any>,
  datosAlumno:datosAlumnoDTO
}

export interface datosAlumnoEnvioDTO {
  nombres: string,
  apellidos: string,
  idTipoDocumento: string,
  dni: string,
  email: string,
  telefono: string,
  idGenero: number,

  idPais: number,
  idDepartamento: number,
  ciudad: string,
  direccion: string,

  empresa: string,
  idCargo: number,
  idAreaTrabajo: number,
  idAreaFormacion: number,
  idIndustria: number,
}

export interface ChatBotAlumnoDTO {
  Id:0,
  Nombres: string,
  Email: string,
  Movil: string,
  IdPais?: number,
  IdRegion?: number,
  IdCargo?: number,
  IdAreaFormacion?: number,
  IdAreaTrabajo?: number,
  IdIndustria?: number,
}
