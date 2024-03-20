export interface CursoPadreDTO {
  idMatriculaCabecera: number;
  idAlumno: number;
  idPGeneral: number;
  programaGeneral: string;
  idPEspecifico: number;
  idModalidad: number;
  modalidad: string;
  listaCursoMatriculado: Array<ListadoCursosHijosDTO>;
}
export interface ListadoCursosHijosDTO {
  idPEspecificoHijo: number;
  idPGeneralHijo: number;
  programaGeneralHijo: string;
  idModalidadHijo: number;
  modalidadHijo: string;
  imgPortada: string;
  progreso:ProgresoAlumnoProgramaAulaVirtualDTO,
  params:string,
  convalidado:boolean,
  habilitado?:Boolean,
  porcentaje:number,
  fechasOnline?:any,
  fechasOnlineActive?:boolean,
  tareas: number;
  tareasEnviadas:number;
  cuestionarios:number;
  cuestionariosEnviados:number;
  pendientes:number;
  sesiones:number;
  sesionesFaltantes:number;
}
export interface ProgresoAlumnoProgramaAulaVirtualDTO {
  progresoVideo: Array<ProgresoAlumnoProgramaVideosAulaVirtualDTO>;
  progresoEncuesta: Array<ProgresoAlumnoProgramaEncuestasAulaVirtualDTO>;
  progresoTarea: Array<ProgresoAlumnoProgramaTareasAulaVirtualDTO>;
}

export interface ProgresoAlumnoProgramaVideosAulaVirtualDTO {
  idMatriculaCabecera: number;
  idPGeneralPadre: number;
  idPGeneralHijo: number;
  OrdenSeccion: number;
  idAlumno: number;
  porcentaje: number;
}
export interface ProgresoAlumnoProgramaEncuestasAulaVirtualDTO {
  idMatriculaCabecera: number;
  idPEspecifico: number;
  idAlumno: number;
  idPGeneralPadre: number;
  idPGeneralHijo: number;
  examenProgramados: number;
  examenRealizado: number;
  completado: number;
  porcentajeAvance:number,
}
export interface ProgresoAlumnoProgramaTareasAulaVirtualDTO {
  idMatriculaCabecera: number;
  idPEspecifico: number;
  idAlumno: number;
  idPGeneralPadre: number;
  idPGeneralHijo: number;
  tareasProgramadas: number;
  tareasRealizadas: number;
  completado: number;
  porcentajeAvance:number,
}
