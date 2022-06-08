export interface LibroReclamacionesDTO {
  Nombre: string;
  Apellido: string;
  Domicilio: string;
  DNI: string;
  Telefono: string;
  CorreoElectronico: string;
  IdTipoServicioReclamo: number;
  DetalleServicio: string;
  OtroDetalleServicio: string;
  IdTipoReclamo: number;
  DetalleReclamo: string;
  PedidoReclamo: string;
  Referente: string;
  IdTipoDocumento: number;
}
export interface MensajeCorreoDTO {
  Asunto: string;
  Contenido: string;
  Destinatario: string;
}
