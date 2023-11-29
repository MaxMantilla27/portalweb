import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { PEspecificoCarreraExamenSaveDTO } from 'src/app/Core/Models/PEspecificoCarreraExamenDTO';
import { AgregarCalificacionCarreraExamenAlumnoDocenteDTO } from 'src/app/Core/Models/PEspecificoCarreraTrabajoDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PEspecificoCarreraExamenService {
  isBrowser: boolean;
  public urlBase = environment.url_api + "PEspecificoCarreraExamen";
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerPEspecificoCarreraExamenPorId(Id: number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(this.urlBase +"/ObtenerPEspecificoCarreraExamenPorId?Id=" +Id);
    } else {
      {
        return EMPTY;
      }
    }
  }

  public ObtenerPEspecificoCarreraExamenPorIdPespecifico(IdPEspecifico: number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(this.urlBase +"/ObtenerPEspecificoCarreraExamenPorIdPespecifico?IdPEspecifico=" +IdPEspecifico);
    } else {
      {
        return EMPTY;
      }
    }
  }

  public ObtenerpreguntasExamen(IdPwPEspecificoCarreraExamen: number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(this.urlBase +"/ObtenerpreguntasExamen?IdPwPEspecificoCarreraExamen=" +IdPwPEspecificoCarreraExamen);
    } else {
      {
        return EMPTY;
      }
    }
  }
  public ObtenerpreguntasExamenRespondidas(IdPwMatriculaAlumnoCarreraExamen: number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(this.urlBase +"/ObtenerpreguntasExamenRespondidas?IdPwMatriculaAlumnoCarreraExamen=" +IdPwMatriculaAlumnoCarreraExamen);
    } else {
      {
        return EMPTY;
      }
    }
  }
  public EliminarPEspecificoCarreraExamen(Id:number): Observable<any> {
    if (this.isBrowser) {
      return this.http.post<any>( this.urlBase +"/EliminarPEspecificoCarreraExamen?Id="+Id,{});
    } else {
      return EMPTY;
    }
  }
  public PublicarPEspecificoCarreraExamen(Id:number): Observable<any> {
    if (this.isBrowser) {
      return this.http.post<any>( this.urlBase +"/PublicarPEspecificoCarreraExamen?Id="+Id,{});
    } else {
      return EMPTY;
    }
  }

  public ImportarExel(file: File): Observable<any> {
    if (this.isBrowser) {
      const formData: FormData = new FormData();
      formData.append("file", file);
      const req = new HttpRequest("POST", `${this.urlBase}/ImportarExel`,formData,
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
  public ObtenerMatriculaAlumnoCarreraExamen(IdPEspecifico: number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(this.urlBase +"/ObtenerMatriculaAlumnoCarreraExamen?IdPEspecifico=" +IdPEspecifico);
    } else {
      {
        return EMPTY;
      }
    }
  }

  public AgregarCalificacionCarreraExamenAlumnoDocente(Json: AgregarCalificacionCarreraExamenAlumnoDocenteDTO): Observable<any> {
    if (this.isBrowser) {

      const formData: FormData = new FormData();
      formData.append("IdPwMatriculaAlumnoCarreraExamen", Json.IdPwMatriculaAlumnoCarreraExamen.toString());
      formData.append("Usuario", "docente");

      for (let i = 0; i < Json.Respuestas.length; i++) {
        var Retroalimentacion =Json.Respuestas[i].Retroalimentacion == undefined ||Json.Respuestas[i].Retroalimentacion == null ? "": Json.Respuestas[i].Retroalimentacion!.toString();

        formData.append("Respuestas[" + i + "][retroalimentacion]", Retroalimentacion);
        formData.append("Respuestas[" + i + "][Id]", Json.Respuestas[i].Id.toString());
        formData.append("Respuestas[" + i + "][Puntos]",  Json.Respuestas[i].Puntos.toString());
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
        `${this.urlBase}/AgregarCalificacionCarreraExamenAlumnoDocente`,
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
  public AgregarPEspecificoExamen(Json: PEspecificoCarreraExamenSaveDTO): Observable<any> {
    if (this.isBrowser) {
      console.log(Json);
      const formData: FormData = new FormData();
      var Id = Json.Id == null ? "" : Json.Id?.toString();
      var Descripcion = Json.Descripcion == null ? "" : Json.Descripcion?.toString();
      formData.append("Id", Id);
      formData.append("IdPEspecifico", Json.IdPEspecifico.toString());
      formData.append("Titulo", Json.Titulo);
      formData.append("Descripcion", Descripcion);
      formData.append("PlazoEntrega", Json.PlazoEntrega.toString());
      formData.append("CalificacionMaxima", Json.CalificacionMaxima.toString());
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
      const req = new HttpRequest("POST",`${this.urlBase}/AgregarPEspecificoExamen`,formData,
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
}
