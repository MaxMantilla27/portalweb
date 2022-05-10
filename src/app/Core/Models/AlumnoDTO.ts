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
  idGenero: number,
  idIndustria: number,
  idPais: number,
  idTipoDocumento: string,
  nombres: string,
  telefono: string
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
