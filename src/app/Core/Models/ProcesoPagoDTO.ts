export interface RegistroPreProcesoPagoDTO {
  IdPGeneral: number;
  IdMatriculaCabecera: number;
  IdFormaPago: number;
  IdPasarelaPago: number;
  MedioCodigo: string;
  MedioPago: string;
  WebMoneda: string;
  Moneda: string;
  SimboloMoneda: string;
  ListaCuota: Array<RegistroPreProcesoPagoCuotaDTO>;
}
export interface PagoOrganicoAlumnoDTO {
  IdPGeneral: number;
  IdPEspecifico: number;
  IdMontoPago: number;
  MontoTotalPago: number;
  CodigoBanco: string;
  TipoProveedor: string;
  IdPasarelaPago: string;
  RequiereTarjeta: boolean;
  IdPais: number;
  WebMoneda: number;
  MedioCodigo?: string;
  MedioPago?: string;
  Moneda?: string;
  IdFormaPago: number;
  Version: string;
  Tipo: string;
  Inicio: string;
  IdBusqueda: number,
  TipoComprobante?: boolean;
  CodigoTributario?: string;
}
export interface RegistroPreProcesoPagoCuotaDTO {
  IdCuota: number;
  NroCuota: number;
  TipoCuota: string;
  Cuota: number;
  Mora: number;
  MoraCalculada: number;
  CuotaTotal: number;
  FechaVencimiento?: Date;
  Nombre: string;
}
export interface RegistroRespuestaPreProcesoPagoDTO {
  IdentificadorTransaccion: string;
  RequiereDatosTarjeta: boolean;
}

export interface RegistroProcesoPagoAlumnoDTO {
  IdentificadorTransaccion: string;
  RequiereDatosTarjeta: boolean;
  MedioPago: string;
  MedioCodigo: string;
  TransactionToken: string;
  Estado: boolean | null;
  Comprobante: boolean;
  TarjetaHabiente: RegistroProcesoPagoTarjetaHabienteDTO;
  RazonSocial: string;
  CodigoTributario: string;
  IdPasarelaPago: number;
  IdentificadorUsuario?: string;
  DeviceSessionId?: string;
  TokenId?: string;
  RegistroProcesoPagoPse?: RegistroProcesoPagoPseDTO;
  PagoPSE:boolean;
  FechaFinalAfiliacion?: string|Date;
}
export interface RegistroProcesoPagoTarjetaHabienteDTO {
  Titular: string;
  NumeroTarjeta: string;
  Mes: string;
  Aniho: string;
  CodigoVV: string;
  NumeroDocumento: string;
  fecha: string;
}
export interface RegistroProcesoPagoPseDTO {
  BancoPSE: string;
  TipoClientePSE: string;
  TipoDocumentoPSE: string;
  NumeroDocumentoPSE: string;
  NombreTitularPSE: string;
  TelefonoTitularPSE: string;
}
