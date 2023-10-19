import { isPlatformBrowser } from "@angular/common";
import { HttpClient, HttpRequest } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Observable, EMPTY } from "rxjs";
import {
  PEspecificoSesionCuestionarioSaveDTO,
  PEspecificoSesionTareaSaveDTO,
  PEspecificoSesionMaterialAdicionalSaveDTO,
  PEspecificoSesionTareaAlumnoSaveParamsDTO,
  AgregarPEspecificoSesionCuestionarioAlumnoDTO,
  AgregarCalificacionCuestionarioAlumnoDocenteDTO,
  CalificarTareaAlumnoOnlineDTO,
} from "src/app/Core/Models/PEspecificoEsquema";
import { PespecificoSesionTemaUpdateOrdenDTO } from "src/app/Core/Models/PespecificoSesionTemaDTO";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class PEspecificoEsquemaService {
  isBrowser: boolean;
  public urlBase = environment.url_api + "PEspecificoEsquema";
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerpreguntasSesion(
    IdPwPEspecificoSesionCuestionario: number
  ): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(
        this.urlBase +
          "/ObtenerpreguntasSesion?IdPwPEspecificoSesionCuestionario=" +
          IdPwPEspecificoSesionCuestionario
      );
    } else {
      return EMPTY;
    }
  }
  public ObtenerpreguntasSesionV2(
    IdPwPEspecificoSesionCuestionario: number
  ): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(
        this.urlBase +
          "/ObtenerpreguntasSesionV2?IdPwPEspecificoSesionCuestionario=" +
          IdPwPEspecificoSesionCuestionario
      );
    } else {
      return EMPTY;
    }
  }
  public ObtenerActividadesRecursoSesionDocente(
    IdPEspecificoSesion: number
  ): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(
        this.urlBase +
          "/ObtenerActividadesRecursoSesionDocente?IdPEspecificoSesion=" +
          IdPEspecificoSesion
      );
    } else {
      return EMPTY;
    }
  }
  public ObtenerActividadesRecursoSesionAlumno(IdPEspecificoSesion: number,IdMatriculaCabecera:number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(this.urlBase +"/ObtenerActividadesRecursoSesionAlumno?IdPEspecificoSesion=" +IdPEspecificoSesion+'&IdMatriculaCabecera='+IdMatriculaCabecera
      );
    } else {
      return EMPTY;
    }
  }
  public ObtenerActividadesRecursoSesionAlumnoPorIds(IdPEspecificoSesionCuestionario: number,IdMatriculaCabecera:number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(this.urlBase +"/ObtenerActividadesRecursoSesionAlumnoPorIds?IdPEspecificoSesionCuestionario=" +IdPEspecificoSesionCuestionario+'&IdMatriculaCabecera='+IdMatriculaCabecera
      );
    } else {
      return EMPTY;
    }
  }
  public ObtenerMaterialAdicionalDocentePespecifico(
    IdPEspecifico: number
  ): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(
        this.urlBase +
          "/ObtenerMaterialAdicionalDocentePespecifico?IdPEspecifico=" +
          IdPEspecifico
      );
    } else {
      return EMPTY;
    }
  }
  public ObtenerCriteriosPorProgramaEspecifico(
    IdPEspecifico: number
  ): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(
        this.urlBase +
          "/ObtenerCriteriosPorProgramaEspecifico?IdPEspecifico=" +
          IdPEspecifico
      );
    } else {
      return EMPTY;
    }
  }
  public ObtenerPEspecificoSesionTareaPorId(Id: number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(
        this.urlBase + "/ObtenerPEspecificoSesionTareaPorId?Id=" + Id
      );
    } else {
      return EMPTY;
    }
  }
  public ObtenerPEspecificoSesionMaterialAdicionalPorId(
    Id: number
  ): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(
        this.urlBase +
          "/ObtenerPEspecificoSesionMaterialAdicionalPorId?Id=" +
          Id
      );
    } else {
      return EMPTY;
    }
  }
  public AgregarPEspecificoSesionCuestionarioAlumno(json: AgregarPEspecificoSesionCuestionarioAlumnoDTO): Observable<any> {
    if (this.isBrowser) {
      return this.http.post<any>( this.urlBase +"/AgregarPEspecificoSesionCuestionarioAlumno" ,json);
    } else {
      return EMPTY;
    }
  }
  public ObtenerPEspecificoSesionCuestionarioPorId(
    Id: number
  ): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(
        this.urlBase + "/ObtenerPEspecificoSesionCuestionarioPorId?Id=" + Id
      );
    } else {
      return EMPTY;
    }
  }
  public ObtenerPEspecificoSesionCuestionarioPreguntaAlternativaPorIdPregunta(
    Id: number
  ): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(
        this.urlBase +
          "/ObtenerPEspecificoSesionCuestionarioPreguntaAlternativaPorIdPregunta?Id=" +
          Id
      );
    } else {
      return EMPTY;
    }
  }
  public ObtenerPreguntaTipo(): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(this.urlBase + "/ObtenerPreguntaTipo");
    } else {
      return EMPTY;
    }
  }
  public AgregarPEspecificoCuestionario(
    Json: PEspecificoSesionCuestionarioSaveDTO
  ): Observable<any> {
    if (this.isBrowser) {
      console.log(Json);
      const formData: FormData = new FormData();
      var Id = Json.Id == null ? "" : Json.Id?.toString();
      var Descripcion =
        Json.Descripcion == null ? "" : Json.Descripcion?.toString();
      var IdPEspecificoSesion =Json.IdPEspecificoSesion == null ? "": Json.IdPEspecificoSesion?.toString();
      var FechaEntregaSecundaria =Json.FechaEntregaSecundaria == null ? "": Json.FechaEntregaSecundaria?.toString();
      formData.append("Id", Id);
      formData.append("IdPEspecificoSesion", IdPEspecificoSesion);
      formData.append("Titulo", Json.Titulo);
      formData.append("Descripcion", Descripcion);
      formData.append("FechaEntrega", Json.FechaEntrega);
      formData.append("FechaEntregaSecundaria", FechaEntregaSecundaria);
      formData.append("IdCriterioEvaluacion",Json.IdCriterioEvaluacion.toString());
      formData.append("CalificacionMaxima", Json.CalificacionMaxima.toString());
      formData.append("CalificacionMaximaSecundaria", Json.CalificacionMaximaSecundaria.toString());
      formData.append("TiempoLimite", Json.TiempoLimite.toString());
      formData.append("Usuario", "docente");
      if (Json.Preguntas.length == 0) {
        formData.append("Preguntas", "[]");
      }
      let indexf = 0;
      for (let i = 0; i < Json.Preguntas.length; i++) {
        //formData.append("Preguntas[' + i + ']", JSON.stringify(Json.Preguntas[i]));
        var IdPreguntaTipo =
          Json.Preguntas[i].IdPreguntaTipo == undefined ||
          Json.Preguntas[i].IdPreguntaTipo == null
            ? ""
            : Json.Preguntas[i].IdPreguntaTipo!.toString();
        var NombreArchivo =
          Json.Preguntas[i].NombreArchivo == undefined ||
          Json.Preguntas[i].NombreArchivo == null
            ? ""
            : Json.Preguntas[i].NombreArchivo!.toString();
        var UrlArchivoSubido =
          Json.Preguntas[i].UrlArchivoSubido == undefined ||
          Json.Preguntas[i].UrlArchivoSubido == null
            ? ""
            : Json.Preguntas[i].UrlArchivoSubido!.toString();
        var Retroalimentacion =
          Json.Preguntas[i].Retroalimentacion == undefined ||
          Json.Preguntas[i].Retroalimentacion == null
            ? ""
            : Json.Preguntas[i].Retroalimentacion!.toString();
        var NombreArchivoRetroalimentacion =
          Json.Preguntas[i].NombreArchivoRetroalimentacion == undefined ||
          Json.Preguntas[i].NombreArchivoRetroalimentacion == null
            ? ""
            : Json.Preguntas[i].NombreArchivoRetroalimentacion!.toString();
        var UrlArchivoSubidoRetroalimentacion =
          Json.Preguntas[i].UrlArchivoSubidoRetroalimentacion == undefined ||
          Json.Preguntas[i].UrlArchivoSubidoRetroalimentacion == null
            ? ""
            : Json.Preguntas[i].UrlArchivoSubidoRetroalimentacion!.toString();
        var Descriocion2 =
          Json.Preguntas[i].Descripcion == undefined ||
          Json.Preguntas[i].Descripcion == null
            ? ""
            : Json.Preguntas[i].Descripcion!.toString();
        formData.append("Preguntas[" + i + "][idPreguntaTipo]", IdPreguntaTipo);
        formData.append(
          "Preguntas[" + i + "][enunciado]",
          Json.Preguntas[i].Enunciado.toString()
        );
        formData.append(
          "Preguntas[" + i + "][descripcion]",Descriocion2
        );
        formData.append(
          "Preguntas[" + i + "][puntaje]",
          Json.Preguntas[i].Puntaje.toString()
        );
        formData.append("Preguntas[" + i + "][file]", Json.Preguntas[i].file);

        formData.append(
          "Preguntas[" + i + "][fileRetroalimentacion]",
          Json.Preguntas[i].fileRetroalimentacion
        );
        formData.append("Preguntas[" + i + "][nombreArchivo]", NombreArchivo);
        formData.append(
          "Preguntas[" + i + "][urlArchivoSubido]",
          UrlArchivoSubido
        );
        formData.append(
          "Preguntas[" + i + "][retroalimentacion]",
          Retroalimentacion
        );
        formData.append(
          "Preguntas[" + i + "][nombreArchivoRetroalimentacion]",
          NombreArchivoRetroalimentacion
        );
        formData.append(
          "Preguntas[" + i + "][urlArchivoSubidoRetroalimentacion]",
          UrlArchivoSubidoRetroalimentacion
        );
        formData.append(
          "Preguntas[" + i + "][id]",
          Json.Preguntas[i].Id.toString()
        );

        if (Json.Preguntas[i].file.size > 0) {
          var end = Json.Preguntas[i].file.name.split(".")[1];
          formData.append(
            "files",
            Json.Preguntas[i].file,
            "f-" + i + "." + end
          );
          indexf++;
        }
        if (Json.Preguntas[i].fileRetroalimentacion.size > 0) {
          var end = Json.Preguntas[i].fileRetroalimentacion.name.split(".")[1];
          formData.append(
            "files",
            Json.Preguntas[i].fileRetroalimentacion,
            "r-" + i + "." + end
          );
          indexf++;
        }
        if (Json.Preguntas[i].Alternativas.length == 0) {
          formData.append("Preguntas[" + i + "][alternativas]", "[]");
        }

        for (let j = 0; j < Json.Preguntas[i].Alternativas.length; j++) {
          var IdAlt =
            Json.Preguntas[i].Alternativas[j].Id == undefined ||
            Json.Preguntas[i].Alternativas[j].Id == null
              ? ""
              : Json.Preguntas[i].Alternativas[j].Id!.toString();
          formData.append(
            "Preguntas[" + i + "][Alternativas][" + j + "][Id]",
            IdAlt.toString()
          );
          formData.append(
            "Preguntas[" + i + "][Alternativas][" + j + "][Alternativa]",
            Json.Preguntas[i].Alternativas[j].Alternativa.toString()
          );
          formData.append(
            "Preguntas[" + i + "][Alternativas][" + j + "][EsCorrecta]",
            Json.Preguntas[i].Alternativas[j].EsCorrecta.toString()
          );
          formData.append(
            "Preguntas[" + i + "][Alternativas][" + j + "][Puntaje]",
            Json.Preguntas[i].Alternativas[j].Puntaje.toString()
          );
        }
      }
      const req = new HttpRequest(
        "POST",
        `${this.urlBase}/AgregarPEspecificoCuestionario`,
        formData,
        {
          reportProgress: true,
          responseType: "json",
        }
      );
      return this.http.request(req);
    } else {
      return EMPTY;
    }
  }
  public AgregarPEspecificoSesionTarea(
    Json: PEspecificoSesionTareaSaveDTO
  ): Observable<any> {
    if (this.isBrowser) {
      const formData: FormData = new FormData();
      var Id = Json.Id == null ? "" : Json.Id?.toString();
      var Descripcion =
        Json.Descripcion == null ? "" : Json.Descripcion?.toString();
      var IdPEspecificoSesion =Json.IdPEspecificoSesion == null? "": Json.IdPEspecificoSesion?.toString();
      var FechaEntregaSecundaria =Json.FechaEntregaSecundaria == null ? "": Json.FechaEntregaSecundaria?.toString();
      formData.append("file", Json.file);
      formData.append("Id", Id);
      formData.append("IdPEspecificoSesion", IdPEspecificoSesion);
      formData.append("Titulo", Json.Titulo);
      formData.append("Descripcion", Descripcion);
      formData.append("FechaEntrega", Json.FechaEntrega);
      formData.append("FechaEntregaSecundaria", FechaEntregaSecundaria);
      formData.append("IdCriterioEvaluacion",Json.IdCriterioEvaluacion.toString());
      formData.append("CalificacionMaxima", Json.CalificacionMaxima.toString());
      formData.append("CalificacionMaximaSecundaria", Json.CalificacionMaximaSecundaria.toString());
      formData.append("TieneArchivo", Json.TieneArchivo.toString());
      formData.append("Usuario", "docente");
      const req = new HttpRequest(
        "POST",
        `${this.urlBase}/AgregarPEspecificoSesionTarea`,
        formData,
        {
          reportProgress: true,
          responseType: "json",
        }
      );
      return this.http.request(req);
    } else {
      return EMPTY;
    }
  }

  public AgregarPEspecificoSesionTareaAlumno(
    Json: PEspecificoSesionTareaAlumnoSaveParamsDTO
  ): Observable<any> {
    if (this.isBrowser) {
      const formData: FormData = new FormData();
      formData.append("file", Json.file);
      formData.append("IdPEspecificoSesion", Json.IdPEspecificoSesion.toString());
      formData.append("IdPwPEspecificoSesionTarea", Json.IdPwPEspecificoSesionTarea.toString());
      formData.append("IdMatriculaCabecera", Json.IdMatriculaCabecera.toString());
      formData.append("Usuario", "docente");
      const req = new HttpRequest(
        "POST",
        `${this.urlBase}/AgregarPEspecificoSesionTareaAlumno`,
        formData,
        {
          reportProgress: true,
          responseType: "json",
        }
      );
      return this.http.request(req);
    } else {
      return EMPTY;
    }
  }
  public AgregarPEspecificoSesionMaterialAdicional(
    Json: PEspecificoSesionMaterialAdicionalSaveDTO
  ): Observable<any> {
    if (this.isBrowser) {
      const formData: FormData = new FormData();
      var Id = Json.Id == null ? "" : Json.Id?.toString();
      var IdPEspecificoSesion =
        Json.IdPEspecificoSesion == null
          ? ""
          : Json.IdPEspecificoSesion?.toString();
      formData.append("file", Json.file);
      formData.append("Id", Id);
      formData.append("IdPEspecificoSesion", IdPEspecificoSesion);
      formData.append("Usuario", "docente");
      const req = new HttpRequest(
        "POST",
        `${this.urlBase}/AgregarPEspecificoSesionMaterialAdicional`,
        formData,
        {
          reportProgress: true,
          responseType: "json",
        }
      );
      return this.http.request(req);
    } else {
      return EMPTY;
    }
  }
  public ImportarExel(file: File): Observable<any> {
    if (this.isBrowser) {
      const formData: FormData = new FormData();
      formData.append("file", file);
      const req = new HttpRequest(
        "POST",
        `${this.urlBase}/ImportarExel`,
        formData,
        {
          reportProgress: true,
          responseType: "json",
        }
      );
      return this.http.request(req);
    } else {
      return EMPTY;
    }
  }
  public dowloadFile(url: string):any {
    return  this.http.get(url, { responseType: "blob" });
  }

  public ObtenerTareaAulumnoPorIdPEspecificoSesionTarea(
    IdPwPEspecificoSesionTarea: number
  ): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(
        this.urlBase +
          "/ObtenerTareaAulumnoPorIdPEspecificoSesionTarea?IdPwPEspecificoSesionTarea=" +
          IdPwPEspecificoSesionTarea
      );
    } else {
      return EMPTY;
    }
  }
  public ObtenerCriteriosEvaluacionPespecifico(IdPEspecificoSesion:number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(this.urlBase + "/ObtenerCriteriosEvaluacionPespecifico?IdPEspecificoSesion=" +IdPEspecificoSesion);
    } else {
      return EMPTY;
    }
  }
  public ObtenerListaCuestionarioAlumnoOnline(IdPwPEspecificoSesionCuestionario:number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(this.urlBase + "/ObtenerListaCuestionarioAlumnoOnline?IdPwPEspecificoSesionCuestionario=" +IdPwPEspecificoSesionCuestionario);
    } else {
      return EMPTY;
    }
  }
  public ObtenerListaTareaAlumnoOnline(IdPwPEspecificoSesionTarea:number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(this.urlBase + "/ObtenerListaTareaAlumnoOnline?IdPwPEspecificoSesionTarea=" +IdPwPEspecificoSesionTarea);
    } else {
      return EMPTY;
    }
  }

  public CalificarTareaAlumnoOnline(json: Array<CalificarTareaAlumnoOnlineDTO>): Observable<any> {
    if (this.isBrowser) {

      const formData: FormData = new FormData();
      console.log(json)
      formData.append("Usuario", 'Docencia');
      for (let i = 0; i < json.length; i++) {
        var Retroalimentacion =json[i].Retroalimentacion == undefined ||json[i].Retroalimentacion == null? "": json[i].Retroalimentacion!.toString();
        formData.append("data[" + i + "].id", json[i].Id.toString());
        formData.append("data[" + i + "].nota", json[i].Nota.toString());
        formData.append("data[" + i + "].retroalimentacion", Retroalimentacion);
        if (json[i].file.size > 0) {
          var end = json[i].file.name.split(".")[1];
          formData.append(
            "files",
            json[i].file,
            i + "." + end
          );
        }
      }
      const req = new HttpRequest("POST",`${this.urlBase}/CalificarTareaAlumnoOnline`, formData,{reportProgress: true,responseType: "json", });
      return this.http.request(req);
    } else {
      return EMPTY;
    }
  }

  public AgregarCalificacionCuestionarioAlumnoDocente(Json: AgregarCalificacionCuestionarioAlumnoDocenteDTO): Observable<any> {
    if (this.isBrowser) {

      const formData: FormData = new FormData();
      formData.append("IdPwPEspecificoSesionCuestionarioAlumno", Json.IdPwPEspecificoSesionCuestionarioAlumno.toString());
      formData.append("Usuario", "docente");

      for (let i = 0; i < Json.Respuestas.length; i++) {
        var Retroalimentacion =Json.Respuestas[i].Retroalimentacion == undefined ||Json.Respuestas[i].Retroalimentacion == null ? "": Json.Respuestas[i].Retroalimentacion!.toString();

        formData.append("Respuestas[" + i + "][retroalimentacion]", Retroalimentacion);
        formData.append("Respuestas[" + i + "][Id]", Json.Respuestas[i].Id.toString());
        formData.append("Respuestas[" + i + "][Puntos]",  Json.Respuestas[i].Puntos.toString());
        formData.append("Respuestas[" + i + "][Correcto]",  Json.Respuestas[i].Correcto.toString());
        if (Json.Respuestas[i].file!=null && Json.Respuestas[i].file.size > 0) {
          var end = Json.Respuestas[i].file.name.split(".")[1];
          formData.append(
            "files",
            Json.Respuestas[i].file,
            i + "." + end
          );
        }
      }

      console.log(formData)
      const req = new HttpRequest(
        "POST",
        `${this.urlBase}/AgregarCalificacionCuestionarioAlumnoDocente`,
        formData,
        {
          reportProgress: true,
          responseType: "json",
        }
      );
      return this.http.request(req);
      //return this.http.post<any>( this.urlBase +"/AgregarCalificacionCuestionarioAlumnoDocente" ,Json);
    } else {
      return EMPTY;
    }
  }
  public EliminarPEspecificoSesionCuestionario(IdCuestionario:number): Observable<any> {
    if (this.isBrowser) {
      return this.http.post<any>( this.urlBase +"/EliminarPEspecificoSesionCuestionario?IdCuestionario="+IdCuestionario,{});
    } else {
      return EMPTY;
    }
  }
  public EliminarPEspecificoSesionMaterialAdicional(IdMaterialAdicional:number): Observable<any> {
    if (this.isBrowser) {
      return this.http.post<any>( this.urlBase +'/EliminarPEspecificoSesionMaterialAdicional?IdMaterialAdicional='+IdMaterialAdicional,{});
    } else {
      return EMPTY;
    }
  }
  public EliminarPEspecificoSesionTarea(IdTarea:number): Observable<any> {
    if (this.isBrowser) {
      return this.http.post<any>( this.urlBase +"/EliminarPEspecificoSesionTarea?IdTarea="+IdTarea,{});
    } else {
      return EMPTY;
    }
  }

  public OrdenarCuestionario(Json:PespecificoSesionTemaUpdateOrdenDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/OrdenarCuestionario',Json);
    }else{
      return EMPTY;
    }
  }
  public OrdenarTarea(Json:PespecificoSesionTemaUpdateOrdenDTO):Observable<any>{
    if(this.isBrowser){
      console.log(Json)
      return this.http.post<any>(this.urlBase+'/OrdenarTarea',Json);
    }else{
      return EMPTY;
    }
  }
  public ObtenerDetalleCuestionarioVistaPrevia(IdPEspecificoSesionCuestionario: number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(this.urlBase +"/ObtenerDetalleCuestionarioVistaPrevia?IdPEspecificoSesionCuestionario=" +IdPEspecificoSesionCuestionario);
    } else {
      {
        return EMPTY;
      }
    }
  }
  public ObtenerTipoCriteriosPorProgramaEspecifico(
    IdPEspecifico: number,IdTipoCriterioEvaluacion:number
  ): Observable<any> {
    console.log(IdPEspecifico)
    console.log(IdTipoCriterioEvaluacion)
    if (this.isBrowser) {
      return this.http.get<any>(
        this.urlBase +
          "/ObtenerTipoCriteriosPorProgramaEspecifico?IdPEspecifico=" +
          IdPEspecifico + '&IdTipoCriterioEvaluacion='+IdTipoCriterioEvaluacion
      );
    } else {
      return EMPTY;
    }
  }
  public ResetearCuestionarioAlumno(IdPEspecificoSesionCuestionario: number): Observable<any> {
    console.log(IdPEspecificoSesionCuestionario)
    if (this.isBrowser) {
      return this.http.post<any>(this.urlBase +"/ResetearCuestionarioAlumno?IdPEspecificoSesionCuestionario=" +IdPEspecificoSesionCuestionario,{});
    } else {
      {
        return EMPTY;
      }
    }
  }
  public ResetearTareaAlumno(IdPEspecificoSesionTarea: number): Observable<any> {
    if (this.isBrowser) {
      return this.http.post<any>(this.urlBase +"/ResetearTareaAlumno?IdPEspecificoSesionTarea=" +IdPEspecificoSesionTarea,{});
    } else {
      {
        return EMPTY;
      }
    }
  }

  public ObtenerPuntajePreguntasPorCuestionario(IdPEspecificoSesionCuestionario: number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(this.urlBase +"/ObtenerPuntajePreguntasPorCuestionario?IdPEspecificoSesionCuestionario=" +IdPEspecificoSesionCuestionario);
    } else {
      {
        return EMPTY;
      }
    }
  }

}
