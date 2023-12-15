export interface FormularioContactoDTO
{
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
  Comentario?: string,
  idLocalidad?: string
}
export interface FormularioContactoShortDTO
{

  Nombres: string,
  Apellidos: string,
  Email: string,
  IdPais?: number,
  IdRegion?: number,
  Movil: string,
  IdLocalidad?: any,
}

export interface FormularioLandingPageDTO
{
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
}

export interface FormularioPublicidadDTO
{
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
}
