export interface DatosAlumnoValidacionDTO {
  Nombres: string;
  Apellidos: string;
}
export interface InsertarRegistroEnvioFisicoDTO {
  Id: number;
  IdAlumno: number;
  IdMatriculaCabecera: number;
  CodigoMatricula: string;
  IdPGeneral: number;
  IdPEspecifico: number;
  Region: string;
  Distrito: string;
  Referencia: string;
  Nombre: string;
  Apellido: string;
  Telefono: string;
  IdAspNetUsers: string;
  CodigoPostal: string;
  Usuario: string;
  IdSolicitudCertificadoFisico?:number;
  DNI: string;
  Ciudad: string;
  Mensaje: string;
  Direccion: string;
  IdCertificadoGeneradoAutomatico?:number;
}
