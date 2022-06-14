export interface CursoPadrePruebaDTO {
  idRegistroPrueba: number;
  idAlumno: number;
  idPGeneral: number;
  programaGeneral: string;
  idPEspecifico: number;
  idModalidad: number;
  modalidad: string;
  listaCursoMatriculado: Array<ListadoCursosHijosPruebaDTO>;
}
export interface ListadoCursosHijosPruebaDTO {
  idPEspecificoHijo: number;
  idPGeneralHijo: number;
  programaGeneralHijo: string;
  idModalidadHijo: number;
  modalidadHijo: string;
  imgPortada: string;
  progreso:ProgresoAlumnoProgramaAulaVirtualPruebaDTO;
  params:string
}
export interface ProgresoAlumnoProgramaAulaVirtualPruebaDTO {
  progresoVideo: Array<ProgresoAlumnoProgramaVideosAulaVirtualPruebaDTO>;
}
export interface ProgresoAlumnoProgramaVideosAulaVirtualPruebaDTO {
  idRegistroPrueba: number;
  idPGeneralPadre: number;
  idPGeneralHijo: number;
  OrdenSeccion: number;
  idAlumno: number;
  porcentaje: number;
}
