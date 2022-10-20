export interface InteraccionFormularioCampoDTO {
  IdInteraccionPortalV2: number;
  IdInteraccionPortalPaginaV2: number;
  Nombre: string;
  IdConjuntoAnuncio: any;
  IdCategoriaOrigen: any;
  IdTipoInteraccionPortalFormulario: number;
  Acciones: Array<string>;
  AccionesJson: any;
}
