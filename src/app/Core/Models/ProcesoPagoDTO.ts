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

export interface RegistroPreProcesoPagoCuotaDTO {
  IdCuota: number;
  NroCuota: number;
  TipoCuota: string;
  Cuota: number;
  Mora: number;
  MoraCalculada: number;
  CuotaTotal: number;
}
export interface RegistroRespuestaPreProcesoPagoDTO {
  IdentificadorTransaccion: string;
  RequiereDatosTarjeta: boolean;
}

export interface RegistroProcesoPagoAlumnoDTO {
  IdentificadorTransaccion: string;
  RequiereDatosTarjeta:boolean;
  MedioPago: string;
  MedioCodigo: string;
  TransactionToken:string;
  Estado:boolean|null;
  Comprobante:number;
  TarjetaHabiente: RegistroProcesoPagoTarjetaHabienteDTO;
}
export interface RegistroProcesoPagoTarjetaHabienteDTO {
  Titular: string;
  NumeroTarjeta: string;
  Mes: string;
  Aniho: string;
  CodigoVV: string;
  NumeroDocumento: string;
}
