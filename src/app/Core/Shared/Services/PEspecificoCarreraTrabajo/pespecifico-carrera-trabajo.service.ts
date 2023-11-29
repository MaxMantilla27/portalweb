import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { AgregarCalificacionCarreraExamenAlumnoDocenteDTO, CalificarTrabajoCarreraFileDataDTO, PEspecificoCarreraTrabajoDTO } from 'src/app/Core/Models/PEspecificoCarreraTrabajoDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PEspecificoCarreraTrabajoService {

  isBrowser: boolean;
  public urlBase = environment.url_api + "PEspecificoCarreraTrabajo";
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ObtenerPEspecificoCarreraTrabajoPorId(Id: number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(this.urlBase +"/ObtenerPEspecificoCarreraTrabajoPorId?Id=" +Id);
    } else {
      {
        return EMPTY;
      }
    }
  }
  public ObtenerPEspecificoCarreraTrabajoPorIdPespecifico(IdPEspecifico: number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(this.urlBase +"/ObtenerPEspecificoCarreraTrabajoPorIdPespecifico?IdPEspecifico=" +IdPEspecifico);
    } else {
      {
        return EMPTY;
      }
    }
  }

  public EliminarPEspecificoCarreraTrabajo(Id:number): Observable<any> {
    if (this.isBrowser) {
      return this.http.post<any>( this.urlBase +"/EliminarPEspecificoCarreraTrabajo?Id="+Id,{});
    } else {
      return EMPTY;
    }
  }

  public PublicarPEspecificoCarreraTrabajo(Id:number): Observable<any> {
    if (this.isBrowser) {
      return this.http.post<any>( this.urlBase +"/PublicarPEspecificoCarreraTrabajo?Id="+Id,{});
    } else {
      return EMPTY;
    }
  }

  public AgregarPEspecificoCarreraTrabajo(Json: PEspecificoCarreraTrabajoDTO): Observable<any> {
    if (this.isBrowser) {
      const formData: FormData = new FormData();
      var Id = Json.Id == null ? "" : Json.Id?.toString();
      var Descripcion =Json.Descripcion == null ? "" : Json.Descripcion?.toString();
      formData.append("file", Json.file);
      formData.append("Id", Id);
      formData.append("IdPEspecifico", Json.IdPEspecifico.toString());
      formData.append("Titulo", Json.Titulo);
      formData.append("Descripcion", Descripcion);
      formData.append("PlazoEntrega",Json.PlazoEntrega.toString());
      formData.append("CalificacionMaxima", Json.CalificacionMaxima.toString());
      formData.append("TieneArchivo", Json.TieneArchivo.toString());
      formData.append("Usuario", "docente");
      const req = new HttpRequest("POST", `${this.urlBase}/AgregarPEspecificoCarreraTrabajo`,formData,
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
  public ObtenerMatriculaAlumnoCarreraTrabajo(IdPEspecifico: number): Observable<any> {
    if (this.isBrowser) {
      return this.http.get<any>(this.urlBase +"/ObtenerMatriculaAlumnoCarreraTrabajo?IdPEspecifico=" +IdPEspecifico);
    } else {
      {
        return EMPTY;
      }
    }
  }


  public CalificarTrabajoCarrera(json: Array<CalificarTrabajoCarreraFileDataDTO>): Observable<any> {
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
      const req = new HttpRequest("POST",`${this.urlBase}/CalificarTrabajoCarrera`, formData,{reportProgress: true,responseType: "json", });
      return this.http.request(req);
    } else {
      return EMPTY;
    }
  }
}
